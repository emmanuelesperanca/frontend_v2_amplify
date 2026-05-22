import { NextRequest, NextResponse } from 'next/server';
import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from '@aws-sdk/client-bedrock-agentcore';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { getAgent } from '@/lib/agents';
import { saveMessage, updateSession } from '@/lib/dynamo';

export const runtime = 'nodejs';
export const maxDuration = 120; // seconds

/**
 * The AgentCore runtime response body is SSE-formatted:
 *   data: "chunk one"\n
 *   data: "chunk two"\n
 *   ...
 * Each value is a JSON-encoded string (with \n, \t, unicode escapes, etc.).
 * This function reassembles the chunks into the full plain text.
 * Falls back to plain-JSON and raw-text parsing for other response formats.
 */
function parseAgentResponse(raw: string): string {
  // Detect SSE format: at least one line starting with "data: "
  if (raw.includes('\ndata: ') || raw.startsWith('data: ')) {
    let assembled = '';
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        const jsonPart = trimmed.slice(6); // strip "data: "
        try {
          const chunk = JSON.parse(jsonPart);
          if (typeof chunk === 'string') assembled += chunk;
        } catch {
          // non-JSON chunk (e.g. empty "data: " line) — skip
        }
      }
    }
    if (assembled) return assembled;
  }

  // JSON wrapper: { response: "..." } | { output: "..." } | { message: "..." }
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.response === 'string') return parsed.response;
    if (typeof parsed.output  === 'string') return parsed.output;
    if (typeof parsed.message === 'string') return parsed.message;
  } catch {
    // not JSON
  }

  // Plain text fallback
  return raw;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, agentId, sessionId, conversationId, userId, isFirstMessage, conversationTitle } = body as {
      prompt: string;
      agentId: string;
      sessionId: string;       // AgentCore runtimeSessionId (may change on session expiry)
      conversationId: string;  // Stable DynamoDB PK
      userId: string;
      isFirstMessage?: boolean;
      conversationTitle?: string;
    };

    if (!prompt?.trim() || !agentId || !sessionId) {
      return NextResponse.json({ error: 'prompt, agentId e sessionId são obrigatórios' }, { status: 400 });
    }

    const agent = getAgent(agentId);
    if (!agent) {
      return NextResponse.json({ error: `Agente "${agentId}" não encontrado` }, { status: 404 });
    }

    const client = new BedrockAgentCoreClient({
      region: agent.region,
      credentials: fromNodeProviderChain(),
    });

    const payload = new TextEncoder().encode(JSON.stringify({ prompt: prompt.trim() }));

    const command = new InvokeAgentRuntimeCommand({
      agentRuntimeArn: agent.runtimeArn,
      runtimeSessionId: sessionId,
      payload,
      contentType: 'application/json',
      accept: 'application/json',
      qualifier: 'DEFAULT',
    });

    const start = Date.now();
    const result = await client.send(command);

    // Consume the streaming response
    let rawText = '';
    if (result.response) {
      if (typeof (result.response as any).transformToString === 'function') {
        rawText = await (result.response as any).transformToString();
      } else if (typeof (result.response as any).transformToWebStream === 'function') {
        const webStream = (result.response as any).transformToWebStream();
        const reader = (webStream as ReadableStream<Uint8Array>).getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          rawText += decoder.decode(value, { stream: true });
        }
      } else {
        rawText = String(result.response);
      }
    }

    // The AgentCore runtime returns SSE chunks: one or more lines of `data: "string"\n`
    // Reassemble them into the full response text before returning.
    let responseText = parseAgentResponse(rawText);

    // ── Persist to DynamoDB (best-effort — don't fail the chat on DB errors) ──
    const convId = conversationId || sessionId;
    if (userId && convId) {
      const now         = new Date().toISOString();
      const userMsgId   = `msg-${Date.now()}-u`;
      const assistMsgId = `msg-${Date.now()}-a`;

      // Fire-and-forget — agent response already took seconds; don't add latency
      Promise.all([
        saveMessage({
          id: userMsgId, conversationId: convId, userId, agentId,
          role: 'user', content: prompt.trim(),
          timestamp: new Date(start).toISOString(),
        }),
        saveMessage({
          id: assistMsgId, conversationId: convId, userId, agentId,
          role: 'assistant', content: responseText,
          timestamp: now,
        }),
        updateSession(convId, {
          updatedAt: now,
          ...(isFirstMessage && conversationTitle
            ? { title: conversationTitle }
            : {}),
        }),
      ]).catch((err) => console.error('[/api/chat] DynamoDB save error (non-fatal):', err));
    }

    return NextResponse.json({
      response: responseText,
      sessionId,
      durationMs: Date.now() - start,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[/api/chat] error:', message);
    // Detect AgentCore session expiry
    const sessionExpired = /session.*expired|expired.*session|reauthenticate/i.test(message);
    return NextResponse.json(
      { error: message || 'Erro interno ao invocar o agente', sessionExpired },
      { status: sessionExpired ? 401 : 500 }
    );
  }
}
