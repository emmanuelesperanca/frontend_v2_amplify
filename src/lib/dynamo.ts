/**
 * DynamoDB client and data-access helpers for Neoson chat history.
 *
 * Single-Table Design — table: neoson-chat-history
 *
 * Item types:
 *   SESSION  → PK="SESSION#<convId>"  SK="METADATA"
 *   MESSAGE  → PK="SESSION#<convId>"  SK="MSG#<iso-timestamp>#<msgId>"
 *
 * GSI (GSI-UserSessions):
 *   PK=user_id  SK=created_at  → list all sessions for a user
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';

// ── Client (server-side only) ─────────────────────────────────────────────────

/** Reuse HTTPS agent across requests — avoids TCP handshake on every DynamoDB call */
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });

const _ddb = new DynamoDBClient({
  region: process.env.AGENT_REGION ?? 'us-east-2',
  credentials: fromNodeProviderChain(),
  requestHandler: new NodeHttpHandler({ httpsAgent }),
});

export const docClient = DynamoDBDocumentClient.from(_ddb, {
  marshallOptions: { removeUndefinedValues: true },
});

export const TABLE = process.env.DYNAMODB_TABLE ?? 'neoson-chat-history';

const TTL_DAYS = 60;

function ttlExpiry(): number {
  return Math.floor(Date.now() / 1000) + TTL_DAYS * 24 * 60 * 60;
}

// ── Key helpers ───────────────────────────────────────────────────────────────

const convPk  = (convId: string) => `SESSION#${convId}`;
const msgSk   = (iso: string, msgId: string) => `MSG#${iso}#${msgId}`;
const META_SK = 'METADATA';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SessionRecord {
  /** Stable conversation ID (DynamoDB PK, never changes) */
  id: string;
  /**
   * Active AgentCore runtimeSessionId.
   * Starts equal to `id` but may be refreshed when an AgentCore session expires.
   * Storing it lets us try to resume the exact AgentCore context on return.
   */
  agentCoreSessionId: string;
  userId: string;
  agentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  userId: string;
  agentId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;   // ISO-8601
  isError?: boolean;
}

// ── Session (conversation) operations ────────────────────────────────────────

export async function createSession(s: SessionRecord): Promise<void> {
  await docClient.send(new PutCommand({
    TableName: TABLE,
    Item: {
      PK:                   convPk(s.id),
      SK:                   META_SK,
      user_id:              s.userId,
      agent_id:             s.agentId,
      agentcore_session_id: s.agentCoreSessionId,
      title:                s.title,
      created_at:           s.createdAt,
      updated_at:           s.updatedAt,
      item_type:            'SESSION',
      ttl_expiry:           ttlExpiry(),
    },
    ConditionExpression: 'attribute_not_exists(PK)',
  }));
}

export async function getSession(convId: string): Promise<SessionRecord | null> {
  const res = await docClient.send(new GetCommand({
    TableName: TABLE,
    Key: { PK: convPk(convId), SK: META_SK },
  }));
  return res.Item ? itemToSession(res.Item) : null;
}

export async function listSessions(userId: string, agentId: string): Promise<SessionRecord[]> {
  const res = await docClient.send(new QueryCommand({
    TableName: TABLE,
    IndexName: 'GSI-UserSessions',
    KeyConditionExpression: 'user_id = :uid',
    FilterExpression: 'agent_id = :aid AND item_type = :t',
    ExpressionAttributeValues: { ':uid': userId, ':aid': agentId, ':t': 'SESSION' },
    ScanIndexForward: false,   // newest created_at first
    Limit: 50,
  }));
  // Secondary sort by updatedAt so recently active conversations bubble up
  const items = (res.Items ?? []).map(itemToSession);
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateSession(
  convId: string,
  patch: { title?: string; agentCoreSessionId?: string; updatedAt: string },
): Promise<void> {
  const exprs: string[]               = ['#ua = :ua', 'ttl_expiry = :ttl'];
  const names: Record<string, string> = { '#ua': 'updated_at' };
  const vals:  Record<string, unknown>= { ':ua': patch.updatedAt, ':ttl': ttlExpiry() };

  if (patch.title !== undefined) {
    exprs.push('#t = :t');
    names['#t'] = 'title';
    vals[':t']  = patch.title;
  }
  if (patch.agentCoreSessionId !== undefined) {
    exprs.push('agentcore_session_id = :sid');
    vals[':sid'] = patch.agentCoreSessionId;
  }

  await docClient.send(new UpdateCommand({
    TableName: TABLE,
    Key:  { PK: convPk(convId), SK: META_SK },
    UpdateExpression: `SET ${exprs.join(', ')}`,
    ExpressionAttributeNames:  names,
    ExpressionAttributeValues: vals,
  }));
}

export async function deleteSession(convId: string): Promise<void> {
  // Query all items (METADATA + all MSG#...) then batch-delete
  const items = await docClient.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: { ':pk': convPk(convId) },
    ProjectionExpression: 'PK, SK',
  }));

  const all = items.Items ?? [];
  if (!all.length) return;

  // DynamoDB BatchWrite limit = 25 per call
  for (let i = 0; i < all.length; i += 25) {
    await docClient.send(new BatchWriteCommand({
      RequestItems: {
        [TABLE]: all.slice(i, i + 25).map((item) => ({
          DeleteRequest: { Key: { PK: item.PK, SK: item.SK } },
        })),
      },
    }));
  }
}

// ── Message operations ────────────────────────────────────────────────────────

export async function saveMessage(m: MessageRecord): Promise<void> {
  await docClient.send(new PutCommand({
    TableName: TABLE,
    Item: {
      PK:         convPk(m.conversationId),
      SK:         msgSk(m.timestamp, m.id),
      message_id: m.id,
      user_id:    m.userId,
      agent_id:   m.agentId,
      role:       m.role,
      content:    m.content,
      timestamp:  m.timestamp,
      is_error:   m.isError ?? false,
      item_type:  'MESSAGE',
      ttl_expiry: ttlExpiry(),
    },
  }));
}

export async function getMessages(convId: string): Promise<MessageRecord[]> {
  const res = await docClient.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
    ExpressionAttributeValues: { ':pk': convPk(convId), ':prefix': 'MSG#' },
    ScanIndexForward: true,   // oldest first
  }));

  return (res.Items ?? []).map((item) => ({
    id:             item.message_id as string,
    conversationId: (item.PK as string).replace('SESSION#', ''),
    userId:         item.user_id  as string,
    agentId:        item.agent_id as string,
    role:           item.role     as 'user' | 'assistant',
    content:        item.content  as string,
    timestamp:      item.timestamp as string,
    isError:        item.is_error as boolean | undefined,
  }));
}

// ── Internal mappers ──────────────────────────────────────────────────────────

function itemToSession(item: Record<string, unknown>): SessionRecord {
  const rawId = (item.PK as string).replace('SESSION#', '');
  return {
    id:                 rawId,
    agentCoreSessionId: (item.agentcore_session_id as string) ?? rawId,
    userId:             item.user_id   as string,
    agentId:            item.agent_id  as string,
    title:              item.title     as string,
    createdAt:          item.created_at as string,
    updatedAt:          item.updated_at as string,
  };
}
