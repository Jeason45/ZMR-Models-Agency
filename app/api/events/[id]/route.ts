import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer un event par ID ou slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Chercher par ID ou par slug
    const event = await prisma.event.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      },
      include: {
        bookings: {
          where: {
            paymentStatus: 'paid'
          },
          select: {
            id: true,
            ticketType: true,
            quantity: true,
            status: true
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Calculer les disponibilités par type de ticket
    const ticketAvailability: any = {};
    if (event.ticketTypes && Array.isArray(event.ticketTypes)) {
      (event.ticketTypes as any[]).forEach(ticket => {
        const sold = event.bookings
          .filter(b => b.ticketType === ticket.name && b.status !== 'cancelled')
          .reduce((sum, b) => sum + b.quantity, 0);

        ticketAvailability[ticket.name] = {
          ...ticket,
          sold,
          available: ticket.quantity - sold,
          isSoldOut: sold >= ticket.quantity
        };
      });
    }

    return NextResponse.json({
      ...event,
      ticketAvailability
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT - Mettre à jour un event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location,
        address: body.address,
        city: body.city,
        coverImage: body.coverImage,
        gallery: body.gallery,
        type: body.type,
        status: body.status,
        isFree: body.isFree,
        ticketTypes: body.ticketTypes,
        maxCapacity: body.maxCapacity,
        hasGuestList: body.hasGuestList,
        guestListInfo: body.guestListInfo,
        dresscode: body.dresscode,
        ageRestriction: body.ageRestriction,
        lineup: body.lineup,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        published: body.published,
        publishedAt: body.published && !body.publishedAt ? new Date() : body.publishedAt,
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE - Supprimer un event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier s'il y a des bookings payés
    const paidBookings = await prisma.booking.count({
      where: {
        eventId: id,
        paymentStatus: 'paid',
        status: { not: 'cancelled' }
      }
    });

    if (paidBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete event with paid bookings. Cancel bookings first.' },
        { status: 400 }
      );
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
