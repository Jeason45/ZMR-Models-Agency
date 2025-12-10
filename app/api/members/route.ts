import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Liste de tous les membres avec filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const provider = searchParams.get('provider');

    const where: any = {};

    // Filtre par statut
    if (status && status !== 'all') {
      where.status = status;
    }

    // Filtre par provider (google, credentials)
    if (provider && provider !== 'all') {
      where.provider = provider;
    }

    // Recherche par nom ou email
    if (search && search.trim()) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const members = await prisma.member.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        avatar: true,
        provider: true,
        emailVerified: true,
        status: true,
        lastLoginAt: true,
        loginCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(members);
  } catch (error: any) {
    console.error('Erreur récupération membres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des membres', details: error?.message },
      { status: 500 }
    );
  }
}
