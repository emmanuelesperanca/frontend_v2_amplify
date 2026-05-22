'use client';

import { useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { ChatMessage, Agent } from '@/types';
import { cn } from '@/lib/utils';

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-sm">
        🤔
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
      title={label ?? 'Copy'}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

interface Props {
  message: ChatMessage;
  agent: Agent;
  copyLabel?: string;
}

export function MessageBubble({ message, agent, copyLabel }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="group relative max-w-[75%]">
          <div className="rounded-2xl rounded-br-sm bg-[var(--user-bubble)] px-4 py-3 text-sm text-white leading-relaxed">
            {message.content}
          </div>
          <div className="absolute right-0 -bottom-5 flex items-center">
            <CopyButton text={message.content} label={copyLabel} />
          </div>
        </div>
      </div>
    );
  }

  if (message.isStreaming && !message.content) {
    return <TypingIndicator />;
  }

  return (
    <div className="flex items-end gap-2.5 animate-slide-up">
      {/* Agent avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          `bg-gradient-to-br ${agent.gradient}`
        )}
      >
        <span className="text-[9px] font-bold tracking-wide text-white/90">{agent.icon}</span>
      </div>

      {/* Bubble */}
      <div className="group relative max-w-[80%]">
        <div
          className={cn(
            'rounded-2xl rounded-bl-sm border px-4 py-3 text-sm',
            message.isError
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]'
          )}
        >
          <div className="prose-chat">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="absolute left-0 -bottom-5 flex items-center">
          <CopyButton text={message.content} label={copyLabel} />
        </div>
      </div>
    </div>
  );
}
