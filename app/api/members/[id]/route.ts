import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendApprovalEmail } from '@/lib/emailUtils';

const prisma = new PrismaClient();

// GET: Récupérer un membre par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
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

    if (!member) {
      return NextResponse.json(
        { error: 'Membre non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Erreur récupération membre:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du membre' },
      { status: 500 }
    );
  }
}

// PUT: Modifier le statut d'un membre (approve, suspend, ban)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, sendEmail = true } = body;

    // Valider le statut
    const validStatuses = ['pending', 'active', 'suspended', 'banned'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide. Valeurs acceptées: pending, active, suspended, banned' },
        { status: 400 }
      );
    }

    // Récupérer le membre actuel pour vérifier l'ancien statut
    const currentMember = await prisma.member.findUnique({
      where: { id },
    });

    if (!currentMember) {
      return NextResponse.json(
        { error: 'Membre non trouvé' },
        { status: 404 }
      );
    }

    const oldStatus = currentMember.status;

    // Mettre à jour le membre
    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        status,
      },
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

    // Si on passe de pending à active, envoyer l'email d'approbation
    if (sendEmail && oldStatus === 'pending' && status === 'active') {
      try {
        await sendApprovalEmail(
          updatedMember.email,
          updatedMember.firstName || updatedMember.name || undefined
        );
        console.log(`✅ Email d'approbation envoyé à ${updatedMember.email}`);
      } catch (emailError) {
        console.error('Erreur envoi email approbation:', emailError);
        // On ne bloque pas la mise à jour si l'email échoue
      }
    }

    return NextResponse.json({
      success: true,
      member: updatedMember,
      emailSent: sendEmail && oldStatus === 'pending' && status === 'active',
    });
  } catch (error: any) {
    console.error('Erreur mise à jour membre:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du membre', details: error?.message },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un membre
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Membre non trouvé' },
        { status: 404 }
      );
    }

    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Membre supprimé avec succès',
    });
  } catch (error: any) {
    console.error('Erreur suppression membre:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du membre' },
      { status: 500 }
    );
  }
}
