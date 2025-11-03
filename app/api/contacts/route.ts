import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  sendEmail,
  generateNewContactAdminEmailHTML,
  generateContactConfirmationEmailHTML
} from '@/lib/emailUtils';

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

    // EMAILS AUTOMATIQUES
    const adminEmail = process.env.ADMIN_EMAIL;

    // 1. Email de notification à l'admin
    if (adminEmail) {
      try {
        const callbackDate = selectedDay ? new Date(selectedDay).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : undefined;

        await sendEmail({
          to: adminEmail,
          subject: `🔔 Nouveau contact: ${name}`,
          htmlContent: generateNewContactAdminEmailHTML({
            contactName: name,
            contactEmail: email,
            contactPhone: phone || undefined,
            contactMessage: message || undefined,
            contactType: selectedType || undefined,
            wantsCallback: wantCallback || false,
            callbackDate,
            callbackTime: selectedSlot || undefined
          }),
          textContent: `Nouveau contact reçu:\n\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone || 'Non renseigné'}\nMessage: ${message || 'Aucun'}\nRappel demandé: ${wantCallback ? 'Oui' : 'Non'}`,
          type: 'custom',
          contactId: contact.id,
          sentBy: 'System'
        });

        console.log('✅ Email admin envoyé pour nouveau contact');
      } catch (error) {
        console.error('❌ Erreur envoi email admin:', error);
        // Ne pas bloquer la création du contact si l'email échoue
      }
    }

    // 2. Email de confirmation au client
    try {
      const callbackDate = selectedDay ? new Date(selectedDay).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }) : undefined;

      await sendEmail({
        to: email,
        subject: 'Confirmation de votre demande - ZMR Models Agency',
        htmlContent: generateContactConfirmationEmailHTML({
          contactName: name,
          wantsCallback: wantCallback || false,
          callbackDate,
          callbackTime: selectedSlot || undefined
        }),
        textContent: `Bonjour ${name},\n\nNous avons bien reçu votre demande de contact et vous en remercions.\n\n${wantCallback ? `Votre rappel est programmé le ${callbackDate || 'date à confirmer'} à ${selectedSlot || 'horaire à confirmer'}.\n\nUn membre de notre équipe vous contactera à l'heure convenue.` : 'Notre équipe prendra contact avec vous dans les plus brefs délais.'}\n\nCordialement,\nL'équipe ZMR Models Agency`,
        type: 'confirmation',
        contactId: contact.id,
        sentBy: 'System'
      });

      console.log('✅ Email de confirmation envoyé au client');
    } catch (error) {
      console.error('❌ Erreur envoi email client:', error);
      // Ne pas bloquer la création du contact si l'email échoue
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
