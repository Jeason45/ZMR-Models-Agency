import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/contacts/[id] - Récupérer tous les détails d'un contact
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Récupérer le contact avec toutes ses relations
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        // Rendez-vous associés (triés par date décroissante)
        appointments: {
          orderBy: { startTime: 'desc' }
        },
        // Documents envoyés à ce contact
        documents: {
          orderBy: { createdAt: 'desc' }
        }
        // TODO: Re-enable mailLogs once schema migration is complete
        // mailLogs: {
        //   orderBy: { sentAt: 'desc' },
        //   take: 50 // Limiter aux 50 derniers emails
        // }
      }
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Construire une timeline d'activités
    const activities = [];

    // Ajouter rendez-vous à la timeline
    contact.appointments.forEach(apt => {
      activities.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        title: apt.title,
        description: apt.description,
        date: apt.createdAt,
        status: apt.status,
        metadata: {
          startTime: apt.startTime,
          endTime: apt.endTime,
          location: apt.location
        }
      });
    });

    // TODO: Re-enable mailLogs timeline once schema migration is complete
    // Ajouter emails à la timeline
    // contact.mailLogs.forEach(mail => {
    //   activities.push({
    //     id: `mail-${mail.id}`,
    //     type: 'email',
    //     title: mail.subject,
    //     description: mail.type,
    //     date: mail.sentAt,
    //     status: mail.status,
    //     metadata: {
    //       to: mail.to,
    //       documentId: mail.documentId
    //     }
    //   });
    // });

    // Ajouter documents à la timeline
    contact.documents.forEach(doc => {
      activities.push({
        id: `doc-${doc.id}`,
        type: 'document',
        title: doc.fileName,
        description: doc.type,
        date: doc.createdAt,
        status: doc.status,
        metadata: {
          sentAt: doc.sentAt,
          signedAt: doc.signedAt
        }
      });
    });

    // Trier la timeline par date (plus récent en premier)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Retourner le contact avec la timeline
    return NextResponse.json({
      ...contact,
      timeline: activities
    });

  } catch (error) {
    console.error('Error fetching contact details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact details' },
      { status: 500 }
    );
  }
}

// PATCH /api/contacts/[id] - Mettre à jour un contact (statut, notes, etc.)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    const { status, notes, name, email, phone, message, type, adresse_client, code_postal, ville } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Mettre à jour le contact
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(message !== undefined && { message }),
        ...(type !== undefined && { type }),
        ...(adresse_client !== undefined && { adresse_client }),
        ...(code_postal !== undefined && { code_postal }),
        ...(ville !== undefined && { ville })
      },
      include: {
        appointments: {
          orderBy: { startTime: 'desc' }
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        }
        // TODO: Re-enable mailLogs once schema migration is complete
        // mailLogs: {
        //   orderBy: { sentAt: 'desc' },
        //   take: 50
        // }
      }
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

// DELETE /api/contacts/[id] - Supprimer un contact
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    await prisma.contact.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
