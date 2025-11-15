import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePDF } from '@/lib/pdfGenerator';

export const maxDuration = 60; // 60 secondes pour Puppeteer

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateName, data } = body;

    console.log('🚀 [PDF] Starting PDF generation...');
    console.log('📝 [PDF] Template:', templateName);

    if (!templateName) {
      return NextResponse.json(
        { error: 'templateName is required' },
        { status: 400 }
      );
    }

    // Charger le template depuis la base de données
    console.log('📄 [PDF] Loading template from database...');
    const template = await prisma.documentTemplate.findFirst({
      where: {
        slug: templateName,
        isActive: true
      }
    });

    if (!template) {
      console.error('❌ [PDF] Template not found:', templateName);
      return NextResponse.json(
        { error: `Template "${templateName}" not found` },
        { status: 404 }
      );
    }

    if (!template.htmlContent) {
      console.error('❌ [PDF] Template has no HTML content');
      return NextResponse.json(
        { error: 'Template has no HTML content' },
        { status: 400 }
      );
    }

    console.log('✅ [PDF] Template loaded from database');

    // Générer le PDF avec le nouveau système optimisé Vercel
    console.log('🖨️  [PDF] Generating PDF with pdfGenerator...');
    const pdfBuffer = await generatePDF({
      htmlContent: template.htmlContent,
      data
    });

    console.log('✅ [PDF] PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${templateName}-${Date.now()}.pdf"`
      }
    });

  } catch (error: any) {
    console.error('❌❌❌ [PDF] CRITICAL ERROR:', error);
    console.error('❌ [PDF] Error stack:', error.stack);
    console.error('❌ [PDF] Error message:', error.message);

    return NextResponse.json(
      {
        error: 'Error generating PDF',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
