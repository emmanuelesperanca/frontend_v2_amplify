import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // DEV BYPASS: skip auth when Entra ID App Registration is not yet configured.
  // Remove the next 2 lines (or fill .env.local with real values) to enforce SSO.
  const isConfigured = process.env.AUTH_MICROSOFT_ENTRA_ID_ID !== 'REPLACE_WITH_CLIENT_ID';
  if (!req.auth && isConfigured) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/chat/:path*'],
};
