import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // DEV BYPASS: set AUTH_BYPASS=true in .env.local to skip SSO entirely.
  // In production, AUTH_BYPASS must be unset (or false) and real Entra ID
  // credentials must be provided. Never set AUTH_BYPASS=true in production.
  const bypass = process.env.AUTH_BYPASS === 'true';
  if (!req.auth && !bypass) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/chat/:path*'],
};
