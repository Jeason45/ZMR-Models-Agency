import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/member/login?error=invalid_token', request.url));
    }

    // Chercher le membre avec ce token
    const member = await prisma.member.findUnique({
      where: { verificationToken: token },
    });

    if (!member) {
      return NextResponse.redirect(new URL('/member/login?error=invalid_token', request.url));
    }

    // Vérifier si le token n'a pas expiré
    if (member.verificationTokenExpires && member.verificationTokenExpires < new Date()) {
      return NextResponse.redirect(new URL('/member/login?error=token_expired', request.url));
    }

    // Marquer l'email comme vérifié (mais garder status 'pending' pour validation admin)
    await prisma.member.update({
      where: { id: member.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
        // NE PAS mettre status: 'active' - l'admin doit valider le compte
      },
    });

    // Rediriger vers la page de connexion avec un message d'attente de validation
    return NextResponse.redirect(new URL('/member/login?verified=true&pending_approval=true', request.url));
  } catch (error: any) {
    console.error('Erreur vérification email:', error);
    return NextResponse.redirect(new URL('/member/login?error=verification_failed', request.url));
  }
}

// POST pour renvoyer l'email de vérification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const member = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!member) {
      // Ne pas révéler si l'email existe ou non
      return NextResponse.json({
        success: true,
        message: 'Si un compte existe avec cet email, un nouvel email de vérification a été envoyé.',
      });
    }

    if (member.emailVerified) {
      return NextResponse.json(
        { error: 'Cet email est déjà vérifié. Vous pouvez vous connecter.' },
        { status: 400 }
      );
    }

    // Générer un nouveau token
    const crypto = await import('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await prisma.member.update({
      where: { id: member.id },
      data: {
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Envoyer l'email
    const { sendVerificationEmail } = await import('@/lib/emailUtils');
    await sendVerificationEmail(member.email, verificationToken, member.firstName || undefined);

    return NextResponse.json({
      success: true,
      message: 'Un nouvel email de vérification a été envoyé.',
    });
  } catch (error: any) {
    console.error('Erreur renvoi email vérification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
