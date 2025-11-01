import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les disponibilités
export async function GET(request: Request) {
  try {
    const availabilities = await prisma.availability.findMany({
      where: { isActive: true },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json(availabilities);
  } catch (error) {
    console.error('Error fetching availabilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availabilities' },
      { status: 500 }
    );
  }
}

// POST - Créer une disponibilité
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const availability = await prisma.availability.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        isActive: true,
      },
    });

    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    console.error('Error creating availability:', error);
    return NextResponse.json(
      { error: 'Failed to create availability' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une disponibilité
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, startTime, endTime, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id' },
        { status: 400 }
      );
    }

    const availability = await prisma.availability.update({
      where: { id },
      data: {
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une disponibilité
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id' },
        { status: 400 }
      );
    }

    await prisma.availability.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting availability:', error);
    return NextResponse.json(
      { error: 'Failed to delete availability' },
      { status: 500 }
    );
  }
}
