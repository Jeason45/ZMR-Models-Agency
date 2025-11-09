import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { generateSignedPDF } from '@/lib/signedPdfGenerator';
import { sendEmail } from '@/lib/emailUtils';
import { uploadToR2 } from '@/lib/r2Storage';

interface SignatureProofData {
  timestamp: string;
  ip: string;
  userAgent: string;
  documentHash: string;
  signerName: string;
  signerEmail: string;
  tokenUsed: string;
}

// POST /api/sign/submit - Soumettre une signature électronique
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, signerName, signerEmail, signatureImage, formData } = body;

    // Validation
    if (!token || !signerName || !signerEmail || !signatureImage) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    console.log('📝 Form data received from client:', formData);

    // Récupérer la demande de signature
    const signatureRequest = await prisma.signatureRequest.findUnique({
      where: { token },
      include: {
        document: true
      }
    });

    if (!signatureRequest) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 404 }
      );
    }

    // Vérifier l'expiration
    if (new Date() > new Date(signatureRequest.expiresAt)) {
      return NextResponse.json(
        { error: 'Ce lien a expiré' },
        { status: 410 }
      );
    }

    // Vérifier si déjà signé
    if (signatureRequest.status === 'completed') {
      return NextResponse.json(
        { error: 'Ce document a déjà été signé' },
        { status: 409 }
      );
    }

    // Capturer les informations de tracking
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Gérer le téléchargement du document (R2 ou local)
    let documentPath: string;
    let documentBuffer: Buffer;
    let isR2Document = false;

    if (signatureRequest.document.filePath.startsWith('http://') ||
        signatureRequest.document.filePath.startsWith('https://')) {
      // Document sur R2 - télécharger
      console.log('📥 Téléchargement du PDF depuis R2:', signatureRequest.document.filePath);
      isR2Document = true;

      const response = await fetch(signatureRequest.document.filePath);
      if (!response.ok) {
        throw new Error('Failed to download PDF from R2');
      }
      documentBuffer = Buffer.from(await response.arrayBuffer());

      // Créer un fichier temporaire
      const tempDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      documentPath = path.join(tempDir, `temp_${Date.now()}.pdf`);
      fs.writeFileSync(documentPath, documentBuffer);

      console.log('✅ PDF téléchargé depuis R2:', documentPath);
    } else {
      // Document local
      documentPath = path.join(
        process.cwd(),
        'public',
        signatureRequest.document.filePath.startsWith('/')
          ? signatureRequest.document.filePath.substring(1)
          : signatureRequest.document.filePath
      );

      if (!fs.existsSync(documentPath)) {
        throw new Error('Document file not found: ' + documentPath);
      }
      documentBuffer = fs.readFileSync(documentPath);
    }

    // Calculer le hash du document PDF pour intégrité
    const documentHash = crypto.createHash('sha256').update(documentBuffer).digest('hex');

    // Sauvegarder l'image de signature
    const signatureFileName = `signature_${signatureRequest.id}_${Date.now()}.png`;
    const signatureDir = path.join(process.cwd(), 'public', 'storage', 'signatures');

    if (!fs.existsSync(signatureDir)) {
      fs.mkdirSync(signatureDir, { recursive: true });
    }

    const signaturePath = path.join(signatureDir, signatureFileName);
    const base64Data = signatureImage.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(signaturePath, base64Data, 'base64');

    // Créer les données de preuve légale
    const proofData: SignatureProofData = {
      timestamp: new Date().toISOString(),
      ip: ipAddress,
      userAgent: userAgent,
      documentHash: documentHash,
      signerName: signerName,
      signerEmail: signerEmail,
      tokenUsed: token
    };

    // Créer la signature dans la base de données
    const signature = await prisma.signature.create({
      data: {
        documentId: signatureRequest.documentId,
        signerName: signerName,
        signerEmail: signerEmail,
        signerRole: 'client',
        signatureImage: `/storage/signatures/${signatureFileName}`,
        signatureType: 'drawn',
        ipAddress: ipAddress,
        userAgent: userAgent,
        documentHash: documentHash,
        proofData: proofData as any,
        isValid: true
      }
    });

    // Mettre à jour la demande de signature
    await prisma.signatureRequest.update({
      where: { id: signatureRequest.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        signatureId: signature.id
      }
    });

    // ========== GÉNÉRER LE PDF SIGNÉ ==========

    console.log('📄 Génération du PDF signé avec signature intégrée...');

    let signedPdfPath: string | null = null;

    try {
      // Générer le PDF signé avec la signature intégrée + données du formulaire
      signedPdfPath = await generateSignedPDF(
        documentPath,
        signaturePath,
        {
          signerName: signerName,
          signerEmail: signerEmail,
          signedAt: new Date(),
          ipAddress: ipAddress,
          documentHash: documentHash,
          formData: formData || {} // Include form data filled by client
        }
      );

      console.log('✅ PDF signé généré:', signedPdfPath);

      // Si le document original était sur R2, uploader le PDF signé sur R2 aussi
      let signedPdfUrl: string;
      let signedPdfAbsolutePath: string;

      if (isR2Document) {
        console.log('📤 Upload du PDF signé sur R2...');

        // Lire le PDF signé
        const signedPdfAbsPath = path.join(
          process.cwd(),
          'public',
          signedPdfPath.startsWith('/') ? signedPdfPath.substring(1) : signedPdfPath
        );
        const signedPdfBuffer = fs.readFileSync(signedPdfAbsPath);

        // Upload sur R2
        const signedFileName = signatureRequest.document.fileName.replace('.pdf', '_SIGNED.pdf');
        const uploadResult = await uploadToR2(signedPdfBuffer, `documents/${signedFileName}`);

        if (!uploadResult.success) {
          throw new Error('Failed to upload signed PDF to R2');
        }

        signedPdfUrl = uploadResult.url;
        console.log('✅ PDF signé uploadé sur R2:', signedPdfUrl);

        // Pour l'email, on peut soit utiliser l'URL R2, soit le fichier local temporaire
        // Utilisons le fichier local pour l'attachement email
        signedPdfAbsolutePath = signedPdfAbsPath;

        // Mettre à jour le document avec l'URL R2
        await prisma.document.update({
          where: { id: signatureRequest.documentId },
          data: {
            status: 'signed',
            signedAt: new Date(),
            signedBy: signerName,
            signedPdfPath: signedPdfUrl, // URL R2 du PDF signé
            formData: formData as any
          }
        });
      } else {
        // Document local - garder le chemin local
        signedPdfAbsolutePath = path.join(
          process.cwd(),
          'public',
          signedPdfPath.startsWith('/') ? signedPdfPath.substring(1) : signedPdfPath
        );

        await prisma.document.update({
          where: { id: signatureRequest.documentId },
          data: {
            status: 'signed',
            signedAt: new Date(),
            signedBy: signerName,
            signedPdfPath: signedPdfPath,
            formData: formData as any
          }
        });
      }

      // ========== ENVOYER LE PDF SIGNÉ PAR EMAIL ==========

      // Email au client
      const clientEmailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Document Signé ✓</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #1e293b;">Bonjour ${signerName},</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Votre signature électronique a été enregistrée avec succès. Vous trouverez en pièce jointe
              le document signé avec toutes les preuves légales d'authenticité.
            </p>
            <div style="background: white; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #059669; font-weight: bold;">✓ Signature Certifiée</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">
                Document: ${signatureRequest.document.fileName}<br>
                Date: ${new Date().toLocaleString('fr-FR')}<br>
                Hash: ${documentHash.substring(0, 16)}...
              </p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
              Cette signature électronique est conforme à la réglementation eIDAS et a la même valeur juridique qu'une signature manuscrite.
            </p>
          </div>
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} ZMR Models Agency - Tous droits réservés
            </p>
          </div>
        </div>
      `;

      const clientEmailText = `
