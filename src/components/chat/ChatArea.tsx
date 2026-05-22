'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ChatMessage, Agent } from '@/types';
import { ChatLabels } from '@/lib/i18n';

interface WelcomeProps {
  agent: Agent;
  onPrompt: (p: string) => void;
}

function WelcomeScreen({ agent, onPrompt }: WelcomeProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${agent.gradient} shadow-xl`}
      >
        <span className="text-base font-bold tracking-wider text-white/90">{agent.icon}</span>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{agent.name}</h2>
        <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
          {agent.welcomeMessage.replace(/\*\*/g, '')}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {agent.suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors text-left"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  agent: Agent;
  messages: ChatMessage[];
  isLoading: boolean;
  inputValue: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onCancel: () => void;
  onSuggestedPrompt: (p: string) => void;
  labels: ChatLabels;
}

export function ChatArea({
  agent,
  messages,
  isLoading,
  inputValue,
  onInputChange,
  onSend,
  onCancel,
  onSuggestedPrompt,
  labels,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {hasMessages ? (
          <div className="mx-auto max-w-3xl px-4 py-6">
            <div className="flex flex-col gap-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} agent={agent} copyLabel={labels.copy} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex items-end gap-2.5 animate-fade-in">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm bg-gradient-to-br ${agent.gradient}`}
                  >
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
            </div>
            <div ref={bottomRef} className="h-4" />
          </div>
        ) : (
          <WelcomeScreen agent={agent} onPrompt={onSuggestedPrompt} />
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] bg-[var(--bg-sidebar)]/75 backdrop-blur-xl px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            value={inputValue}
            onChange={onInputChange}
            onSend={onSend}
            onCancel={onCancel}
            isLoading={isLoading}
            placeholder={labels.messagePlaceholder.replace('{agent}', agent.name)}
            cancelLabel={labels.cancel}
            sendLabel={labels.send}
            defaultPlaceholder={labels.inputPlaceholder}
          />
          <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
            {labels.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
