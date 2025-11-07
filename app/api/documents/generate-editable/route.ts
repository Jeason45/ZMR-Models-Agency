import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePDF } from '@/lib/docxGenerator';
import { generatePDFForm, fillPDFForm } from '@/lib/pdfFormGenerator';
import DocumentDataMapper from '@/lib/documentDataMapper';
import { getFieldPositionsForType } from '@/lib/pdfFieldPositions';
import path from 'path';
import fs from 'fs';

/**
 * POST /api/documents/generate-editable
 * Génère un PDF éditable avec des champs de formulaire
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, contactId, talentId, data: additionalData } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
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

    // Utiliser DocumentDataMapper pour obtenir les données pré-remplies
    const mapper = new DocumentDataMapper();
    const mappedResult = await mapper.populateFields(templateId, contactId, talentId);

    // Fusionner avec les données additionnelles
    const finalData = {
      ...mappedResult.data,
      ...additionalData
    };

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${template.slug}_${timestamp}`;

    // D'abord, générer le PDF statique depuis le template DOCX
    const staticPdfPath = await generatePDF(
      {
        name: template.name,
        type: template.type,
        category: template.category,
        fileName: template.fileName || undefined
      },
      finalData,
      `${fileName}.pdf`
    );

    // Chemin complet du PDF statique
    const fullStaticPdfPath = path.join(process.cwd(), 'public', staticPdfPath);

    // Préparer les champs éditables avec positions précises
    let editableFields = [];

    if (template.editableFields) {
      // Si le template a des champs éditables définis, mettre à jour leurs positions
      const existingFields = template.editableFields as any[];
      const positions = getFieldPositionsForType(template.type);

      editableFields = existingFields.map(field => {
        // Utiliser la position précise si elle existe
        if (positions[field.name]) {
          return {
            ...field,
            position: positions[field.name]
          };
        }
        return field;
      });
    } else {
      // Sinon, créer des champs basés sur le mapping avec les bonnes positions
      editableFields = createEditableFieldsFromMapping(mappedResult.mapping, template.type);
    }

    // Générer le PDF éditable
    const editablePdfPath = path.join(
      process.cwd(),
      'public',
      'storage',
      'documents',
      'editable',
      `${fileName}_editable.pdf`
    );

    await generatePDFForm({
      basePdfPath: fullStaticPdfPath,
      editableFields,
      data: finalData,
      outputPath: editablePdfPath
    });

    // Supprimer le PDF statique temporaire
    fs.unlinkSync(fullStaticPdfPath);

    // Créer l'enregistrement en base de données
    const document = await prisma.document.create({
      data: {
        templateId,
        type: template.type,
        category: template.category,
        fileName: `${fileName}_editable.pdf`,
        filePath: `/storage/documents/editable/${fileName}_editable.pdf`,
        status: 'draft',
        data: finalData,
        contactId,
        talentId,
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
      editableFields,
      pdfUrl: `/storage/documents/editable/${fileName}_editable.pdf`
    });

  } catch (error) {
    console.error('Error generating editable PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate editable PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/documents/generate-editable
 * Mettre à jour un PDF éditable avec de nouvelles données
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, data } = body;

    if (!documentId || !data) {
      return NextResponse.json(
        { error: 'Document ID and data are required' },
        { status: 400 }
      );
    }

    // Récupérer le document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { template: true }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Chemin du PDF éditable existant
    const existingPdfPath = path.join(process.cwd(), 'public', document.filePath);

    // Générer un nouveau nom pour la version mise à jour
    const timestamp = Date.now();
    const updatedFileName = `${document.template?.slug}_${timestamp}_updated.pdf`;
    const updatedPdfPath = path.join(
      process.cwd(),
      'public',
      'storage',
      'documents',
      'editable',
      updatedFileName
    );

    // Remplir le PDF avec les nouvelles données
    await fillPDFForm(existingPdfPath, data, updatedPdfPath);

    // Mettre à jour l'enregistrement en base
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        fileName: updatedFileName,
        filePath: `/storage/documents/editable/${updatedFileName}`,
        data: { ...document.data as object, ...data },
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      pdfUrl: `/storage/documents/editable/${updatedFileName}`
    });

  } catch (error) {
    console.error('Error updating editable PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to update editable PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Créer des champs éditables à partir du mapping avec positions précises
 */
function createEditableFieldsFromMapping(
  mapping: Record<string, any>,
  templateType: string
): any[] {
  const fields = [];

  // Récupérer les positions précises pour ce type de document
  const positions = getFieldPositionsForType(templateType);

  // Position de fallback si aucune position n'est définie
  let fallbackYPosition = 200;
  const lineHeight = 30;

  Object.entries(mapping).forEach(([fieldName, config]) => {
    // Ne pas créer de champs pour les éléments auto-calculés
    if (config.source === 'calculated' || config.autoFill) {
      return;
    }

    // Déterminer le type de champ
    let fieldType = 'text';
    if (config.type === 'email') fieldType = 'email';
    else if (config.type === 'date') fieldType = 'date';
    else if (config.type === 'number') fieldType = 'number';
    else if (fieldName.includes('signature')) fieldType = 'signature';

    // Utiliser la position précise si elle existe, sinon fallback
    const position = positions[fieldName] || {
      page: 1,
      x: 100,
      y: fallbackYPosition,
      width: 400,
      height: 25
    };

    // Si on utilise la position fallback, incrémenter pour le prochain champ
    if (!positions[fieldName]) {
      console.warn(`Pas de position définie pour le champ: ${fieldName}, utilisation position par défaut`);
      fallbackYPosition += lineHeight;
    }

    fields.push({
      name: fieldName,
      label: config.label || fieldName.replace(/_/g, ' '),
      type: fieldType,
      required: config.required || false,
      position: position
    });
  });

  // Ajouter les champs de signature s'ils ne sont pas déjà présents et qu'on a leurs positions
  if (templateType === 'CONTRAT') {
    if (!fields.find(f => f.name === 'signature_client') && positions['signature_client']) {
      fields.push({
        name: 'signature_client',
        label: 'Signature du client',
        type: 'signature',
        required: true,
        position: positions['signature_client']
      });
    }

    if (!fields.find(f => f.name === 'signature_talent') && positions['signature_talent']) {
      fields.push({
        name: 'signature_talent',
        label: 'Signature du talent',
        type: 'signature',
        required: true,
        position: positions['signature_talent']
      });
    }
  }

  return fields;
}

/**
 * GET /api/documents/generate-editable/extract
 * Extraire les données d'un PDF éditable
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Récupérer le document
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Extraire les données du PDF
    const { extractPDFFormData } = await import('@/lib/pdfFormGenerator');
    const pdfPath = path.join(process.cwd(), 'public', document.filePath);
    const extractedData = await extractPDFFormData(pdfPath);

    return NextResponse.json({
      success: true,
      data: extractedData,
      documentId
    });

  } catch (error) {
    console.error('Error extracting PDF data:', error);
    return NextResponse.json(
      {
        error: 'Failed to extract PDF data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}