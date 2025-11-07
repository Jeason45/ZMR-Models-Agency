import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  sendEmail,
  generateDocumentEmailHTML,
  generateDocumentEmailText
} from '@/lib/emailUtils';
import * as path from 'path';
import * as fs from 'fs';

// POST /api/contacts/[id]/send-document - Envoyer un document à un contact
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const contactId = params.id;
    const body = await request.json();

    const { documentId, message, requiresSignature, sentBy } = body;

    // Validation
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Récupérer le contact
    const contact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Récupérer le document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        template: true
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Générer l'URL de signature si nécessaire
    let signatureUrl: string | undefined;
    let signatureRequestRecord = null;

    if (requiresSignature) {
      const crypto = require('crypto');
      const signatureToken = crypto.randomBytes(32).toString('hex');
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      signatureUrl = `${baseUrl}/sign/${signatureToken}`;

      // Créer une demande de signature avec expiration de 30 jours
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      signatureRequestRecord = await prisma.signatureRequest.create({
        data: {
          documentId: documentId,
          token: signatureToken,
          recipientEmail: contact.email,
          recipientName: contact.name,
          expiresAt: expiresAt,
          status: 'pending'
        }
      });
    }

    // Générer le contenu de l'email
    const htmlContent = generateDocumentEmailHTML({
      recipientName: contact.name,
      documentName: document.fileName,
      documentType: document.type,
      message,
      signatureUrl
    });

    const textContent = generateDocumentEmailText({
      recipientName: contact.name,
      documentName: document.fileName,
      documentType: document.type,
      message,
      signatureUrl
    });

    // Préparer les pièces jointes
    const attachments = [];
    if (document.filePath) {
      // Convertir le chemin relatif en chemin absolu
      // document.filePath est de la forme "/storage/documents/file.pdf"
      // On enlève le premier slash pour éviter un double chemin
      const relativePath = document.filePath.startsWith('/')
        ? document.filePath.substring(1)
        : document.filePath;

      const absolutePath = path.join(process.cwd(), 'public', relativePath);

      // Vérifier que le fichier existe
      if (!fs.existsSync(absolutePath)) {
        console.error('PDF file not found:', absolutePath);
        return NextResponse.json(
          {
            error: 'Document file not found',
            details: `Le fichier PDF n'existe pas à l'emplacement: ${absolutePath}`
          },
          { status: 404 }
        );
      }

      attachments.push({
        filename: document.fileName,
        path: absolutePath
      });
    }

    // Envoyer l'email
    const emailResult = await sendEmail({
      to: contact.email,
      subject: `Document: ${document.fileName}`,
      htmlContent,
      textContent,
      attachments,
      documentId: document.id,
      contactId: contact.id,
      type: requiresSignature ? 'signature_request' : 'document_sent',
      sentBy: sentBy || 'admin'
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error: 'Failed to send email',
          details: emailResult.error
        },
        { status: 500 }
      );
    }

    // Mettre à jour le document avec la date d'envoi
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: requiresSignature ? 'sent' : document.status,
        sentAt: new Date()
      }
    });

    // Associer le document au contact s'il ne l'est pas déjà
    if (document.contactId !== contactId) {
      await prisma.document.update({
        where: { id: documentId },
        data: {
          contactId: contactId
        }
      });
    }

    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId,
      mailLogId: emailResult.mailLogId,
      signatureUrl: signatureUrl || null
    });

  } catch (error) {
    console.error('Error sending document to contact:', error);
    return NextResponse.json(
      {
        error: 'Failed to send document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
