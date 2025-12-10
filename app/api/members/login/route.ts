import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();

// Clé secrète pour le JWT (utiliser la même que NextAuth si possible)
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Trouver le membre
    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Aucun compte trouvé avec cet email' },
        { status: 401 }
      );
    }

    if (!member.password) {
      return NextResponse.json(
        { error: 'Ce compte utilise la connexion Google. Veuillez vous connecter avec Google.' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, member.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier l'email vérifié
    if (!member.emailVerified) {
      return NextResponse.json(
        { error: 'Veuillez vérifier votre email avant de vous connecter' },
        { status: 401 }
      );
    }

    // Vérifier le statut
    if (member.status === 'pending') {
      return NextResponse.json(
        { error: 'Votre compte est en attente de validation par un administrateur. Vous recevrez un email une fois approuvé.' },
        { status: 401 }
      );
    }
    if (member.status === 'suspended') {
      return NextResponse.json(
        { error: 'Votre compte a été suspendu. Contactez-nous pour plus d\'informations.' },
        { status: 401 }
      );
    }
    if (member.status === 'banned') {
      return NextResponse.json(
        { error: 'Votre compte a été banni.' },
        { status: 401 }
      );
    }
    if (member.status !== 'active') {
      return NextResponse.json(
        { error: 'Votre compte n\'est pas actif.' },
        { status: 401 }
      );
    }

    // Mettre à jour les infos de connexion
    await prisma.member.update({
      where: { id: member.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // Créer le token JWT pour la session membre
    const token = await new SignJWT({
      id: member.id,
      email: member.email,
      name: member.name || member.firstName || member.email,
      image: member.avatar,
      isMember: true,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(JWT_SECRET);

    // Définir le cookie de session membre
    const cookieStore = await cookies();
    cookieStore.set('member-session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
    });

    return NextResponse.json({
      success: true,
      user: {
        id: member.id,
        email: member.email,
        name: member.name || member.firstName,
        image: member.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}
