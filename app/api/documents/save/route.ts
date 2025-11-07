import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToR2 } from '@/lib/r2Storage';

/**
 * POST /api/documents/save
 *
 * Sauvegarde un document PDF généré en base de données et en stockage
 *
 * Body:
 * - pdfBuffer: Buffer du PDF (base64)
 * - fileName: Nom du fichier
 * - type: Type de document (DEVIS, FACTURE, CONTRAT)
 * - templateId: ID du template utilisé
 * - contactId: ID du contact (optionnel)
 * - documentNumber: Numéro du document (ex: DEV-2025-001)
 * - data: Données du document (JSON)
 * - amountHT: Montant HT (optionnel)
 * - amountTTC: Montant TTC (optionnel)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pdfBase64,
      fileName,
      type,
      templateId,
      contactId,
      documentNumber,
      data,
      amountHT,
      amountTTC
    } = body;

    // Validation
    if (!pdfBase64 || !fileName || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: pdfBase64, fileName, type' },
        { status: 400 }
      );
    }

    // Convertir base64 en Buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const uniqueFileName = `${fileName.replace('.pdf', '')}-${timestamp}.pdf`;

    // Uploader vers R2 dans le dossier "documents/"
    const r2Key = `documents/${uniqueFileName}`;
    const uploadResult = await uploadToR2(pdfBuffer, r2Key, 'application/pdf');

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: 'Failed to upload document to R2', details: uploadResult.error },
        { status: 500 }
      );
    }

    // L'URL publique du fichier sur R2
    const r2Url = uploadResult.url!;

    // Déterminer la catégorie selon le type
    const categoryMap: Record<string, string> = {
      'DEVIS': 'commercial',
      'FACTURE': 'commercial',
      'CONTRAT': 'juridique',
      'ADMINISTRATIF': 'admin'
    };
    const category = categoryMap[type] || 'commercial';

    // Créer l'entrée en base de données
    const document = await prisma.document.create({
      data: {
        fileName: uniqueFileName,
        filePath: r2Url, // URL R2 complète
        type,
        category,
        templateId: templateId || undefined,
        contactId: contactId || undefined,
        documentNumber: documentNumber || undefined,
        data: data || undefined,
        amountHT: amountHT ? parseFloat(amountHT) : undefined,
        amountTTC: amountTTC ? parseFloat(amountTTC) : undefined,
        status: 'draft',
        issueDate: new Date()
      },
      include: {
        template: true,
        contact: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        filePath: document.filePath,
        type: document.type,
        documentNumber: document.documentNumber,
        status: document.status,
        createdAt: document.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving document:', error);
    return NextResponse.json(
      { error: 'Failed to save document', details: (error as Error).message },
      { status: 500 }
    );
  }
}
