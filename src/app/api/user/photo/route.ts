import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/photo
 *
 * Server-side proxy that fetches the signed-in user's profile photo from
 * Microsoft Graph using the Entra ID access token stored in the encrypted
 * JWT cookie. The access token is never exposed to the browser.
 *
 * Returns the raw image bytes with the correct Content-Type.
 * Responds 401 when unauthenticated, 404 when the user has no photo set.
 */
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token?.accessToken) {
    return new NextResponse(null, { status: 401 });
  }

  const graphRes = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
    headers: { Authorization: `Bearer ${token.accessToken as string}` },
  });

  if (!graphRes.ok) {
    // User has no photo configured in Entra ID — caller falls back to initials
    return new NextResponse(null, { status: 404 });
  }

  const bytes = await graphRes.arrayBuffer();
  return new NextResponse(bytes, {
    headers: {
      'Content-Type': graphRes.headers.get('Content-Type') ?? 'image/jpeg',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
