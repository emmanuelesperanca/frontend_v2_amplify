import NextAuth from 'next-auth';
import MicrosoftEntraId from 'next-auth/providers/microsoft-entra-id';

// Explicit tenant ID — ensures the single-tenant endpoint is used.
// NextAuth v5 beta does not reliably propagate `tenantId` to the authorization
// URL when using OIDC discovery; overriding `authorization` directly is the fix.
const TENANT_ID = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!;
const ENTRA_BASE = `https://login.microsoftonline.com/${TENANT_ID}`;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraId({
      clientId:     process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      tenantId:     TENANT_ID,
      // Override the authorization URL so NextAuth uses the tenant-specific
      // endpoint instead of the /common/ multi-tenant endpoint (AADSTS50194).
      authorization: {
        url: `${ENTRA_BASE}/oauth2/v2.0/authorize`,
        params: { scope: 'openid profile email' },
      },
      // Tenant-specific token endpoint (avoids issuer mismatch on token exchange)
      token: `${ENTRA_BASE}/oauth2/v2.0/token`,
      // Standard Microsoft Graph OIDC userinfo
      userinfo: 'https://graph.microsoft.com/oidc/userinfo',
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    /**
     * Persist the Entra ID Object ID (oid) in the JWT as a stable userId.
     * The `oid` claim is unique per user across the entire tenant —
     * safer than `email` (can change) or `sub` (app-specific).
     */
    jwt({ token, account, profile }) {
      if (profile) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.userId = (profile as any).oid ?? profile.sub ?? token.sub;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
});
