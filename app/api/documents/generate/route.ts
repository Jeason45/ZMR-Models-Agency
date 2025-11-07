import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePDF } from '@/lib/docxGenerator';

// POST /api/documents/generate - Générer un document à partir d'un template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, data, contactId, talentId } = body;

    if (!templateId || !data) {
      return NextResponse.json(
        { error: 'Template ID and data are required' },
        { status: 400 }
      );
    }

    // Récupérer le template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Vérifier les champs requis selon le fieldMapping
    if (!template.requiresSignature) {
      const fieldMapping = (template.fieldMapping as Record<string, any>) || {};
      const missingVars: string[] = [];

      // Vérifier seulement les champs marqués comme required
      Object.entries(fieldMapping).forEach(([fieldName, config]: [string, any]) => {
        if (config.required && (!data[fieldName] || data[fieldName] === '')) {
          missingVars.push(fieldName);
        }
      });

      if (missingVars.length > 0) {
        return NextResponse.json(
          {
            error: 'Missing required variables',
            missingVars
          },
          { status: 400 }
        );
      }
    }

    // Générer un numéro de document unique
    const year = new Date().getFullYear();
    const prefix = template.type === 'FACTURE' ? 'FACT' :
                   template.type === 'DEVIS' ? 'DEV' :
                   template.type === 'CONTRAT' ? 'CONT' : 'DOC';

    const lastDoc = await prisma.document.findFirst({
      where: {
        documentNumber: {
          startsWith: `${prefix}-${year}-`
        }
      },
      orderBy: {
        documentNumber: 'desc'
      }
    });

    let documentNumber;
    if (lastDoc && lastDoc.documentNumber) {
      const lastNumber = parseInt(lastDoc.documentNumber.split('-')[2]);
      documentNumber = `${prefix}-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
    } else {
      documentNumber = `${prefix}-${year}-001`;
    }

    // Créer le nom du fichier (nettoyer tous les caractères invalides)
    const cleanName = template.name
      .replace(/[\/\\:*?"<>|]/g, '_')  // Remplacer caractères invalides
      .replace(/\s+/g, '_')             // Remplacer espaces
      .replace(/_+/g, '_')              // Réduire underscores multiples
      .replace(/^_|_$/g, '');           // Enlever underscores début/fin
    const fileName = `${cleanName}_${documentNumber}.pdf`;

    // Générer le PDF/DOCX physiquement
    let generatedFilePath: string;
    try {
      generatedFilePath = await generatePDF(
        {
          name: template.name,
          type: template.type,
          category: template.category,
          fileName: template.fileName || undefined
        },
        data,
        fileName
      );

      console.log('Document généré avec succès:', generatedFilePath);
    } catch (pdfError) {
      console.error('Erreur lors de la génération du PDF:', pdfError);
      return NextResponse.json(
        {
          error: 'Failed to generate PDF file',
          details: pdfError instanceof Error ? pdfError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Créer l'entrée en base de données avec le vrai filePath généré
    const document = await prisma.document.create({
      data: {
        templateId,
        type: template.type,
        category: template.category,
        fileName: generatedFilePath.split('/').pop() || fileName, // Extraire le nom du fichier du chemin
        filePath: generatedFilePath, // Utiliser le vrai chemin retourné par le générateur
        data: data as any,
        status: 'draft',
        documentNumber,
        contactId: contactId || null,
        talentId: talentId || null,
        issueDate: new Date(),
        generatedBy: 'admin'
      },
      include: {
        template: true,
        contact: true,
        talent: true
      }
    });

    return NextResponse.json({
      success: true,
      document,
      message: 'Document généré avec succès'
    });

  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
