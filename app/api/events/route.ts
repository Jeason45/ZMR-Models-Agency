import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer les events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const published = searchParams.get('published');
    const upcoming = searchParams.get('upcoming');
    const limit = searchParams.get('limit');

    const where: any = {};

    // Filtres
    if (type) where.type = type;
    if (status) where.status = status;
    if (published === 'true') where.published = true;
    if (published === 'false') where.published = false;

    // Seulement les events à venir
    if (upcoming === 'true') {
      where.date = { gte: new Date() };
      where.status = { not: 'cancelled' };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    // Calculer les places restantes pour chaque event
    const eventsWithAvailability = events.map(event => {
      let totalSold = 0;
      let totalCapacity = 0;

      if (event.ticketTypes && Array.isArray(event.ticketTypes)) {
        (event.ticketTypes as any[]).forEach(ticket => {
          totalSold += ticket.sold || 0;
          totalCapacity += ticket.quantity || 0;
        });
      }

      return {
        ...event,
        totalSold,
        totalCapacity,
        availableSpots: totalCapacity - totalSold,
        isSoldOut: totalCapacity > 0 && totalSold >= totalCapacity
      };
    });

    return NextResponse.json(eventsWithAvailability);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST - Créer un event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Générer un slug unique
    const baseSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Vérifier l'unicité du slug
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location,
        address: body.address,
        city: body.city,
        coverImage: body.coverImage,
        gallery: body.gallery || [],
        type: body.type,
        status: body.status || 'upcoming',
        isFree: body.isFree || false,
        ticketTypes: body.ticketTypes || [],
        maxCapacity: body.maxCapacity,
        hasGuestList: body.hasGuestList || false,
        guestListInfo: body.guestListInfo,
        dresscode: body.dresscode,
        ageRestriction: body.ageRestriction,
        lineup: body.lineup || [],
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
