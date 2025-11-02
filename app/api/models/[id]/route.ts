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

// Helper function to delete all model files
async function deleteModelFiles(model: any) {
  const filesToDelete: (string | null)[] = [
    model.mainImage,
    model.hoverImage,
    model.heroVideo,
    model.portfolioImage,
    model.instagramImage,
    model.showsImage,
    model.showsVideo,
  ];

  // Add gallery images
  if (model.galleryImages && Array.isArray(model.galleryImages)) {
    filesToDelete.push(...model.galleryImages);
  }

  // Add portfolio gallery
  if (model.portfolioGallery && Array.isArray(model.portfolioGallery)) {
    filesToDelete.push(...model.portfolioGallery);
  }

  // Delete all files
  await Promise.all(filesToDelete.map(file => deleteFile(file)));
}

// GET - Récupérer un model spécifique (redirection vers talents)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const model = await prisma.talent.findUnique({
      where: {
        id,
      },
      include: {
        documents: true,
      },
    });

    if (!model || model.type !== 'MODELS') {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un model (redirection vers talents)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Vérifier si le model existe
    const existingModel = await prisma.talent.findUnique({
      where: { id },
    });

    if (!existingModel || existingModel.type !== 'MODELS') {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Si le slug est modifié, vérifier qu'il est unique
    if (body.slug && body.slug !== existingModel.slug) {
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

    const model = await prisma.talent.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        slug: body.slug,
        type: 'MODELS',
        category: body.category,
        status: body.status,
        mainImage: body.mainImage,
        hoverImage: body.hoverImage,
        heroVideo: body.heroVideo,
        galleryImages: body.galleryImages,
        portfolioImage: body.portfolioImage,
        portfolioGallery: body.portfolioGallery,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        showsImage: body.showsImage,
        showsVideo: body.showsVideo,
        height: body.height,
        neck: body.neck,
        bust: body.bust,
        chest: body.chest,
        waist: body.waist,
        hips: body.hips,
        suit: body.suit,
        inseam: body.inseam,
        shoes: body.shoes,
        eyes: body.eyes,
        hair: body.hair,
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un model (redirection vers talents)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const model = await prisma.talent.findUnique({
      where: { id },
    });

    if (!model || model.type !== 'MODELS') {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Delete all associated files first
    console.log(`🗑️  Deleting files for model: ${model.name}`);
    await deleteModelFiles(model);

    // Then delete the model from database
    await prisma.talent.delete({
      where: {
        id,
      },
    });

    console.log(`✓ Model deleted successfully: ${model.name}`);

    return NextResponse.json({
      success: true,
      message: 'Model and associated files deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    );
  }
}
