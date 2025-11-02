import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer tous les talents (avec filtre par type optionnel)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // "MODELS", "ACTING", "PROMO", "DETAILS"
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const talents = await prisma.talent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json(talents);
  } catch (error) {
    console.error('Error fetching talents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch talents' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau talent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des champs requis
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

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

    // Préparer les données selon le type de talent
    const talentData: any = {
      name: body.name,
      slug,
      type: body.type,
      category: body.category,
      status: body.status || 'active',

      // Images principales (tous types)
      mainImage: body.mainImage,
      hoverImage: body.hoverImage,
      heroVideo: body.heroVideo,
      heroImage: body.heroImage,
      galleryImages: body.galleryImages || [],

      // Mensurations communes
      height: body.height,
      eyes: body.eyes,
      hair: body.hair,
    };

    // Champs spécifiques MODELS
    if (body.type === 'MODELS') {
      Object.assign(talentData, {
        portfolioImage: body.portfolioImage,
        portfolioGallery: body.portfolioGallery || [],
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
      Object.assign(talentData, {
        showreelVideo: body.showreelVideo,
        showreelImage: body.showreelImage,
        reelsGallery: body.reelsGallery || [],
        credits: body.credits || [],
        creditsImage: body.creditsImage,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        ageRange: body.ageRange,
        languages: body.languages || [],
        skills: body.skills || [],
      });
    }

    // Champs spécifiques PROMO
    if (body.type === 'PROMO') {
      Object.assign(talentData, {
        portfolioImage: body.portfolioImage,
        showsImage: body.showsImage,
        showsVideo: body.showsVideo,
        collaborations: body.collaborations || [],
        collaborationsImage: body.collaborationsImage,
        eventsGallery: body.eventsGallery || [],
        eventsImage: body.eventsImage,
        socialImage: body.socialImage,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        instagramFollowers: body.instagramFollowers,
        tiktokFollowers: body.tiktokFollowers,
        tiktokUrl: body.tiktokUrl,
        promoCategories: body.promoCategories || [],
      });
    }

    // Champs spécifiques DETAILS
    if (body.type === 'DETAILS') {
      Object.assign(talentData, {
        portfolioImage: body.portfolioImage,
        portfolioGallery: body.portfolioGallery || [],
        campaigns: body.campaigns || [],
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
        faceSpecialty: body.faceSpecialty || [],
      });
    }

    const talent = await prisma.talent.create({
      data: talentData,
    });

    return NextResponse.json(talent, { status: 201 });
  } catch (error) {
    console.error('Error creating talent:', error);
    return NextResponse.json(
      { error: 'Failed to create talent' },
      { status: 500 }
    );
  }
}
