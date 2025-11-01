import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { clientConfirmationEmail, adminNotificationEmail } from '@/lib/email-templates';

// GET - Récupérer tous les contacts (pour le CRM)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const contacts = await prisma.contact.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: 'Failed to fetch contacts',
        details: error instanceof Error ? error.message : String(error),
        dbUrl: process.env.DATABASE_URL ? 'DB_URL is set' : 'DB_URL is missing'
      },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau contact (depuis le formulaire public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, message } = body;

    // Validation
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Créer le contact
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        type,
        message,
        status: 'new',
      },
    });

    // Envoyer les emails (sans bloquer la réponse si ça échoue)
    try {
      console.log('🔵 Début envoi emails pour:', name, email);

      // Email de confirmation au client
      const clientEmail = clientConfirmationEmail(name, message);
      console.log('📧 Envoi email client à:', email);
      const clientResult = await resend.emails.send({
        from: 'ZMR Models Agency <onboarding@resend.dev>',
        to: email,
        subject: clientEmail.subject,
        html: clientEmail.html,
      });
      console.log('✅ Email client envoyé:', clientResult);

      // Email de notification à l'admin
      const adminEmail = adminNotificationEmail({
        name,
        email,
        phone,
        type,
        message,
      });
      const adminEmailAddress = process.env.ADMIN_EMAIL || 'jlwebdesign33@gmail.com';
      console.log('📧 Envoi email admin à:', adminEmailAddress);
      const adminResult = await resend.emails.send({
        from: 'ZMR Models Agency <onboarding@resend.dev>',
        to: adminEmailAddress,
        subject: adminEmail.subject,
        html: adminEmail.html,
      });
      console.log('✅ Email admin envoyé:', adminResult);

      console.log('✅ Emails envoyés avec succès pour le contact:', contact.id);
    } catch (emailError) {
      // Log l'erreur mais ne bloque pas la création du contact
      console.error('❌ Erreur lors de l\'envoi des emails:', emailError);
      console.error('❌ Stack:', emailError instanceof Error ? emailError.stack : 'No stack');
    }

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le statut d'un contact
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}
