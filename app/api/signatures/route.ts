import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import {
  generateFileHash,
  createSignatureProofData,
  saveSignatureImage,
  getClientIP,
  getUserAgent
} from '@/lib/signatureUtils';
import {
  sendEmail,
  generateSignatureCompletedAdminEmailHTML
} from '@/lib/emailUtils';

const prisma = new PrismaClient();

// GET /api/signatures?documentId=xxx - Get all signatures for a document
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const signatureId = searchParams.get('id');

    if (signatureId) {
      // Get single signature
      const signature = await prisma.signature.findUnique({
        where: { id: signatureId },
        include: {
          document: true
        }
      });

      if (!signature) {
        return NextResponse.json(
          { error: 'Signature not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(signature);
    }

    if (documentId) {
      // Get all signatures for a document
      const signatures = await prisma.signature.findMany({
        where: { documentId },
        orderBy: { signedAt: 'desc' }
      });

      return NextResponse.json(signatures);
    }

    // Get all signatures
    const signatures = await prisma.signature.findMany({
      orderBy: { signedAt: 'desc' },
      take: 100
    });

    return NextResponse.json(signatures);

  } catch (error) {
    console.error('Error fetching signatures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signatures' },
      { status: 500 }
    );
  }
}

// POST /api/signatures - Create a new signature
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      documentId,
      signerName,
      signerEmail,
      signerRole,
      signatureImage,  // Base64 encoded image
      signatureType,
      location
    } = body;

    // Validation
    if (!documentId || !signerName || !signerEmail || !signatureImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Get client IP and user agent
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    // Generate hash of the document file
    const documentPath = path.join(process.cwd(), document.filePath);
    let documentHash: string;

    try {
      documentHash = generateFileHash(documentPath);
    } catch (error) {
      console.error('Error generating document hash:', error);
      return NextResponse.json(
        { error: 'Failed to hash document file' },
        { status: 500 }
      );
    }

    // Save signature image
    const signatureImagePath = saveSignatureImage(
      signatureImage,
      documentId,
      signerEmail
    );

    // Create signature proof
    const signedAt = new Date();
    const proof = createSignatureProofData({
      documentId,
      documentHash,
      signerName,
      signerEmail,
      signerRole: signerRole || 'signer',
      signatureType: signatureType || 'electronic',
      signedAt,
      ipAddress,
      userAgent,
      location
    });

    // Save signature to database
    const signature = await prisma.signature.create({
      data: {
        documentId,
        signerName,
        signerEmail,
        signerRole: signerRole || 'signer',
        signatureImage: signatureImagePath,
        signatureType: signatureType || 'electronic',
        signedAt,
        ipAddress,
        userAgent,
        location,
        documentHash,
        proofData: proof as any,
        isValid: true
      }
    });

    // Update document status to 'signed'
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'signed',
        signedAt,
        signedBy: signerName,
        signatureImage: signatureImagePath
      }
    });

    // Save proof as JSON file for legal backup
    const fs = require('fs');
    const proofDir = path.join(process.cwd(), 'storage', 'proofs');
    if (!fs.existsSync(proofDir)) {
      fs.mkdirSync(proofDir, { recursive: true });
    }

    const proofFilePath = path.join(
      proofDir,
      `proof_${documentId}_${signature.id}.json`
    );

    fs.writeFileSync(
      proofFilePath,
      JSON.stringify(proof, null, 2),
      'utf-8'
    );

    // EMAIL AUTOMATIQUE : Notification admin de signature complétée
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `✅ Document signé: ${document.fileName}`,
          htmlContent: generateSignatureCompletedAdminEmailHTML({
            documentName: document.fileName,
            signerName,
            signerEmail,
            signedAt,
            documentId
          }),
          textContent: `Un document vient d'être signé électroniquement:\n\nDocument: ${document.fileName}\nSigné par: ${signerName} (${signerEmail})\nDate: ${signedAt.toLocaleString('fr-FR')}\n\nLe document est disponible dans le CRM.`,
          type: 'custom',
          documentId,
          sentBy: 'System'
        });

        console.log('✅ Email de notification de signature envoyé à l\'admin');
      } catch (error) {
        console.error('❌ Erreur envoi email admin signature:', error);
        // Ne pas bloquer la signature si l'email échoue
      }
    }

    return NextResponse.json({
      success: true,
      signature,
      proof,
      proofFile: proofFilePath
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating signature:', error);
    return NextResponse.json(
      {
        error: 'Failed to create signature',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
