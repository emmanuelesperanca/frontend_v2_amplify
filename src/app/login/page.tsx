'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const params      = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/chat/SupervisorAgent';

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'var(--bg-primary)',
      fontFamily:     'Inter, sans-serif',
    }}>
      <div style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border-strong)',
        borderRadius: '16px',
        padding:      '48px 40px',
        maxWidth:     '400px',
        width:        '100%',
        textAlign:    'center',
      }}>
        {/* Logo / brand */}
        <div style={{ marginBottom: '8px' }}>
          <span style={{
            fontSize:   '28px',
            fontWeight: '700',
            color:      'var(--text-primary)',
            letterSpacing: '-0.5px',
          }}>
            Neo<span style={{ color: 'var(--accent)' }}>son</span>
          </span>
        </div>

        <p style={{
          color:        'var(--text-secondary)',
          fontSize:     '14px',
          marginBottom: '36px',
          lineHeight:   '1.5',
        }}>
          Straumann Group AI Hub<br />
          Sign in with your corporate account to continue
        </p>

        {/* Microsoft SSO button */}
        <button
          onClick={() => signIn('microsoft-entra-id', { callbackUrl })}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '12px',
            width:          '100%',
            padding:        '14px 20px',
            background:     '#0078d4',
            color:          '#fff',
            border:         'none',
            borderRadius:   '8px',
            fontSize:       '15px',
            fontWeight:     '600',
            cursor:         'pointer',
            transition:     'background 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#106ebe')}
          onMouseOut={e  => (e.currentTarget.style.background = '#0078d4')}
        >
          {/* Microsoft logo (SVG) */}
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
            <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>

        <p style={{
          color:     'var(--text-muted)',
          fontSize:  '12px',
          marginTop: '28px',
          lineHeight: '1.5',
        }}>
          Access is restricted to Straumann Group employees.<br />
          Use your corporate credentials (@straumann.com).
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
