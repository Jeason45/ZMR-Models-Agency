import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer tous les models (redirection vers talents avec type=MODELS)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = {
      type: 'MODELS' // Filtrer uniquement les models
    };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const models = await prisma.talent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau model (redirection vers talents avec type=MODELS)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des champs requis
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    // Forcer le type à MODELS
    body.type = 'MODELS';

    // Générer un slug unique à partir du nom
    const baseSlug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = body.slug || baseSlug;
    let counter = 1;

    // Vérifier si le slug existe déjà
    while (await prisma.talent.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const model = await prisma.talent.create({
      data: {
        name: body.name,
        slug,
        type: 'MODELS',
        category: body.category,
        status: body.status || 'active',
        mainImage: body.mainImage,
        hoverImage: body.hoverImage,
        heroVideo: body.heroVideo,
        galleryImages: body.galleryImages || [],
        portfolioImage: body.portfolioImage,
        portfolioGallery: body.portfolioGallery || [],
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

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
}
