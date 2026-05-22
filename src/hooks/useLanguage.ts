'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lang, translations, Translations } from '@/lib/i18n';

const STORAGE_KEY = 'neoson_lang';
const DEFAULT_LANG: Lang = 'en';

export function useLanguage(): { lang: Lang; t: Translations; setLang: (l: Lang) => void } {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && (stored === 'en' || stored === 'pt' || stored === 'es')) {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  return { lang, t: translations[lang], setLang };
}
