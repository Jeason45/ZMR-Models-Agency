import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Helper function to delete a file safely
async function deleteFile(filePath: string | null) {
  if (!filePath) return;

  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await unlink(fullPath);
    console.log(`✓ Deleted file: ${filePath}`);
  } catch (error) {
    console.error(`✗ Failed to delete file: ${filePath}`, error);
  }
}

// Helper function to delete all talent files
async function deleteTalentFiles(talent: any) {
  const filesToDelete: (string | null)[] = [
    talent.mainImage,
    talent.hoverImage,
    talent.heroVideo,
    talent.heroImage,
    talent.portfolioImage,
    talent.instagramImage,
    talent.showsImage,
    talent.showsVideo,
    talent.showreelVideo,
    talent.showreelImage,
    talent.creditsImage,
    talent.collaborationsImage,
    talent.socialImage,
    talent.campaignsImage,
  ];

  // Add gallery images
  if (talent.galleryImages && Array.isArray(talent.galleryImages)) {
    filesToDelete.push(...talent.galleryImages);
  }

  // Add portfolio gallery
  if (talent.portfolioGallery && Array.isArray(talent.portfolioGallery)) {
    filesToDelete.push(...talent.portfolioGallery);
  }

  // Add reels gallery (videos)
  if (talent.reelsGallery && Array.isArray(talent.reelsGallery)) {
    filesToDelete.push(...talent.reelsGallery);
  }

  // Add events gallery
  if (talent.eventsGallery && Array.isArray(talent.eventsGallery)) {
    filesToDelete.push(...talent.eventsGallery);
  }

  // Delete all files
  await Promise.all(filesToDelete.map(file => deleteFile(file)));
}

// GET - Récupérer un talent spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const talent = await prisma.talent.findUnique({
      where: {
        id,
      },
      include: {
        documents: true,
      },
    });

    if (!talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(talent);
  } catch (error) {
    console.error('Error fetching talent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch talent' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un talent
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Vérifier si le talent existe
    const existingTalent = await prisma.talent.findUnique({
      where: { id },
    });

    if (!existingTalent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      );
    }

    // Si le slug est modifié, vérifier qu'il est unique
    if (body.slug && body.slug !== existingTalent.slug) {
      const slugExists = await prisma.talent.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {
      name: body.name,
      slug: body.slug,
      type: body.type,
      category: body.category,
      status: body.status,

      // Images principales
      mainImage: body.mainImage,
      hoverImage: body.hoverImage,
      heroVideo: body.heroVideo,
      heroImage: body.heroImage,
      galleryImages: body.galleryImages,

      // Mensurations communes
      height: body.height,
      eyes: body.eyes,
      hair: body.hair,
    };

    // Champs spécifiques MODELS
    if (body.type === 'MODELS') {
      Object.assign(updateData, {
        portfolioImage: body.portfolioImage,
        portfolioGallery: body.portfolioGallery,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        showsImage: body.showsImage,
        showsVideo: body.showsVideo,
        neck: body.neck,
        bust: body.bust,
        chest: body.chest,
        waist: body.waist,
        hips: body.hips,
        suit: body.suit,
        inseam: body.inseam,
        shoes: body.shoes,
      });
    }

    // Champs spécifiques ACTING
    if (body.type === 'ACTING') {
      Object.assign(updateData, {
        showreelVideo: body.showreelVideo,
        showreelImage: body.showreelImage,
        reelsGallery: body.reelsGallery,
        credits: body.credits,
        creditsImage: body.creditsImage,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        ageRange: body.ageRange,
        languages: body.languages,
        skills: body.skills,
      });
    }

    // Champs spécifiques PROMO
    if (body.type === 'PROMO') {
      Object.assign(updateData, {
        portfolioImage: body.portfolioImage,
        showsImage: body.showsImage,
        showsVideo: body.showsVideo,
        collaborations: body.collaborations,
        collaborationsImage: body.collaborationsImage,
        eventsGallery: body.eventsGallery,
        eventsImage: body.eventsImage,
        socialImage: body.socialImage,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        instagramFollowers: body.instagramFollowers,
        tiktokFollowers: body.tiktokFollowers,
        tiktokUrl: body.tiktokUrl,
        promoCategories: body.promoCategories,
      });
    }

    // Champs spécifiques DETAILS
    if (body.type === 'DETAILS') {
      Object.assign(updateData, {
        portfolioImage: body.portfolioImage,
        portfolioGallery: body.portfolioGallery,
        campaigns: body.campaigns,
        campaignsImage: body.campaignsImage,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        handSize: body.handSize,
        ringSize: body.ringSize,
        wristSize: body.wristSize,
        footSize: body.footSize,
        legLength: body.legLength,
        neckSize: body.neckSize,
        waist: body.waist,
        hips: body.hips,
        bust: body.bust,
        skinTone: body.skinTone,
        faceSpecialty: body.faceSpecialty,
      });
    }

    const talent = await prisma.talent.update({
      where: {
        id,
      },
      data: updateData,
    });

    return NextResponse.json(talent);
  } catch (error) {
    console.error('Error updating talent:', error);
    return NextResponse.json(
      { error: 'Failed to update talent' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un talent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const talent = await prisma.talent.findUnique({
      where: { id },
    });

    if (!talent) {
      return NextResponse.json(
        { error: 'Talent not found' },
        { status: 404 }
      );
    }

    // Delete all associated files first
    console.log(`🗑️  Deleting files for talent: ${talent.name}`);
    await deleteTalentFiles(talent);

    // Then delete the talent from database
    await prisma.talent.delete({
      where: {
        id,
      },
    });

    console.log(`✓ Talent deleted successfully: ${talent.name}`);

    return NextResponse.json({
      success: true,
      message: 'Talent and associated files deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting talent:', error);
    return NextResponse.json(
      { error: 'Failed to delete talent' },
      { status: 500 }
    );
  }
}
