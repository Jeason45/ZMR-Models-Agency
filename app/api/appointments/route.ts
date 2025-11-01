import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { appointmentConfirmationEmail } from '@/lib/email-templates';

// GET - Récupérer tous les appointments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const appointments = await prisma.appointment.findMany({
      where: status ? { status } : undefined,
      include: {
        contact: true,
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST - Créer un appointment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactId, date, duration, notes } = body;

    if (!contactId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        contactId,
        date: new Date(date),
        duration: duration || 30,
        notes,
        status: 'pending',
      },
    });

    // Mettre à jour le contact avec l'appointmentId
    await prisma.contact.update({
      where: { id: contactId },
      data: { appointmentId: appointment.id },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un appointment
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        contact: true,
      },
    });

    // Si le statut passe à "confirmed", envoyer l'email de confirmation
    console.log('🔵 Status reçu:', status);
    console.log('🔵 Appointment contact:', appointment.contact ? appointment.contact.email : 'Pas de contact');

    if (status === 'confirmed' && appointment.contact) {
      try {
        console.log('📧 Envoi email confirmation RDV à:', appointment.contact.email);

        const confirmationEmail = appointmentConfirmationEmail({
          clientName: appointment.contact.name,
          date: appointment.date,
          duration: appointment.duration,
          notes: appointment.notes || undefined,
        });

        const result = await resend.emails.send({
          from: 'ZMR Models Agency <onboarding@resend.dev>',
          to: appointment.contact.email,
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
        });

        console.log('✅ Email de confirmation RDV envoyé:', result);
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation RDV:', emailError);
        console.error('❌ Stack:', emailError instanceof Error ? emailError.stack : 'No stack');
      }
    } else {
      console.log('⚠️ Email non envoyé - Status:', status, '- Contact:', appointment.contact ? 'Présent' : 'Absent');
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}
