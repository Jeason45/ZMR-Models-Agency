/**
 * Email Utilities
 * Handles email sending with Nodemailer and logging
 */

import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// SMTP Configuration
// For development, you can use:
// 1. Gmail (requires App Password): smtp.gmail.com:587
// 2. Mailtrap (testing): smtp.mailtrap.io
// 3. SendGrid: smtp.sendgrid.net
// 4. Mailgun: smtp.mailgun.org
// 5. AWS SES

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || ''
  }
};

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
}

export interface SendEmailParams {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
  documentId?: string;
  talentId?: string;
  contactId?: string;
  type: 'document_sent' | 'signature_request' | 'confirmation' | 'reminder' | 'custom';
  sentBy?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  mailLogId?: string;
  error?: string;
}

/**
 * Send email and log to database
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const {
      to,
      cc,
      bcc,
      subject,
      htmlContent,
      textContent,
      attachments,
      documentId,
      talentId,
      contactId,
      type,
      sentBy
    } = params;

    // Validate SMTP configuration
    if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
      console.warn('⚠️  SMTP not configured. Set SMTP_USER and SMTP_PASSWORD env variables.');

      // Log to database even if not sent
      const mailLog = await prisma.mailLog.create({
        data: {
          type,
          subject,
          to: Array.isArray(to) ? to.join(', ') : to,
          cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : null,
          bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : null,
          htmlContent,
          textContent,
          attachments: attachments || [],
          documentId,
          talentId,
          contactId,
          sentBy,
          status: 'failed',
          error: 'SMTP not configured'
        }
      });

      return {
        success: false,
        error: 'SMTP not configured',
        mailLogId: mailLog.id
      };
    }

    // Prepare email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"ZMR Models Agency" <${SMTP_CONFIG.auth.user}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
      subject,
      html: htmlContent,
      text: textContent,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        path: path.join(process.cwd(), att.path)
      }))
    };

    // Send email
    const info = await getTransporter().sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);

    // Log to database
    const mailLog = await prisma.mailLog.create({
      data: {
        type,
        subject,
        to: Array.isArray(to) ? to.join(', ') : to,
        cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : null,
        bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : null,
        htmlContent,
        textContent,
        attachments: attachments || [],
        documentId,
        talentId,
        contactId,
        sentBy,
        status: 'sent'
      }
    });

    return {
      success: true,
      messageId: info.messageId,
      mailLogId: mailLog.id
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);

    // Log error to database
    try {
      const mailLog = await prisma.mailLog.create({
        data: {
          type: params.type,
          subject: params.subject,
          to: Array.isArray(params.to) ? params.to.join(', ') : params.to,
          cc: params.cc ? (Array.isArray(params.cc) ? params.cc.join(', ') : params.cc) : null,
          bcc: params.bcc ? (Array.isArray(params.bcc) ? params.bcc.join(', ') : params.bcc) : null,
          htmlContent: params.htmlContent,
          textContent: params.textContent,
          attachments: params.attachments || [],
          documentId: params.documentId,
          talentId: params.talentId,
          contactId: params.contactId,
          sentBy: params.sentBy,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        mailLogId: mailLog.id
      };
    } catch (dbError) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Generate HTML email template for document sending
 */
export function generateDocumentEmailHTML(params: {
  recipientName: string;
  documentName: string;
  documentType: string;
  message?: string;
  signatureUrl?: string;
}): string {
  const { recipientName, documentName, documentType, message, signatureUrl } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #000;
      color: #fff;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .button {
      display: inline-block;
      background: #000;
      color: #fff !important;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ZMR MODELS AGENCY</h1>
  </div>
  <div class="content">
    <p>Bonjour ${recipientName},</p>

    ${message ? `<p>${message}</p>` : ''}

    <p>Vous trouverez ci-joint le document suivant :</p>

    <p><strong>${documentName}</strong><br>
    Type : ${documentType}</p>

    ${signatureUrl ? `
      <p>Pour signer électroniquement ce document, veuillez cliquer sur le bouton ci-dessous :</p>
      <p style="text-align: center;">
        <a href="${signatureUrl}" class="button">Signer le document</a>
      </p>
    ` : ''}

    <p>Pour toute question, n'hésitez pas à nous contacter.</p>

    <p>Cordialement,<br>
    <strong>L'équipe ZMR Models Agency</strong></p>
  </div>
  <div class="footer">
    <p>ZMR Models Agency - Paris, France</p>
    <p>Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text version
 */
export function generateDocumentEmailText(params: {
  recipientName: string;
  documentName: string;
  documentType: string;
  message?: string;
  signatureUrl?: string;
}): string {
  const { recipientName, documentName, documentType, message, signatureUrl } = params;

  return `
Bonjour ${recipientName},

${message || ''}

Vous trouverez ci-joint le document suivant :

${documentName}
Type : ${documentType}

${signatureUrl ? `Pour signer électroniquement ce document, veuillez cliquer sur le lien suivant :\n${signatureUrl}\n` : ''}

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe ZMR Models Agency

---
ZMR Models Agency - Paris, France
Ce message a été envoyé automatiquement, merci de ne pas y répondre.
  `.trim();
}

/**
 * Test SMTP connection
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    await getTransporter().verify();
    console.log('✅ SMTP connection successful');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
}
