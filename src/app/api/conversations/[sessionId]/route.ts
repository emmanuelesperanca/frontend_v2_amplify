import { NextRequest, NextResponse } from 'next/server';
import { getSession, getMessages, updateSession, deleteSession } from '@/lib/dynamo';

export const runtime = 'nodejs';

interface Params { params: Promise<{ sessionId: string }> }

/** GET /api/conversations/[sessionId]  — get session metadata + all messages */
export async function GET(_req: NextRequest, { params }: Params) {
  const { sessionId } = await params;

  try {
    const [session, messages] = await Promise.all([
      getSession(sessionId),
      getMessages(sessionId),
    ]);

    if (!session) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ session, messages });
  } catch (err) {
    console.error(`[GET /api/conversations/${sessionId}]`, err);
    return NextResponse.json({ error: 'Erro ao carregar conversa' }, { status: 500 });
  }
}

/** PATCH /api/conversations/[sessionId]  — update title or agentCoreSessionId */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { sessionId } = await params;

  try {
    const body = await req.json() as {
      title?: string;
      agentCoreSessionId?: string;
    };

    await updateSession(sessionId, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[PATCH /api/conversations/${sessionId}]`, err);
    return NextResponse.json({ error: 'Erro ao atualizar conversa' }, { status: 500 });
  }
}

/** DELETE /api/conversations/[sessionId]  — delete session + all messages */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { sessionId } = await params;

  try {
    await deleteSession(sessionId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[DELETE /api/conversations/${sessionId}]`, err);
    return NextResponse.json({ error: 'Erro ao deletar conversa' }, { status: 500 });
  }
}
