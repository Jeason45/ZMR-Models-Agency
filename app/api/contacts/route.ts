import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const contacts = await prisma.contact.findMany({
      where: status ? { status } : undefined,
      include: {
        appointments: {
          orderBy: { startTime: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, source, selectedType, wantCallback, selectedDay, selectedSlot } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        message: message || '',
        type: selectedType || null,
        source: source || 'website',
        status: 'new'
      }
    });

    // Si un rappel est demandé, créer un rendez-vous
    if (wantCallback && selectedDay && selectedSlot) {
      const [startHour] = selectedSlot.split(' - ');
      const [hours, minutes] = startHour.split(':');

      const appointmentDate = new Date(selectedDay);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDate = new Date(appointmentDate);
      endDate.setHours(endDate.getHours() + 1); // Rendez-vous d'1 heure

      await prisma.appointment.create({
        data: {
          contactId: contact.id,
          title: `Rappel - ${contact.name}`,
          description: `Type: ${selectedType === 'professional' ? 'Professionnel' : 'Mannequin'}`,
          startTime: appointmentDate,
          endTime: endDate,
          status: 'scheduled'
        }
      });
    }

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, name, email, phone, message, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(message !== undefined && { message }),
        ...(type !== undefined && { type })
      },
      include: {
        appointments: true
      }
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    await prisma.contact.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
