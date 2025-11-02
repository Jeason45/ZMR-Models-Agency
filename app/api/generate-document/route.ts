import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import {
  generateDocument,
  generateDocumentNumber,
  validateTemplateData,
  sanitizeFileName,
  formatDateFrench,
  formatCurrencyEuro,
  calculateAmountsWithVAT
} from '@/lib/documentGenerator';

const prisma = new PrismaClient();

// POST /api/generate-document
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      templateId,        // ID du template à utiliser
      data,              // Données à remplir dans le template
      talentId,          // ID du talent (optionnel)
      contactId,         // ID du contact (optionnel)
      category,          // Catégorie du document
      amountHT,          // Montant HT (pour factures/devis)
      issueDate,         // Date d'émission
      dueDate,           // Date d'échéance
      expiresAt,         // Date d'expiration
      notes,             // Notes
      generatedBy        // Qui a généré le document
    } = body;

    // Validation
    if (!templateId || !data) {
      return NextResponse.json(
        { error: 'Missing templateId or data' },
        { status: 400 }
      );
    }

    // Fetch template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    if (!template.isActive) {
      return NextResponse.json(
        { error: 'Template is not active' },
        { status: 400 }
      );
    }

    // Validate required variables
    const requiredVariables = (template.variables as string[]) || [];
    const validation = validateTemplateData(requiredVariables, data);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Missing required variables',
          missingVariables: validation.missingVariables
        },
        { status: 400 }
      );
    }

    // Generate document number
    const existingDocuments = await prisma.document.findMany({
      where: { documentNumber: { not: null } },
      select: { documentNumber: true }
    });

    const existingNumbers = existingDocuments
      .map(doc => doc.documentNumber)
      .filter((num): num is string => num !== null);

    const documentNumber = generateDocumentNumber(template.type, existingNumbers);

    // Prepare enhanced data with helpers
    const enhancedData = {
      ...data,
      document_number: documentNumber,
      date_aujourdhui: formatDateFrench(new Date()),
      ...(amountHT && {
        montant_ht_formatte: formatCurrencyEuro(amountHT),
        ...calculateAmountsWithVAT(amountHT)
      })
    };

    // Generate file name
    const baseFileName = `${template.slug}_${documentNumber}_${Date.now()}`;
    const safeFileName = sanitizeFileName(baseFileName);

    // Get template file path
    const templatePath = path.join(process.cwd(), template.filePath);

    // Generate document
    const result = await generateDocument({
      templatePath,
      data: enhancedData,
      outputFileName: safeFileName,
      outputDir: 'storage/documents'
    });

    // Calculate amounts if provided
    let calculatedAmountTTC = null;
    if (amountHT) {
      const amounts = calculateAmountsWithVAT(amountHT);
      calculatedAmountTTC = amounts.amountTTC;
    }

    // Save document record to database
    const document = await prisma.document.create({
      data: {
        templateId,
        type: template.type,
        category: category || template.category,
        fileName: result.fileName,
        filePath: result.pdfPath || result.docxPath,
        originalDocx: result.docxPath,
        data: enhancedData,
        status: 'draft',
        documentNumber,
        talentId: talentId || null,
        contactId: contactId || null,
        amountHT: amountHT || null,
        amountTTC: calculatedAmountTTC,
        currency: 'EUR',
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        generatedBy: generatedBy || null,
        notes: notes || null
      },
      include: {
        template: true,
        talent: true,
        contact: true
      }
    });

    return NextResponse.json({
      success: true,
      document,
      files: {
        docx: result.docxPath,
        pdf: result.pdfPath || null
      }
    }, { status: 201 });

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
