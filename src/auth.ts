import NextAuth from 'next-auth';
import MicrosoftEntraId from 'next-auth/providers/microsoft-entra-id';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraId({
      clientId:     process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      tenantId:     process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!,
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
