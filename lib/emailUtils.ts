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
  attachments?: Array<
    | { filename: string; path: string }  // Local file
    | { filename: string; href: string }   // Remote file (URL)
  >;
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
      attachments: attachments?.map(att => {
        // Handle both href (URLs) and path (local files)
        if ('href' in att) {
          // Remote file (R2, etc.)
          return {
            filename: att.filename,
            href: att.href
          };
        } else {
          // Local file
          return {
            filename: att.filename,
            path: path.isAbsolute(att.path) ? att.path : path.join(process.cwd(), att.path)
          };
        }
      })
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
 * Generate HTML email for new contact notification (ADMIN)
 */
export function generateNewContactAdminEmailHTML(params: {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactMessage?: string;
  contactType?: string;
  wantsCallback: boolean;
  callbackDate?: string;
  callbackTime?: string;
}): string {
  const { contactName, contactEmail, contactPhone, contactMessage, contactType, wantsCallback, callbackDate, callbackTime } = params;

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
    .info-box {
      background: #fff;
      padding: 20px;
      border-left: 4px solid #000;
      margin: 20px 0;
    }
    .label {
      font-weight: bold;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    .value {
      font-size: 16px;
      color: #000;
      margin: 5px 0 15px 0;
    }
    .urgent {
      background: #fff3cd;
      border-left-color: #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔔 NOUVEAU CONTACT</h1>
  </div>
  <div class="content">
    <h2>Nouvelle demande de contact reçue</h2>

    <div class="info-box">
      <div class="label">Nom</div>
      <div class="value">${contactName}</div>

      <div class="label">Email</div>
      <div class="value">${contactEmail}</div>

      ${contactPhone ? `
        <div class="label">Téléphone</div>
        <div class="value">${contactPhone}</div>
      ` : ''}

      ${contactType ? `
        <div class="label">Type</div>
        <div class="value">${contactType === 'professional' ? '💼 Professionnel' : '⭐ Mannequin'}</div>
      ` : ''}
    </div>

    ${wantsCallback ? `
      <div class="urgent">
        <strong>⚠️ RAPPEL DEMANDÉ</strong><br>
        Date : ${callbackDate || 'Non spécifiée'}<br>
        Créneau : ${callbackTime || 'Non spécifié'}
      </div>
    ` : ''}

    ${contactMessage ? `
      <div class="info-box">
        <div class="label">Message</div>
        <div class="value">${contactMessage}</div>
      </div>
    ` : ''}

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/contacts" style="display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
        Voir dans le CRM
      </a>
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate HTML email for contact confirmation (CLIENT)
 */
export function generateContactConfirmationEmailHTML(params: {
  contactName: string;
  wantsCallback: boolean;
  callbackDate?: string;
  callbackTime?: string;
}): string {
  const { contactName, wantsCallback, callbackDate, callbackTime } = params;

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
    .highlight {
      background: #fff;
      padding: 20px;
      border-left: 4px solid #000;
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
    <p>Bonjour ${contactName},</p>

    <p>Nous avons bien reçu votre demande de contact et vous en remercions.</p>

    ${wantsCallback ? `
      <div class="highlight">
        <p><strong>Votre rappel est programmé :</strong></p>
        <p>📅 ${callbackDate || 'Date à confirmer'}<br>
        🕐 ${callbackTime || 'Horaire à confirmer'}</p>
      </div>
      <p>Un membre de notre équipe vous contactera à l'heure convenue.</p>
    ` : `
      <p>Notre équipe prendra contact avec vous dans les plus brefs délais.</p>
    `}

    <p>Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement.</p>

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
 * Generate HTML email for signature completed notification (ADMIN)
 */
export function generateSignatureCompletedAdminEmailHTML(params: {
  documentName: string;
  signerName: string;
  signerEmail: string;
  signedAt: Date;
  documentId: string;
}): string {
  const { documentName, signerName, signerEmail, signedAt, documentId } = params;

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
      background: #28a745;
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
    .success-box {
      background: #d4edda;
      border-left: 4px solid #28a745;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box {
      background: #fff;
      padding: 20px;
      margin: 20px 0;
    }
    .label {
      font-weight: bold;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    .value {
      font-size: 16px;
      color: #000;
      margin: 5px 0 15px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ DOCUMENT SIGNÉ</h1>
  </div>
  <div class="content">
    <div class="success-box">
      <p style="margin: 0; font-size: 18px;"><strong>Un document vient d'être signé électroniquement</strong></p>
    </div>

    <div class="info-box">
      <div class="label">Document</div>
      <div class="value">${documentName}</div>

      <div class="label">Signé par</div>
      <div class="value">${signerName} (${signerEmail})</div>

      <div class="label">Date et heure</div>
      <div class="value">${signedAt.toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short'
      })}</div>
    </div>

    <p>Le document signé est disponible dans le CRM avec toutes les preuves de signature (hash, IP, timestamp).</p>

    <p style="margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/documents/${documentId}" style="display: inline-block; background: #28a745; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
        Voir le document
      </a>
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate HTML email for appointment reminder
 */
export function generateAppointmentReminderEmailHTML(params: {
  contactName: string;
  appointmentTitle: string;
  appointmentDate: Date;
  appointmentDescription?: string;
}): string {
  const { contactName, appointmentTitle, appointmentDate, appointmentDescription } = params;

  const dateStr = appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const timeStr = appointmentDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

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
      background: #ff9800;
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
    .reminder-box {
      background: #fff3cd;
      border-left: 4px solid #ff9800;
      padding: 20px;
      margin: 20px 0;
    }
    .datetime {
      background: #fff;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
      border-radius: 5px;
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
    <h1>⏰ RAPPEL DE RENDEZ-VOUS</h1>
  </div>
  <div class="content">
    <p>Bonjour ${contactName},</p>

    <div class="reminder-box">
      <p style="margin: 0; font-size: 18px;"><strong>Vous avez un rendez-vous demain avec ZMR Models Agency</strong></p>
    </div>

    <div class="datetime">
      <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase;">Rendez-vous</p>
      <p style="margin: 10px 0; font-size: 24px; font-weight: bold;">${appointmentTitle}</p>
      <p style="margin: 5px 0; font-size: 18px;">📅 ${dateStr}</p>
      <p style="margin: 5px 0; font-size: 18px;">🕐 ${timeStr}</p>
      ${appointmentDescription ? `<p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">${appointmentDescription}</p>` : ''}
    </div>

    <p>Si vous avez un empêchement, merci de nous prévenir au plus tôt.</p>

    <p>À demain,<br>
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
 * Generate HTML email for appointment confirmation
 */
export function generateAppointmentConfirmationEmailHTML(params: {
  contactName: string;
  appointmentTitle: string;
  appointmentDescription?: string;
  formattedDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
  location?: string;
}): string {
  const { contactName, appointmentTitle, appointmentDescription, formattedDate, formattedStartTime, formattedEndTime, location } = params;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #0f172a;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        padding: 40px 32px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .check-icon {
        width: 64px;
        height: 64px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      .content {
        padding: 40px 32px;
      }
      .greeting {
        font-size: 18px;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 16px;
      }
      .message {
        font-size: 16px;
        color: #64748b;
        margin-bottom: 32px;
        line-height: 1.8;
      }
      .appointment-card {
        background-color: #f8fafc;
        border-left: 4px solid #6366f1;
        border-radius: 8px;
        padding: 24px;
        margin: 32px 0;
      }
      .appointment-title {
        font-size: 20px;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 16px;
      }
      .detail-row {
        display: flex;
        align-items: start;
        margin-bottom: 12px;
        font-size: 14px;
      }
      .detail-icon {
        color: #6366f1;
        margin-right: 12px;
        min-width: 20px;
      }
      .detail-label {
        font-weight: 600;
        color: #475569;
        margin-right: 8px;
      }
      .detail-value {
        color: #0f172a;
      }
      .status-badge {
        display: inline-block;
        background-color: #dcfce7;
        color: #15803d;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 8px;
      }
      .footer {
        background-color: #f8fafc;
        padding: 32px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
      }
      .footer-text {
        font-size: 14px;
        color: #64748b;
        margin: 8px 0;
      }
      .agency-name {
        font-weight: 600;
        color: #6366f1;
        font-size: 16px;
        margin-bottom: 8px;
      }
      .contact-info {
        font-size: 13px;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="check-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1>Rendez-vous confirmé !</h1>
      </div>

      <div class="content">
        <div class="greeting">
          Bonjour ${contactName},
        </div>

        <div class="message">
          Votre rendez-vous avec <strong>ZMR Models Agency</strong> a été confirmé avec succès.
          Nous avons hâte de vous rencontrer !
        </div>

        <div class="appointment-card">
          <div class="appointment-title">
            ${appointmentTitle}
          </div>

          <div class="detail-row">
            <div class="detail-icon">📅</div>
            <div>
              <span class="detail-label">Date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-icon">🕐</div>
            <div>
              <span class="detail-label">Horaire :</span>
              <span class="detail-value">${formattedStartTime} - ${formattedEndTime}</span>
            </div>
          </div>

          ${location ? `
          <div class="detail-row">
            <div class="detail-icon">📍</div>
            <div>
              <span class="detail-label">Lieu :</span>
              <span class="detail-value">${location}</span>
            </div>
          </div>
          ` : ''}

          ${appointmentDescription ? `
          <div class="detail-row">
            <div class="detail-icon">📝</div>
            <div>
              <span class="detail-label">Détails :</span>
              <div class="detail-value">${appointmentDescription}</div>
            </div>
          </div>
          ` : ''}

          <span class="status-badge">✓ Confirmé</span>
        </div>

        <div class="message">
          En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.
        </div>
      </div>

      <div class="footer">
        <div class="agency-name">ZMR Models Agency</div>
        <div class="footer-text">
          Agence de mannequins professionnelle
        </div>
        <div class="contact-info">
          Paris, France
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}

/**
 * Generate text email for appointment confirmation
 */
export function generateAppointmentConfirmationEmailText(params: {
  contactName: string;
  appointmentTitle: string;
  appointmentDescription?: string;
  formattedDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
  location?: string;
}): string {
  const { contactName, appointmentTitle, appointmentDescription, formattedDate, formattedStartTime, formattedEndTime, location } = params;

  return `
Rendez-vous confirmé !

Bonjour ${contactName},

Votre rendez-vous avec ZMR Models Agency a été confirmé avec succès.

Détails du rendez-vous :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${appointmentTitle}

📅 Date : ${formattedDate}
🕐 Horaire : ${formattedStartTime} - ${formattedEndTime}
${location ? `📍 Lieu : ${location}` : ''}
${appointmentDescription ? `📝 Détails : ${appointmentDescription}` : ''}

✓ Statut : CONFIRMÉ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.

Cordialement,
ZMR Models Agency
  `.trim();
}

/**
 * Generate HTML email for appointment modification
 */
export function generateAppointmentModificationEmailHTML(params: {
  contactName: string;
  appointmentTitle: string;
  appointmentDescription?: string;
  formattedDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
  location?: string;
}): string {
  const { contactName, appointmentTitle, appointmentDescription, formattedDate, formattedStartTime, formattedEndTime, location } = params;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #0f172a;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        padding: 40px 32px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .icon {
        width: 64px;
        height: 64px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      .content {
        padding: 40px 32px;
      }
      .greeting {
        font-size: 18px;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 16px;
      }
      .message {
        font-size: 16px;
        color: #64748b;
        margin-bottom: 32px;
        line-height: 1.8;
      }
      .appointment-card {
        background-color: #fffbeb;
        border-left: 4px solid #f59e0b;
        border-radius: 8px;
        padding: 24px;
        margin: 32px 0;
      }
      .appointment-title {
        font-size: 20px;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 16px;
      }
      .detail-row {
        display: flex;
        align-items: start;
        margin-bottom: 12px;
        font-size: 14px;
      }
      .detail-icon {
        color: #f59e0b;
        margin-right: 12px;
        min-width: 20px;
      }
      .detail-label {
        font-weight: 600;
        color: #475569;
        margin-right: 8px;
      }
      .detail-value {
        color: #0f172a;
      }
      .status-badge {
        display: inline-block;
        background-color: #fef3c7;
        color: #92400e;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 8px;
      }
      .footer {
        background-color: #f8fafc;
        padding: 32px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
      }
      .footer-text {
        font-size: 14px;
        color: #64748b;
        margin: 8px 0;
      }
      .agency-name {
        font-weight: 600;
        color: #f59e0b;
        font-size: 16px;
        margin-bottom: 8px;
      }
      .contact-info {
        font-size: 13px;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <h1>Rendez-vous modifié</h1>
      </div>

      <div class="content">
        <div class="greeting">
          Bonjour ${contactName},
        </div>

        <div class="message">
          Votre rendez-vous avec <strong>ZMR Models Agency</strong> a été modifié.
          Veuillez noter les nouvelles informations ci-dessous.
        </div>

        <div class="appointment-card">
          <div class="appointment-title">
            ${appointmentTitle}
          </div>

          <div class="detail-row">
            <div class="detail-icon">📅</div>
            <div>
              <span class="detail-label">Nouvelle date :</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-icon">🕐</div>
            <div>
              <span class="detail-label">Nouvel horaire :</span>
              <span class="detail-value">${formattedStartTime} - ${formattedEndTime}</span>
            </div>
          </div>

          ${location ? `
          <div class="detail-row">
            <div class="detail-icon">📍</div>
            <div>
              <span class="detail-label">Lieu :</span>
              <span class="detail-value">${location}</span>
            </div>
          </div>
          ` : ''}

          ${appointmentDescription ? `
          <div class="detail-row">
            <div class="detail-icon">📝</div>
            <div>
              <span class="detail-label">Détails :</span>
              <div class="detail-value">${appointmentDescription}</div>
            </div>
          </div>
          ` : ''}

          <span class="status-badge">⚠ Modifié</span>
        </div>

        <div class="message">
          Si ces modifications ne vous conviennent pas, merci de nous contacter rapidement.
        </div>
      </div>

      <div class="footer">
        <div class="agency-name">ZMR Models Agency</div>
        <div class="footer-text">
          Agence de mannequins professionnelle
        </div>
        <div class="contact-info">
          Paris, France
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}

/**
 * Generate text email for appointment modification
 */
export function generateAppointmentModificationEmailText(params: {
  contactName: string;
  appointmentTitle: string;
  appointmentDescription?: string;
  formattedDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
  location?: string;
}): string {
  const { contactName, appointmentTitle, appointmentDescription, formattedDate, formattedStartTime, formattedEndTime, location } = params;

  return `
Rendez-vous modifié

Bonjour ${contactName},

Votre rendez-vous avec ZMR Models Agency a été modifié.

Nouvelles informations :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${appointmentTitle}

📅 Date : ${formattedDate}
🕐 Horaire : ${formattedStartTime} - ${formattedEndTime}
${location ? `📍 Lieu : ${location}` : ''}
${appointmentDescription ? `📝 Détails : ${appointmentDescription}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si ces modifications ne vous conviennent pas, merci de nous contacter rapidement.

Cordialement,
ZMR Models Agency
  `.trim();
}

/**
 * Generate HTML email for appointment cancellation
 */
export function generateAppointmentCancellationEmailHTML(params: {
  contactName: string;
  appointmentTitle: string;
  formattedDate: string;
  formattedStartTime: string;
}): string {
  const { contactName, appointmentTitle, formattedDate, formattedStartTime } = params;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #0f172a;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
        padding: 40px 32px;
        text-align: center;
        color: white;
      }
      .content {
        padding: 40px 32px;
      }
      .message {
        font-size: 16px;
        color: #64748b;
        margin: 16px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Rendez-vous annulé</h1>
      </div>
      <div class="content">
        <p class="message">Bonjour ${contactName},</p>
        <p class="message">
          Votre rendez-vous <strong>${appointmentTitle}</strong> prévu le
          <strong>${formattedDate}</strong> à <strong>${formattedStartTime}</strong>
          a été annulé.
        </p>
        <p class="message">
          Pour toute question, n'hésitez pas à nous contacter.
        </p>
        <p class="message">Cordialement,<br>ZMR Models Agency</p>
      </div>
    </div>
  </body>
</html>
  `;
}

/**
 * Generate text email for appointment cancellation
 */
export function generateAppointmentCancellationEmailText(params: {
  contactName: string;
  appointmentTitle: string;
  formattedDate: string;
  formattedStartTime: string;
}): string {
  const { contactName, appointmentTitle, formattedDate, formattedStartTime } = params;

  return `
Rendez-vous annulé

Bonjour ${contactName},

Votre rendez-vous "${appointmentTitle}" prévu le ${formattedDate} à ${formattedStartTime} a été annulé.

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
ZMR Models Agency
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
