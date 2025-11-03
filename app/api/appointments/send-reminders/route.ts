import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  sendEmail,
  generateAppointmentReminderEmailHTML
} from '@/lib/emailUtils';

const prisma = new PrismaClient();

/**
 * POST /api/appointments/send-reminders
 *
 * Envoie des rappels pour les rendez-vous du lendemain
 *
 * Cette route peut être appelée :
 * - Manuellement depuis l'admin
 * - Par un cron job quotidien (recommandé : tous les jours à 18h)
 * - Par Vercel Cron Jobs
 */
export async function POST(request: Request) {
  try {
    // Calculer la plage de dates pour "demain"
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Récupérer tous les rendez-vous de demain
    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: tomorrow,
          lt: dayAfterTomorrow
        },
        status: {
          in: ['scheduled', 'confirmed']
        }
      },
      include: {
        contact: true
      }
    });

    console.log(`📅 ${appointments.length} rendez-vous trouvés pour demain`);

    if (appointments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun rendez-vous demain',
        sent: 0
      });
    }

    // Envoyer un rappel pour chaque rendez-vous
    let sentCount = 0;
    let errorCount = 0;
    const results = [];

    for (const appointment of appointments) {
      try {
        // Déterminer le destinataire et son nom
        const recipientEmail = appointment.contact?.email;
        const recipientName = appointment.contact?.name || 'Client';

        if (!recipientEmail) {
          console.warn(`⚠️  Pas d'email pour le rendez-vous ${appointment.id}`);
          errorCount++;
          results.push({
            appointmentId: appointment.id,
            status: 'skipped',
            reason: 'No email address'
          });
          continue;
        }

        // Envoyer le rappel
        const emailResult = await sendEmail({
          to: recipientEmail,
          subject: `⏰ Rappel: Rendez-vous demain - ZMR Models Agency`,
          htmlContent: generateAppointmentReminderEmailHTML({
            contactName: recipientName,
            appointmentTitle: appointment.title,
            appointmentDate: appointment.startTime,
            appointmentDescription: appointment.description || undefined
          }),
          textContent: `Bonjour ${recipientName},\n\nVous avez un rendez-vous demain avec ZMR Models Agency:\n\n${appointment.title}\nDate: ${appointment.startTime.toLocaleString('fr-FR')}\n${appointment.description ? `\n${appointment.description}\n` : ''}\nSi vous avez un empêchement, merci de nous prévenir au plus tôt.\n\nÀ demain,\nL'équipe ZMR Models Agency`,
          type: 'reminder',
          contactId: appointment.contactId,
          sentBy: 'System'
        });

        if (emailResult.success) {
          sentCount++;
          results.push({
            appointmentId: appointment.id,
            status: 'sent',
            to: recipientEmail,
            messageId: emailResult.messageId
          });
          console.log(`✅ Rappel envoyé pour RDV ${appointment.id} à ${recipientEmail}`);
        } else {
          errorCount++;
          results.push({
            appointmentId: appointment.id,
            status: 'failed',
            error: emailResult.error
          });
          console.error(`❌ Échec envoi rappel RDV ${appointment.id}:`, emailResult.error);
        }

      } catch (error) {
        errorCount++;
        results.push({
          appointmentId: appointment.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`❌ Erreur lors de l'envoi du rappel pour ${appointment.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Rappels envoyés: ${sentCount}/${appointments.length}`,
      sent: sentCount,
      errors: errorCount,
      total: appointments.length,
      results
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi des rappels:', error);
    return NextResponse.json(
      {
        error: 'Failed to send reminders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/appointments/send-reminders
 *
 * Preview des rendez-vous de demain (sans envoyer d'emails)
 */
export async function GET() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: tomorrow,
          lt: dayAfterTomorrow
        },
        status: {
          in: ['scheduled', 'confirmed']
        }
      },
      include: {
        contact: true
      }
    });

    return NextResponse.json({
      date: tomorrow.toLocaleDateString('fr-FR'),
      count: appointments.length,
      appointments: appointments.map(apt => ({
        id: apt.id,
        title: apt.title,
        startTime: apt.startTime,
        contactName: apt.contact?.name || 'N/A',
        contactEmail: apt.contact?.email || 'N/A'
      }))
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
