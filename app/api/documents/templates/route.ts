import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/documents/templates - Récupérer la liste des templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Filtrer par type: DEVIS, FACTURE, CONTRAT
    const format = searchParams.get('format'); // Filtrer par format: html, docx

    const where: any = {
      isActive: true
    };

    if (type) {
      where.type = type.toUpperCase();
    }

    if (format) {
      where.format = format.toLowerCase();
    }

    const templates = await prisma.documentTemplate.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        format: true,
        description: true,
        isDefault: true,
        thumbnailUrl: true,
        variables: true,
        fieldMapping: true,
        createdAt: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error: any) {
    console.error('Erreur récupération templates:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des templates',
        details: error.message
      },
      { status: 500 }
    );
  }
}
