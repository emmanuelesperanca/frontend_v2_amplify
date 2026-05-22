'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Plus, ChevronLeft, Trash2, LayoutGrid, LogOut } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserId';
import { AGENTS } from '@/lib/agents';
import { Conversation } from '@/types';
import { cn, truncate, formatRelativeTime } from '@/lib/utils';
import { ThemePicker } from '@/components/ui/ThemePicker';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ChatLabels } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

interface Props {
  currentAgentId: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isLoading?: boolean;
  labels: ChatLabels;
  lang: Lang;
  setLang: (l: Lang) => void;
}

function UserAvatar({ collapsed }: { collapsed: boolean }) {
  const { name, email, initials } = useUserProfile();
  if (!name && !email) return null;

  return (
    <div className={cn('flex w-full items-center gap-2 min-w-0', collapsed && 'justify-center')}>
      {/* Avatar circle */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-[10px] font-bold text-white">
        {initials || '?'}
      </div>

      {!collapsed && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <span className="truncate text-xs font-medium text-[var(--text-primary)]">{name}</span>
          <span className="truncate text-[10px] text-[var(--text-muted)]">{email}</span>
        </div>
      )}

      {/* Sign-out button */}
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        title="Sign out"
        className="shrink-0 rounded p-1 text-[var(--text-muted)] hover:bg-white/5 hover:text-red-400 transition-colors"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Sidebar({
  currentAgentId,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  collapsed,
  onToggleCollapse,
  isLoading = false,
  labels,
  lang,
  setLang,
}: Props) {
  const agent = AGENTS.find((a) => a.id === currentAgentId);

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-[var(--border)] bg-[var(--bg-sidebar)]/80 backdrop-blur-md transition-all duration-200',
        collapsed ? 'w-14' : 'w-60'
      )}
    >
      {/* Logo / toggle */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-[var(--border)]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 overflow-hidden group" title={labels.goHome}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:shadow-md group-hover:shadow-emerald-900/40 transition-shadow">
              <span className="text-[9px] font-bold tracking-wide text-white/90">NS</span>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-emerald-300 transition-colors">Neoson</span>
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-secondary)] transition-colors',
            collapsed && 'mx-auto'
          )}
          title={collapsed ? labels.expand : labels.collapse}
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 p-2 border-b border-[var(--border)]">
        {/* Marketplace */}
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-colors',
            collapsed && 'justify-center'
          )}
          title={labels.marketplace}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{labels.marketplace}</span>}
        </Link>

        {/* New chat */}
        <button
          onClick={onNewChat}
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-colors',
            collapsed && 'justify-center'
          )}
          title={labels.newChat}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{labels.newChat}</span>}
        </button>
      </div>

      {/* Agent pills (switch agent) */}
      {!collapsed && (
        <div className="flex flex-col gap-1 px-2 py-3 border-b border-[var(--border)]">
          <p className="px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
            {labels.agents}
          </p>
          {AGENTS.map((a) => (
            <Link
              key={a.id}
              href={`/chat/${a.id}`}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors',
                a.id === currentAgentId
                  ? 'bg-white/8 text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-white/10 to-white/5 text-[8px] font-bold tracking-wide text-[var(--text-secondary)]">{a.icon}</span>
              <span className="truncate">{a.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Conversation history */}
      {!collapsed && (
        <div className="flex flex-1 flex-col overflow-hidden px-2 py-3">
          <p className="px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {labels.history}
          </p>
          <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
            {isLoading ? (
              <div className="flex flex-col gap-1 px-2 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 rounded-lg bg-white/5" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-2 text-xs text-[var(--text-muted)] italic">{labels.noConversations}</p>
            ) : (
              conversations.slice(0, 30).map((conv) => {
                const convAgent = AGENTS.find((a) => a.id === conv.agentId);
                return (
                  <div
                    key={conv.id}
                    className={cn(
                      'group flex items-center gap-2 rounded-lg px-2 py-2 text-sm cursor-pointer transition-colors',
                      conv.id === activeConversationId
                        ? 'bg-white/8 text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                    )}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[7px] font-bold tracking-wide text-[var(--text-muted)]">{convAgent?.icon ?? '--'}</span>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs">{truncate(conv.title, 28)}</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatRelativeTime(conv.updatedAt)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                      className="shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-400 transition-all"
                      title={labels.deleteConv}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* User profile + sign-out */}
      <div className={cn(
        'mt-auto flex items-center border-t border-[var(--border)] px-2 py-2',
        collapsed ? 'justify-center' : 'gap-2'
      )}>
        <UserAvatar collapsed={collapsed} />
      </div>

      {/* Bottom bar: theme picker (+ agent icon when collapsed) */}
      <div className={cn(
        'mt-0 flex items-center border-t border-[var(--border)] p-2',
        collapsed ? 'flex-col gap-2 justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <span className="px-1 text-[10px] text-[var(--text-muted)]">{labels.theme}</span>
        )}
        <ThemePicker />
        {!collapsed && (
          <LanguageSwitcher lang={lang} setLang={setLang} compact />
        )}
        {collapsed && agent && (
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${agent.gradient}`}
            title={agent.name}
          >
            <span className="text-[8px] font-bold tracking-wide text-white/90">{agent.icon}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
