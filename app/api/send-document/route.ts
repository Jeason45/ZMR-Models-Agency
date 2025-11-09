import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  sendEmail,
  generateDocumentEmailHTML,
  generateDocumentEmailText
} from '@/lib/emailUtils';
import crypto from 'crypto';
import path from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

// POST /api/send-document - Send document by email
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      documentId,
      to,
      cc,
      bcc,
      message,
      requiresSignature,
      sentBy
    } = body;

    // Validation
    if (!documentId || !to) {
      return NextResponse.json(
        { error: 'Missing documentId or recipient email' },
        { status: 400 }
      );
    }

    // Get document from database
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        template: true,
        talent: true,
        contact: true
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Determine recipient name
    let recipientName = 'Client';
    if (document.talent) {
      recipientName = document.talent.name;
    } else if (document.contact) {
      recipientName = document.contact.name;
    }

    // Generate signature URL if required
    let signatureUrl: string | undefined;
    if (requiresSignature) {
      // Generate unique signature token
      const signatureToken = crypto.randomBytes(32).toString('hex');

      // Calculate expiration (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Store token in database
      await prisma.signatureRequest.create({
        data: {
          token: signatureToken,
          documentId: document.id,
          recipientEmail: to,
          recipientName: recipientName,
          expiresAt,
          status: 'pending'
        }
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      signatureUrl = `${baseUrl}/sign/${signatureToken}?documentId=${documentId}`;
    }

    // Generate email content
    const htmlContent = generateDocumentEmailHTML({
      recipientName,
      documentName: document.fileName,
      documentType: document.type,
      message,
      signatureUrl
    });

    const textContent = generateDocumentEmailText({
      recipientName,
      documentName: document.fileName,
      documentType: document.type,
      message,
      signatureUrl
    });

    // Prepare attachments
    const attachments = [];

    // Add PDF if available
    if (document.filePath) {
      // Check if it's an R2 URL (new system) or local path (old system)
      if (document.filePath.startsWith('http://') || document.filePath.startsWith('https://')) {
        // R2 URL: use href instead of path for remote files
        attachments.push({
          filename: document.fileName,
          href: document.filePath // Use href for URLs (nodemailer requirement)
        });
        console.log('✅ Attachment added from R2:', document.filePath);
      } else {
        // Local file (old system): convert to absolute path
        let absolutePath: string;

        if (document.filePath.startsWith('/storage/')) {
          absolutePath = path.join(process.cwd(), 'public', document.filePath);
        } else {
          absolutePath = document.filePath.startsWith('/')
            ? document.filePath
            : path.join(process.cwd(), document.filePath);
        }

        // Verify file exists before adding
        if (existsSync(absolutePath)) {
          attachments.push({
            filename: document.fileName,
            path: absolutePath
          });
          console.log('✅ Attachment added from local:', absolutePath);
        } else {
          console.error('❌ File not found:', absolutePath);
          return NextResponse.json(
            {
              error: 'Document file not found on server',
              details: `Path: ${absolutePath}`
            },
            { status: 404 }
          );
        }
      }
    }

    // Send email
    const emailResult = await sendEmail({
      to,
      cc,
      bcc,
      subject: `Document: ${document.fileName}`,
      htmlContent,
      textContent,
      attachments,
      documentId: document.id,
      talentId: document.talentId || undefined,
      contactId: document.contactId || undefined,
      type: requiresSignature ? 'signature_request' : 'document_sent',
      sentBy
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

    // Update document status
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: requiresSignature ? 'sent' : document.status,
        sentAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId,
      mailLogId: emailResult.mailLogId,
      signatureUrl: signatureUrl || null
    });

  } catch (error) {
    console.error('Error sending document:', error);
    return NextResponse.json(
      {
        error: 'Failed to send document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
