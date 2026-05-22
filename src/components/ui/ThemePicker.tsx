'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemePicker() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-secondary)] transition-colors"
        title="Tema"
      >
        <Palette className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-44 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-2xl shadow-black/50 py-1 animate-fade-in">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Tema de fundo
          </p>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-colors"
            >
              {/* Thumbnail */}
              <span
                className="h-5 w-7 shrink-0 rounded border border-[var(--border)] overflow-hidden"
                style={
                  t.background
                    ? { backgroundImage: `url(${t.background})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: 'var(--bg-primary)' }
                }
              />
              <span className="flex-1 text-left text-xs">{t.label}</span>
              {theme.id === t.id && <Check className="h-3 w-3 shrink-0 text-emerald-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
