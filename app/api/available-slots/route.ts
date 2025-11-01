import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les créneaux disponibles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysAhead = parseInt(searchParams.get('days') || '7');

    // Récupérer les disponibilités configurées
    const availabilities = await prisma.availability.findMany({
      where: { isActive: true },
    });

    // Récupérer tous les appointments existants
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000),
        },
        status: {
          not: 'cancelled',
        },
      },
    });

    // Générer les créneaux disponibles
    const slots: any[] = [];
    const now = new Date();

    for (let i = 1; i <= daysAhead; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayOfWeek = date.getDay();
      const dayAvailability = availabilities.find(a => a.dayOfWeek === dayOfWeek);

      if (!dayAvailability) continue;

      // Générer les créneaux horaires pour ce jour
      const startHour = parseInt(dayAvailability.startTime.split(':')[0]);
      const endHour = parseInt(dayAvailability.endTime.split(':')[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);

        // Vérifier si le créneau n'est pas déjà pris
        const isBooked = appointments.some(apt => {
          const aptDate = new Date(apt.date);
          return aptDate.getTime() === slotDate.getTime();
        });

        if (!isBooked && slotDate > now) {
          slots.push({
            date: slotDate.toISOString(),
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: true,
          });
        }
      }
    }

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
