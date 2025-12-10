import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/emailUtils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation mot de passe (min 8 caractères)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingMember = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Générer un token de vérification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Créer le membre
    const member = await prisma.member.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || null,
        provider: 'credentials',
        emailVerified: false,
        verificationToken,
        verificationTokenExpires,
        status: 'pending',
      },
    });

    // Envoyer l'email de vérification
    try {
      await sendVerificationEmail(member.email, verificationToken, member.firstName || undefined);
    } catch (emailError) {
      console.error('Erreur envoi email de vérification:', emailError);
      // On ne bloque pas l'inscription si l'email échoue
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur inscription membre:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription', details: error?.message },
      { status: 500 }
    );
  }
}
