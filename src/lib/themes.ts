export interface Theme {
  id: string;
  label: string;
  background: string; // path under /backgrounds/
}

export const THEMES: Theme[] = [
  { id: 'none',             label: 'Padrão',         background: '' },
  { id: 'straumann_group',  label: 'Straumann Group', background: '/backgrounds/theme-straumann_group.png' },
  { id: 'straumann',        label: 'Straumann',       background: '/backgrounds/theme-straumann.png' },
  { id: 'neodent',          label: 'Neodent',         background: '/backgrounds/theme-neodent.png' },
  { id: 'clearcorrect',     label: 'ClearCorrect',    background: '/backgrounds/theme-clearcorrect.png' },
  { id: 'oneteam',          label: 'One Team',        background: '/backgrounds/theme-oneteam.png' },
];

export const STORAGE_KEY = 'neoson_v2_theme';

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
