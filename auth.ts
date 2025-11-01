import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

// Liste des utilisateurs autorisés (hardcodés pour la sécurité)
// TODO: Plus tard, on pourra les mettre dans Sanity
const AUTHORIZED_USERS = [
  {
    id: '1',
    email: 'admin@zmrmodels.com',
    name: 'Admin ZMR',
    // Password: "admin123" (hashé avec bcrypt)
    password: '$2b$10$jKfYO1dGLDwQ8k4KLL0gkuKd5Z4q3r4Q5.sCnkUx5EStja.YayN3K',
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Provider Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Provider Email/Password
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = AUTHORIZED_USERS.find(
          (u) => u.email === credentials.email
        );

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Si c'est Google OAuth, vérifier que l'email est autorisé
      if (account?.provider === 'google') {
        const authorizedEmails = AUTHORIZED_USERS.map(u => u.email);
        if (!user.email || !authorizedEmails.includes(user.email)) {
          return false; // Refuse la connexion si l'email n'est pas autorisé
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
