import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  sendEmail,
  generateAppointmentConfirmationEmailHTML,
  generateAppointmentConfirmationEmailText
} from '@/lib/emailUtils';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Récupérer le rendez-vous avec le contact
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        contact: true
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si déjà confirmé
    if (appointment.status === 'confirmed') {
      return NextResponse.json(
        { error: 'Ce rendez-vous est déjà confirmé' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut à "confirmed"
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'confirmed' },
      include: {
        contact: true
      }
    });

    // Formater les dates pour l'email
    const startDate = new Date(updatedAppointment.startTime);
    const endDate = new Date(updatedAppointment.endTime);

    const formattedDate = startDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedStartTime = startDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const formattedEndTime = endDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Générer les emails HTML et texte
    const emailHtml = generateAppointmentConfirmationEmailHTML({
      contactName: updatedAppointment.contact.name,
      appointmentTitle: updatedAppointment.title,
      appointmentDescription: updatedAppointment.description || undefined,
      formattedDate,
      formattedStartTime,
      formattedEndTime,
      location: updatedAppointment.location || undefined
    });

    const emailText = generateAppointmentConfirmationEmailText({
      contactName: updatedAppointment.contact.name,
      appointmentTitle: updatedAppointment.title,
      appointmentDescription: updatedAppointment.description || undefined,
      formattedDate,
      formattedStartTime,
      formattedEndTime,
      location: updatedAppointment.location || undefined
    });

    // Envoyer l'email via Nodemailer
    const emailResult = await sendEmail({
      to: updatedAppointment.contact.email,
      subject: `✓ Rendez-vous confirmé - ${updatedAppointment.title}`,
      htmlContent: emailHtml,
      textContent: emailText,
      type: 'confirmation',
      contactId: updatedAppointment.contactId,
      sentBy: 'system'
    });

    if (emailResult.success) {
      console.log('✓ Email de confirmation envoyé');
    } else {
      console.error('Erreur lors de l\'envoi de l\'email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous confirmé et email envoyé',
      appointment: updatedAppointment
    });

  } catch (error) {
    console.error('Error confirming appointment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la confirmation du rendez-vous' },
      { status: 500 }
    );
  }
}
