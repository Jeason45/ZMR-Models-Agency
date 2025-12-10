import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer tous les talents (avec filtres avancés)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // "MODELS", "ACTING", "PROMO", "DETAILS"
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    // Nouveaux filtres pour la page Explore
    const search = searchParams.get('search'); // Recherche par nom
    const gender = searchParams.get('gender'); // "woman", "man"
    const eyes = searchParams.get('eyes'); // Couleur des yeux
    const hair = searchParams.get('hair'); // Couleur des cheveux
    const minHeight = searchParams.get('minHeight'); // Taille min en cm
    const maxHeight = searchParams.get('maxHeight'); // Taille max en cm
    const includeMultiTypes = searchParams.get('includeMultiTypes'); // Chercher aussi dans types[]

    const where: any = {};

    // Filtre par type - supporte maintenant les multi-types
    if (type) {
      if (includeMultiTypes === 'true') {
        // Chercher dans type OU dans le tableau types
        where.OR = [
          { type: type },
          { types: { array_contains: type } }
        ];
      } else {
        where.type = type;
      }
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    // Recherche par nom
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Filtre par genre (pour Models)
    if (gender) {
      where.category = gender;
    }

    // Filtre par couleur des yeux
    if (eyes) {
      where.eyes = {
        contains: eyes,
        mode: 'insensitive'
      };
    }

    // Filtre par couleur des cheveux
    if (hair) {
      where.hair = {
        contains: hair,
        mode: 'insensitive'
      };
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

    // Filtre post-query pour la taille (car stockée en string "175 cm")
    let filteredTalents = talents;
    if (minHeight || maxHeight) {
      filteredTalents = talents.filter(talent => {
        if (!talent.height) return false;
        const heightMatch = talent.height.match(/(\d+)/);
        if (!heightMatch) return false;
        const height = parseInt(heightMatch[1]);

        if (minHeight && height < parseInt(minHeight)) return false;
        if (maxHeight && height > parseInt(maxHeight)) return false;
        return true;
      });
    }

    return NextResponse.json(filteredTalents);
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
      types: body.types || [body.type], // Multi-types : par défaut contient le type principal
      category: body.category,
      status: body.status || 'active',

      // Images principales (tous types)
      mainImage: body.mainImage,
      hoverImage: body.hoverImage,
      heroVideo: body.heroVideo,
      heroImage: body.heroImage,
      heroImagePosition: body.heroImagePosition || 'top',
      galleryImages: body.galleryImages || [],

      // Position des images dans les cards
      mainImagePositionX: body.mainImagePositionX ?? 50,
      mainImagePositionY: body.mainImagePositionY ?? 20,
      hoverImagePositionX: body.hoverImagePositionX ?? 50,
      hoverImagePositionY: body.hoverImagePositionY ?? 20,

      // Positions de toutes les images de la page talent (JSON)
      // Format: { "heroImage": {x: 50, y: 20}, "portfolioImage": {x: 50, y: 50}, ... }
      imagePositions: body.imagePositions || {},

      // Mensurations communes
      height: body.height,
      eyes: body.eyes,
      hair: body.hair,

      // Instagram (commun à tous)
      instagramImage: body.instagramImage,
      instagramUrl: body.instagramUrl,

      // Expériences unifiées (nouveau système WORK)
      experiences: body.experiences || [],
    };

    // Récupérer les types (support multi-types)
    const types = body.types || [body.type];

    // Champs spécifiques MODELS (si MODELS est dans les types)
    if (types.includes('MODELS')) {
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

    // Champs spécifiques ACTING (si ACTING est dans les types)
    if (types.includes('ACTING')) {
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

    // Champs spécifiques PROMO (si PROMO est dans les types)
    if (types.includes('PROMO')) {
      // Conversion des followers en entiers (ou null si vide/invalide)
      const instagramFollowers = body.instagramFollowers ? parseInt(body.instagramFollowers, 10) : null;
      const tiktokFollowers = body.tiktokFollowers ? parseInt(body.tiktokFollowers, 10) : null;

      Object.assign(talentData, {
        portfolioImage: talentData.portfolioImage || body.portfolioImage,
        showsImage: talentData.showsImage || body.showsImage,
        showsVideo: talentData.showsVideo || body.showsVideo,
        collaborations: body.collaborations || [],
        collaborationsImage: body.collaborationsImage,
        eventsGallery: body.eventsGallery || [],
        eventsImage: body.eventsImage,
        socialImage: body.socialImage,
        instagramImage: body.instagramImage,
        instagramUrl: body.instagramUrl,
        instagramFollowers: isNaN(instagramFollowers as number) ? null : instagramFollowers,
        tiktokFollowers: isNaN(tiktokFollowers as number) ? null : tiktokFollowers,
        tiktokUrl: body.tiktokUrl,
        promoCategories: body.promoCategories || [],
      });
    }

    // Champs spécifiques DETAILS (si DETAILS est dans les types)
    if (types.includes('DETAILS')) {
      Object.assign(talentData, {
        portfolioImage: talentData.portfolioImage || body.portfolioImage,
        portfolioGallery: talentData.portfolioGallery || body.portfolioGallery || [],
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
        waist: talentData.waist || body.waist,
        hips: talentData.hips || body.hips,
        bust: talentData.bust || body.bust,
        skinTone: body.skinTone,
        faceSpecialty: body.faceSpecialty || [],
      });
    }

    const talent = await prisma.talent.create({
      data: talentData,
    });

    return NextResponse.json(talent, { status: 201 });
  } catch (error: any) {
    console.error('Error creating talent:', error);
    // Retourner l'erreur détaillée pour le debug
    return NextResponse.json(
      {
        error: 'Failed to create talent',
        details: error?.message || String(error),
        code: error?.code
      },
      { status: 500 }
    );
  }
}
