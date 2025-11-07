import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateDocument } from '@/lib/documentGenerator';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

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

    // Check if preview PDF already exists
    const previewDir = path.join(process.cwd(), 'storage', 'previews');
    const previewFileName = `${template.slug}-preview.pdf`;
    const previewPath = path.join(previewDir, previewFileName);

    // If preview exists and is recent (less than 1 hour old), serve it
    if (fs.existsSync(previewPath)) {
      const stats = fs.statSync(previewPath);
      const fileAge = Date.now() - stats.mtimeMs;
      const oneHour = 60 * 60 * 1000;

      if (fileAge < oneHour) {
        const pdfBuffer = fs.readFileSync(previewPath);
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${previewFileName}"`,
          },
        });
      }
    }

    // Generate sample data for template variables
    const variables = (template.variables as string[]) || [];
    const sampleData: Record<string, string> = {};

    for (const variable of variables) {
      // Generate sample data based on variable name
      if (variable.toLowerCase().includes('nom') || variable.toLowerCase().includes('name')) {
        sampleData[variable] = '[NOM]';
      } else if (variable.toLowerCase().includes('prenom') || variable.toLowerCase().includes('firstname')) {
        sampleData[variable] = '[PRENOM]';
      } else if (variable.toLowerCase().includes('date')) {
        sampleData[variable] = '[DATE]';
      } else if (variable.toLowerCase().includes('adresse') || variable.toLowerCase().includes('address')) {
        sampleData[variable] = '[ADRESSE]';
      } else if (variable.toLowerCase().includes('email')) {
        sampleData[variable] = '[EMAIL]';
      } else if (variable.toLowerCase().includes('tel') || variable.toLowerCase().includes('phone')) {
        sampleData[variable] = '[TELEPHONE]';
      } else if (variable.toLowerCase().includes('montant') || variable.toLowerCase().includes('amount') || variable.toLowerCase().includes('tarif')) {
        sampleData[variable] = '[MONTANT]';
      } else {
        sampleData[variable] = `[${variable.toUpperCase()}]`;
      }
    }

    // Check if template has file path
    if (!template.filePath || template.filePath.trim() === '') {
      return NextResponse.json(
        { error: 'Ce template n\'a pas de fichier DOCX associé. Veuillez d\'abord uploader le fichier template.' },
        { status: 400 }
      );
    }

    // Generate preview PDF
    const templatePath = path.join(process.cwd(), template.filePath);

    // Check if file exists
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: `Le fichier template n'existe pas: ${template.filePath}` },
        { status: 404 }
      );
    }

    // Ensure preview directory exists
    if (!fs.existsSync(previewDir)) {
      fs.mkdirSync(previewDir, { recursive: true });
    }

    const { pdfPath } = await generateDocument({
      templatePath,
      data: sampleData,
      outputFileName: `${template.slug}-preview`,
      outputDir: 'storage/previews'
    });

    // Read the generated PDF
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${previewFileName}"`,
      },
    });

  } catch (error) {
    console.error('Error generating template preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview', details: (error as Error).message },
      { status: 500 }
    );
  }
}
