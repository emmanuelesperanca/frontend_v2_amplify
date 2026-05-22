'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

const DEV_USER_KEY = 'neoson_user_id';

/**
 * Returns a stable userId for DynamoDB + AgentCore session tracking.
 *
 * Priority:
 *  1. Entra ID OID from active SSO session (production)
 *  2. localStorage-based stable ID (dev bypass / SSO not yet configured)
 */
export function useUserId(): string {
  const { data: session, status } = useSession();
  const [devId, setDevId] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated') return; // SSO active — no need for fallback
    let id = localStorage.getItem(DEV_USER_KEY);
    if (!id) {
      id = `dev-${crypto.randomUUID()}`;
      localStorage.setItem(DEV_USER_KEY, id);
    }
    setDevId(id);
  }, [status]);

  if (status === 'authenticated' && session?.user?.id) return session.user.id;
  return devId;
}

/**
 * Returns the authenticated user's display name, email, and initials.
 * Falls back to empty strings when SSO is not configured (dev bypass).
 */
export function useUserProfile(): { name: string; email: string; initials: string } {
  const { data: session } = useSession();
  const name  = session?.user?.name  ?? '';
  const email = session?.user?.email ?? '';
  const parts    = name.trim().split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  return { name, email, initials };
}
