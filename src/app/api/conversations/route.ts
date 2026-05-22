import { NextRequest, NextResponse } from 'next/server';
import { createSession, listSessions, SessionRecord } from '@/lib/dynamo';

export const runtime = 'nodejs';

/** GET /api/conversations?userId=X&agentId=Y  — list sessions for a user+agent */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId  = searchParams.get('userId');
  const agentId = searchParams.get('agentId');

  if (!userId || !agentId) {
    return NextResponse.json({ error: 'userId e agentId são obrigatórios' }, { status: 400 });
  }

  try {
    const sessions = await listSessions(userId, agentId);
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error('[GET /api/conversations]', err);
    return NextResponse.json({ error: 'Erro ao listar conversas', sessions: [] }, { status: 500 });
  }
}

/** POST /api/conversations  — create a new session */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<SessionRecord>;
    const { id, userId, agentId, title, agentCoreSessionId } = body;

    if (!id || !userId || !agentId) {
      return NextResponse.json({ error: 'id, userId e agentId são obrigatórios' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const session: SessionRecord = {
      id,
      userId,
      agentId,
      title:              title              ?? 'Nova conversa',
      agentCoreSessionId: agentCoreSessionId ?? id,
      createdAt:          now,
      updatedAt:          now,
    };

    await createSession(session);
    return NextResponse.json({ session }, { status: 201 });
  } catch (err: unknown) {
    // ConditionExpression failed = session already exists (idempotent — return 200)
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('ConditionalCheckFailed')) {
      return NextResponse.json({ ok: true });
    }
    console.error('[POST /api/conversations]', err);
    return NextResponse.json({ error: 'Erro ao criar conversa' }, { status: 500 });
  }
}