Document Signé ✓

Bonjour ${signerName},

Votre signature électronique a été enregistrée avec succès. Vous trouverez en pièce jointe le document signé.

Document: ${signatureRequest.document.fileName}
Date: ${new Date().toLocaleString('fr-FR')}
Hash: ${documentHash.substring(0, 32)}...

Cette signature électronique est conforme à la réglementation eIDAS.

© ${new Date().getFullYear()} ZMR Models Agency
      `;

      // Envoyer l'email au client
      await sendEmail({
        to: signerEmail,
        subject: `✓ Document Signé: ${signatureRequest.document.fileName}`,
        htmlContent: clientEmailHTML,
        textContent: clientEmailText,
        attachments: [{
          filename: signatureRequest.document.fileName.replace('.pdf', '_SIGNED.pdf'),
          path: signedPdfAbsolutePath
        }],
        documentId: signatureRequest.documentId,
        type: 'document_sent',
        sentBy: 'system'
      });

      console.log('✅ Email envoyé au client:', signerEmail);

      // Email à l'admin (optionnel, récupérer l'email depuis .env)
      const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
      if (adminEmail) {
        const adminEmailHTML = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1e293b; padding: 20px;">
              <h2 style="color: white; margin: 0;">Nouveau Document Signé</h2>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <p><strong>Document:</strong> ${signatureRequest.document.fileName}</p>
              <p><strong>Signé par:</strong> ${signerName} (${signerEmail})</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
              <p><strong>IP:</strong> ${ipAddress}</p>
              <p><strong>Hash SHA-256:</strong> ${documentHash}</p>
              <p style="margin-top: 20px;">Le document signé est disponible en pièce jointe.</p>
            </div>
          </div>
        `;

        await sendEmail({
          to: adminEmail,
          subject: `[Admin] Document signé par ${signerName}`,
          htmlContent: adminEmailHTML,
          textContent: `Document signé: ${signatureRequest.document.fileName}\nPar: ${signerName} (${signerEmail})\nDate: ${new Date().toLocaleString('fr-FR')}`,
          attachments: [{
            filename: signatureRequest.document.fileName.replace('.pdf', '_SIGNED.pdf'),
            path: signedPdfAbsolutePath
          }],
          documentId: signatureRequest.documentId,
          type: 'document_sent',
          sentBy: 'system'
        });

        console.log('✅ Email envoyé à l\'admin:', adminEmail);
      }

    } catch (pdfError) {
      console.error('❌ Erreur lors de la génération du PDF signé:', pdfError);
      // On continue quand même, la signature est déjà enregistrée

      // Mettre à jour le document sans le PDF signé (mais avec formData)
      await prisma.document.update({
        where: { id: signatureRequest.documentId },
        data: {
          status: 'signed',
          signedAt: new Date(),
          signedBy: signerName,
          formData: formData as any // Store client-filled data even if PDF generation fails
        }
      });
    } finally {
      // Nettoyer les fichiers temporaires si c'était un document R2
      if (isR2Document && documentPath && fs.existsSync(documentPath)) {
        try {
          fs.unlinkSync(documentPath);
          console.log('🗑️  Fichier temporaire supprimé:', documentPath);
        } catch (cleanupError) {
          console.warn('Erreur lors du nettoyage du fichier temporaire:', cleanupError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Document signé avec succès',
      signature: {
        id: signature.id,
        timestamp: signature.signedAt,
        documentHash: signature.documentHash
      },
      signedPdfPath: signedPdfPath
    });

  } catch (error) {
    console.error('Error submitting signature:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la signature',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
