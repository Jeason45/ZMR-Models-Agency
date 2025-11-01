import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: { dayOfWeek: 'asc' }
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dayOfWeek, startTime, endTime, isActive } = body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Day of week, start time, and end time are required' },
        { status: 400 }
      );
    }

    const availability = await prisma.availability.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    console.error('Error creating availability:', error);
    return NextResponse.json({ error: 'Failed to create availability' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, dayOfWeek, startTime, endTime, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Availability ID is required' }, { status: 400 });
    }

    const availability = await prisma.availability.update({
      where: { id },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Availability ID is required' }, { status: 400 });
    }

    await prisma.availability.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting availability:', error);
    return NextResponse.json({ error: 'Failed to delete availability' }, { status: 500 });
  }
}
