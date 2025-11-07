import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generatePDFForm, EditableField } from '@/lib/pdfFormGenerator';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

/**
 * POST /api/admin/templates/[id]/generate-form
 * Generates an interactive PDF Form from a template with editable fields
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { data = {} } = body; // Optional pre-fill data

    // Get template with editable fields configuration
    const template = await prisma.documentTemplate.findUnique({
      where: { id }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Check if template has editable fields configured
    if (!template.editableFields || (template.editableFields as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Ce template n\'a pas de champs éditables configurés. Veuillez d\'abord configurer les champs via l\'interface.' },
        { status: 400 }
      );
    }

    // Check if template has a PDF
    const previewDir = path.join(process.cwd(), 'storage', 'previews');
    const basePdfPath = path.join(previewDir, `${template.slug}-preview.pdf`);

    if (!fs.existsSync(basePdfPath)) {
      return NextResponse.json(
        { error: 'Le PDF de base n\'existe pas. Veuillez d\'abord générer un aperçu via l\'interface de configuration.' },
        { status: 404 }
      );
    }

    // Prepare output path
    const formsDir = path.join(process.cwd(), 'storage', 'forms');
    if (!fs.existsSync(formsDir)) {
      fs.mkdirSync(formsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const outputFileName = `${template.slug}-form-${timestamp}.pdf`;
    const outputPath = path.join(formsDir, outputFileName);

    // Generate the PDF Form
    const formPath = await generatePDFForm({
      basePdfPath,
      editableFields: template.editableFields as EditableField[],
      data,
      outputPath
    });

    // Read the generated PDF Form
    const pdfBuffer = fs.readFileSync(formPath);

    // Return the PDF Form
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${outputFileName}"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF Form:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF Form', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/templates/[id]/generate-form
 * Preview the PDF Form (without data)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Get template
    const template = await prisma.documentTemplate.findUnique({
      where: { id }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Check if template has editable fields configured
    if (!template.editableFields || (template.editableFields as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Ce template n\'a pas de champs éditables configurés.' },
        { status: 400 }
      );
    }

    // Check for cached form
    const formsDir = path.join(process.cwd(), 'storage', 'forms');
    const cachedFormPath = path.join(formsDir, `${template.slug}-form-preview.pdf`);

    // If cached form exists and is less than 1 hour old, serve it
    if (fs.existsSync(cachedFormPath)) {
      const stats = fs.statSync(cachedFormPath);
      const fileAge = Date.now() - stats.mtimeMs;
      const oneHour = 60 * 60 * 1000;

      if (fileAge < oneHour) {
        const pdfBuffer = fs.readFileSync(cachedFormPath);
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${template.slug}-form-preview.pdf"`,
          },
        });
      }
    }

    // Generate new form
    const previewDir = path.join(process.cwd(), 'storage', 'previews');
    const basePdfPath = path.join(previewDir, `${template.slug}-preview.pdf`);

    if (!fs.existsSync(basePdfPath)) {
      return NextResponse.json(
        { error: 'Le PDF de base n\'existe pas.' },
        { status: 404 }
      );
    }

    // Ensure forms directory exists
    if (!fs.existsSync(formsDir)) {
      fs.mkdirSync(formsDir, { recursive: true });
    }

    // Generate the PDF Form
    const formPath = await generatePDFForm({
      basePdfPath,
      editableFields: template.editableFields as EditableField[],
      outputPath: cachedFormPath
    });

    // Read and return the PDF Form
    const pdfBuffer = fs.readFileSync(formPath);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${template.slug}-form-preview.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF Form preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF Form preview', details: (error as Error).message },
      { status: 500 }
    );
  }
}
