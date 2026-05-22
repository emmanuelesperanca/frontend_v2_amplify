'use client';

import { useTheme } from '@/hooks/useTheme';

/**
 * Wraps children in a div that carries the background image + dark overlay.
 * The background is scoped to this element only — never applied to <body>.
 */
export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className="relative min-h-screen"
      style={
        theme.background
          ? {
              backgroundImage: `url(${theme.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      {/* Dark overlay — only rendered when a background is active */}
      {theme.background && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ background: 'rgba(10,12,18,0.82)', backdropFilter: 'saturate(0.7) brightness(0.9)' }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}

