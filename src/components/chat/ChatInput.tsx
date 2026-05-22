'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Square } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onCancel?: () => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultPlaceholder?: string;
  cancelLabel?: string;
  sendLabel?: string;
}

export function ChatInput({ value, onChange, onSend, onCancel, isLoading, disabled, placeholder, defaultPlaceholder, cancelLabel, sendLabel }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSend();
    }
  };

  const canSend = !isLoading && value.trim().length > 0 && !disabled;

  return (
    <div className="relative flex items-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-input)] p-3 transition-colors focus-within:border-[var(--border-strong)]">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder ?? defaultPlaceholder ?? 'Type your message… (Enter to send)'}
        rows={1}
        disabled={disabled || isLoading}
        className="min-h-[40px] max-h-[200px] flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0 focus:border-0 resize-none leading-relaxed"
      />
      <button
        onClick={isLoading ? onCancel : onSend}
        disabled={!isLoading && !canSend}
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all',
          isLoading
            ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
            : canSend
            ? 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95'
            : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
        )}
        title={isLoading ? (cancelLabel ?? 'Cancel') : (sendLabel ?? 'Send')}
      >
        {isLoading ? <Square className="h-4 w-4 fill-current" /> : <Send className="h-4 w-4" />}
      </button>
    </div>
  );
}
