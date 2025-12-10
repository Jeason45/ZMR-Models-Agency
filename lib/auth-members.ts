import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const {
  handlers: memberHandlers,
  auth: memberAuth,
  signIn: memberSignIn,
  signOut: memberSignOut,
} = NextAuth({
  basePath: '/api/auth/member',
  pages: {
    signIn: '/member/login',
    error: '/member/login',
  },
  providers: [
    // Provider Google OAuth pour les membres
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // Provider Email/Password pour les membres
    Credentials({
      id: 'member-credentials',
      name: 'Member Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const member = await prisma.member.findUnique({
          where: { email: credentials.email as string },
        });

        if (!member) {
          throw new Error('Aucun compte trouvé avec cet email');
        }

        if (!member.password) {
          throw new Error('Ce compte utilise la connexion Google. Veuillez vous connecter avec Google.');
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          member.password
        );

        if (!passwordMatch) {
          throw new Error('Mot de passe incorrect');
        }

        if (!member.emailVerified) {
          throw new Error('Veuillez vérifier votre email avant de vous connecter');
        }

        if (member.status === 'pending') {
          throw new Error('Votre compte est en attente de validation par un administrateur. Vous recevrez un email une fois approuvé.');
        }
        if (member.status === 'suspended') {
          throw new Error('Votre compte a été suspendu. Contactez-nous pour plus d\'informations.');
        }
        if (member.status === 'banned') {
          throw new Error('Votre compte a été banni.');
        }
        if (member.status !== 'active') {
          throw new Error('Votre compte n\'est pas actif.');
        }

        // Mettre à jour les infos de connexion
        await prisma.member.update({
          where: { id: member.id },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 },
          },
        });

        return {
          id: member.id,
          email: member.email,
          name: member.name || member.firstName || member.email,
          image: member.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Si c'est Google OAuth
      if (account?.provider === 'google') {
        const email = user.email;
        if (!email) return false;

        // Chercher ou créer le membre
        let member = await prisma.member.findUnique({
          where: { email },
        });

        if (!member) {
          // Créer un nouveau membre via Google (email vérifié par Google, mais compte en attente de validation admin)
          member = await prisma.member.create({
            data: {
              email,
              name: user.name || undefined,
              firstName: (profile as any)?.given_name || undefined,
              lastName: (profile as any)?.family_name || undefined,
              avatar: user.image || undefined,
              provider: 'google',
              providerId: account.providerAccountId,
              emailVerified: true, // Google vérifie déjà l'email
              status: 'pending', // En attente de validation admin
            },
          });
          // Compte créé mais pas encore validé - sera rejeté par la vérification de statut ci-dessous
        } else {
          // Vérifier le statut avant de mettre à jour
          if (member.status !== 'active') {
            // Rediriger vers login avec le code d'erreur approprié
            if (member.status === 'pending') {
              return `/member/login?error=pending_approval`;
            }
            if (member.status === 'suspended') {
              return `/member/login?error=suspended`;
            }
            if (member.status === 'banned') {
              return `/member/login?error=banned`;
            }
            return false;
          }

          // Mettre à jour les infos de connexion
          await prisma.member.update({
            where: { id: member.id },
            data: {
              lastLoginAt: new Date(),
              loginCount: { increment: 1 },
              // Mettre à jour l'avatar si pas défini
              avatar: member.avatar || user.image || undefined,
            },
          });
        }

        // Nouveau membre créé avec status 'pending' - rediriger vers page d'attente
        if (member.status === 'pending') {
          return `/member/login?error=pending_approval&new_account=true`;
        }

        return true;
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.isMember = true;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session as any).isMember = true;
        (session as any).provider = token.provider;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  cookies: {
    sessionToken: {
      name: 'member-session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});

// Helper pour vérifier si un utilisateur est un membre connecté
export async function getMemberSession() {
  const session = await memberAuth();
  if (session?.user && (session as any).isMember) {
    return session;
  }
  return null;
}
