import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/sign/validate?token=xxx - Valider un token de signature
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    // Récupérer la demande de signature
    const signatureRequest = await prisma.signatureRequest.findUnique({
      where: { token },
      include: {
        document: {
          include: {
            template: {
              select: {
                id: true,
                name: true,
                editableFields: true,
                requiresSignature: true
              }
            }
          }
        }
      }
    });

    if (!signatureRequest) {
      return NextResponse.json(
        { error: 'Lien de signature invalide' },
        { status: 404 }
      );
    }

    // Vérifier si le lien a expiré
    if (new Date() > new Date(signatureRequest.expiresAt)) {
      return NextResponse.json(
        { error: 'Ce lien de signature a expiré' },
        { status: 410 }
      );
    }

    // Vérifier si la signature a déjà été effectuée
    if (signatureRequest.status === 'completed') {
      return NextResponse.json(
        { error: 'Ce document a déjà été signé' },
        { status: 410 }
      );
    }

    // Marquer comme "viewed" si c'est la première fois
    if (!signatureRequest.viewedAt) {
      await prisma.signatureRequest.update({
        where: { id: signatureRequest.id },
        data: { viewedAt: new Date() }
      });
    }

    return NextResponse.json({
      success: true,
      signatureRequest
    });

  } catch (error) {
    console.error('Error validating signature token:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la validation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
