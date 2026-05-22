'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatMessage, Conversation } from '@/types';
import { getAgent } from '@/lib/agents';
import { generateId, generateSessionId, firstLine } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserId } from '@/hooks/useUserId';

// ── DynamoDB API helpers (client → server routes) ─────────────────────────────

async function apiListConversations(userId: string, agentId: string): Promise<Conversation[]> {
  try {
    const res = await fetch(`/api/conversations?userId=${encodeURIComponent(userId)}&agentId=${encodeURIComponent(agentId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.sessions ?? []).map((s: { id: string; agentId: string; title: string; createdAt: string; updatedAt: string }) => ({
      id:        s.id,
      agentId:   s.agentId,
      title:     s.title,
      messages:  [],
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }));
  } catch { return []; }
}

async function apiCreateConversation(userId: string, agentId: string, convId: string, agentCoreSessionId: string, title: string) {
  try {
    await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: convId, userId, agentId, agentCoreSessionId, title }),
    });
  } catch { /* non-fatal */ }
}

async function apiLoadMessages(convId: string): Promise<{ messages: ChatMessage[]; agentCoreSessionId: string | null }> {
  try {
    const res = await fetch(`/api/conversations/${convId}`);
    if (!res.ok) return { messages: [], agentCoreSessionId: null };
    const data = await res.json();
    const messages: ChatMessage[] = (data.messages ?? []).map((m: { id: string; role: string; content: string; timestamp: string; agentId: string; isError?: boolean }) => ({
      id:        m.id,
      role:      m.role as 'user' | 'assistant',
      content:   m.content,
      timestamp: new Date(m.timestamp),
      agentId:   m.agentId,
      isError:   m.isError,
    }));
    return { messages, agentCoreSessionId: data.session?.agentCoreSessionId ?? null };
  } catch { return { messages: [], agentCoreSessionId: null }; }
}

async function apiDeleteConversation(convId: string) {
  try {
    await fetch(`/api/conversations/${convId}`, { method: 'DELETE' });
  } catch { /* non-fatal */ }
}

async function apiPatchConversation(convId: string, patch: { title?: string; agentCoreSessionId?: string }) {
  try {
    await fetch(`/api/conversations/${convId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  } catch { /* non-fatal */ }
}

interface Props {
  agentId: string;
}

export function ChatLayout({ agentId }: Props) {
  const router = useRouter();
  const agent = getAgent(agentId);
  const { lang, setLang, t } = useLanguage();
  const userId = useUserId();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  /**
   * agentCoreSessionId may diverge from conversationId when an AgentCore
   * session expires and we rotate it. We keep the DynamoDB convId stable.
   */
  const agentCoreSessionIdRef = useRef<string>('');

  // ── Load conversation list on mount / userId ready ──────────────────────────
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    setLoadingConvs(true);
    apiListConversations(userId, agentId).then((convs) => {
      if (cancelled) return;
      setConversations(convs);
      setLoadingConvs(false);

      const latest = [...convs].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
      if (latest) {
        setActiveId(latest.id);
        // Defer message loading — handled by the activeId watcher below
      } else {
        // No existing conversation — create fresh
        createNewConversation(userId, []);
      }
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, agentId]);

  // ── Lazy-load messages when active conversation changes ─────────────────────
  useEffect(() => {
    if (!activeId) return;
    // Skip if messages already loaded in local state
    const conv = conversations.find((c) => c.id === activeId);
    if (!conv || conv.messages.length > 0) return;

    let cancelled = false;
    setLoadingMsgs(true);
    apiLoadMessages(activeId).then(({ messages, agentCoreSessionId }) => {
      if (cancelled) return;
      setLoadingMsgs(false);
      agentCoreSessionIdRef.current = agentCoreSessionId ?? activeId;
      if (messages.length > 0) {
        setConversations((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, messages } : c))
        );
      }
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function createNewConversation(uid: string, base: Conversation[]) {
    const convId = generateSessionId();
    const sessionId = generateSessionId();
    agentCoreSessionIdRef.current = sessionId;
    const title = t.chat.newChat;
    const now = new Date();
    const newConv: Conversation = {
      id: convId, agentId, title, messages: [], createdAt: now, updatedAt: now,
    };
    setConversations([newConv, ...base]);
    setActiveId(convId);
    setInputValue('');
    // Persist in DynamoDB (best-effort)
    apiCreateConversation(uid, agentId, convId, sessionId, title);
  }

  function startNewConversation() {
    if (userId) createNewConversation(userId, conversations);
  }

  const activeConversation = conversations.find((c) => c.id === activeId);

  function updateLocalConversation(id: string, patch: Partial<Conversation>, msgs?: ChatMessage[]) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...patch, messages: msgs ?? c.messages, updatedAt: new Date() }
          : c
      )
    );
  }

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading || !activeId || !userId) return;

    const currentMsgs   = activeConversation?.messages ?? [];
    const isFirstMessage = currentMsgs.length === 0;
    const convTitle      = isFirstMessage
      ? firstLine(inputValue.trim()).slice(0, 50)
      : (activeConversation?.title ?? t.chat.newChat);

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      agentId,
    };

    // Optimistically add user message
    const withUser = [...currentMsgs, userMsg];
    updateLocalConversation(activeId, { title: convTitle }, withUser);
    setInputValue('');
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const callChat = async (sessionId: string, isRetry = false) => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt:            userMsg.content,
          agentId,
          sessionId,
          conversationId:    activeId,
          userId,
          isFirstMessage:    !isRetry && isFirstMessage,
          conversationTitle: !isRetry && isFirstMessage ? convTitle : undefined,
        }),
        signal: controller.signal,
      });
      return { res, data: await res.json() };
    };

    try {
      let { res, data } = await callChat(agentCoreSessionIdRef.current);

      // Session expired → rotate agentCoreSessionId and retry once
      if (data.sessionExpired) {
        const newSessionId = generateSessionId();
        agentCoreSessionIdRef.current = newSessionId;
        apiPatchConversation(activeId, { agentCoreSessionId: newSessionId });
        ({ res, data } = await callChat(newSessionId, true));
      }

      const assistantMsg: ChatMessage = {
        id:        generateId(),
        role:      'assistant',
        content:   res.ok ? data.response : (data.error ?? t.chat.unknownError),
        timestamp: new Date(),
        agentId,
        isError:   !res.ok,
      };

      // If title was just derived, update DynamoDB title
      if (isFirstMessage) {
        apiPatchConversation(activeId, { title: convTitle });
      }

      updateLocalConversation(activeId, {}, [...withUser, assistantMsg]);
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      const errMsg: ChatMessage = {
        id: generateId(), role: 'assistant',
        content: t.chat.connectionError, timestamp: new Date(), agentId, isError: true,
      };
      updateLocalConversation(activeId, {}, [...withUser, errMsg]);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [inputValue, isLoading, activeId, activeConversation, agentId, userId]);

  const handleCancel = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    setActiveId(id);
    // agentCoreSessionId will be restored when messages are loaded (see useEffect above)
    if (conv.agentId !== agentId) {
      router.push(`/chat/${conv.agentId}`);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    apiDeleteConversation(id);
    if (id === activeId) startNewConversation();
  };

  const handleSuggestedPrompt = (p: string) => {
    setInputValue(p);
  };

  if (!agent) {
    return (
      <div className="flex h-screen items-center justify-center text-[var(--text-secondary)]">
        {t.chat.agentNotFound}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentAgentId={agentId}
        conversations={conversations}
        activeConversationId={activeId}
        onNewChat={() => startNewConversation()}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        isLoading={loadingConvs}
        labels={t.chat}
        lang={lang}
        setLang={setLang}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <header className="flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md px-6">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${agent.gradient}`}
          >
            <span className="text-[9px] font-bold tracking-wide text-white/90">{agent.icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{agent.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{agent.specialty}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t.chat.online}
          </div>
        </header>

        <ChatArea
          agent={agent}
          messages={activeConversation?.messages ?? []}
          isLoading={isLoading || loadingMsgs}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          onCancel={handleCancel}
          onSuggestedPrompt={handleSuggestedPrompt}
          labels={t.chat}
        />
      </div>
    </div>
  );
}
