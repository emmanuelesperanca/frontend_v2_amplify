'use client';

import { useEffect, useState } from 'react';
import { THEMES, Theme, STORAGE_KEY, getTheme } from '@/lib/themes';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(THEMES[0]);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setThemeState(getTheme(saved));
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t.id);
  };

  return { theme, setTheme, themes: THEMES };
}
