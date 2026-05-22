'use client';

import { Lang } from '@/lib/i18n';

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
];

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  compact?: boolean;
}

export function LanguageSwitcher({ lang, setLang, compact }: Props) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5 backdrop-blur-sm">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`flex items-center gap-1 rounded-md px-${compact ? '1.5' : '2'} py-1 text-[11px] font-semibold transition-all ${
            lang === l.code
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-white/40 hover:text-white/70'
          }`}
          title={l.label}
        >
          <span className={`${compact ? 'text-xs' : 'text-sm'} leading-none`}>{l.flag}</span>
          {!compact && <span className="hidden sm:inline">{l.label}</span>}
        </button>
      ))}
    </div>
  );
}
