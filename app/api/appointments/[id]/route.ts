import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  sendEmail,
  generateAppointmentModificationEmailHTML,
  generateAppointmentModificationEmailText,
  generateAppointmentCancellationEmailHTML,
  generateAppointmentCancellationEmailText
} from '@/lib/emailUtils';

// PUT - Modifier un rendez-vous
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    const {
      title,
      description,
      startTime,
      endTime,
      location,
      notes,
      contactId
    } = body;

    // Récupérer l'ancien rendez-vous
    const oldAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: { contact: true }
    });

    if (!oldAppointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le rendez-vous
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        notes,
        contactId
      },
      include: {
        contact: true
      }
    });

    // Vérifier si les détails importants ont changé (date, heure)
    const hasImportantChanges =
      new Date(oldAppointment.startTime).getTime() !== new Date(startTime).getTime() ||
      new Date(oldAppointment.endTime).getTime() !== new Date(endTime).getTime() ||
      oldAppointment.location !== location;

    // Si des changements importants, envoyer un email
    if (hasImportantChanges) {
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
      const emailHtml = generateAppointmentModificationEmailHTML({
        contactName: updatedAppointment.contact.name,
        appointmentTitle: updatedAppointment.title,
        appointmentDescription: updatedAppointment.description || undefined,
        formattedDate,
        formattedStartTime,
        formattedEndTime,
        location: updatedAppointment.location || undefined
      });

      const emailText = generateAppointmentModificationEmailText({
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
        subject: `⚠ Rendez-vous modifié - ${updatedAppointment.title}`,
        htmlContent: emailHtml,
        textContent: emailText,
        type: 'confirmation',
        contactId: updatedAppointment.contactId,
        sentBy: 'system'
      });

      if (!emailResult.success) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailResult.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: hasImportantChanges
        ? 'Rendez-vous modifié et email envoyé'
        : 'Rendez-vous modifié',
      appointment: updatedAppointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du rendez-vous' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un rendez-vous
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Récupérer le rendez-vous avant suppression
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { contact: true }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le rendez-vous
    await prisma.appointment.delete({
      where: { id }
    });

    // Envoyer email d'annulation
    const startDate = new Date(appointment.startTime);
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

    // Générer les emails HTML et texte
    const emailHtml = generateAppointmentCancellationEmailHTML({
      contactName: appointment.contact.name,
      appointmentTitle: appointment.title,
      formattedDate,
      formattedStartTime
    });

    const emailText = generateAppointmentCancellationEmailText({
      contactName: appointment.contact.name,
      appointmentTitle: appointment.title,
      formattedDate,
      formattedStartTime
    });

    // Envoyer l'email via Nodemailer
    const emailResult = await sendEmail({
      to: appointment.contact.email,
      subject: `❌ Rendez-vous annulé - ${appointment.title}`,
      htmlContent: emailHtml,
      textContent: emailText,
      type: 'confirmation',
      contactId: appointment.contactId,
      sentBy: 'system'
    });

    if (!emailResult.success) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous supprimé et email envoyé'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}
