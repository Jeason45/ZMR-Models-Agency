import { NextRequest, NextResponse } from 'next/server';
import Mustache from 'mustache';
import fs from 'fs/promises';
import path from 'path';

export const maxDuration = 60; // 60 secondes pour Puppeteer

interface GeneratePdfRequest {
  templateName: string; // ex: 'devis-moderne', 'facture-professionnelle'
  data: Record<string, any>; // Les données à injecter
  options?: {
    format?: 'A4' | 'Letter';
    landscape?: boolean;
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [PDF] Starting PDF generation...');
    const body: GeneratePdfRequest = await request.json();
    const { templateName, data, options = {} } = body;
    console.log('📝 [PDF] Template:', templateName);

    // Valider les données
    if (!templateName || !data) {
      console.error('❌ [PDF] Missing required fields');
      return NextResponse.json(
        { error: 'templateName et data sont requis' },
        { status: 400 }
      );
    }

    // Charger le template HTML
    console.log('📄 [PDF] Loading template...');
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'documents',
      `${templateName}.html`
    );

    let templateHtml: string;
    try {
      templateHtml = await fs.readFile(templatePath, 'utf-8');
      console.log('✅ [PDF] Template loaded successfully');
    } catch (error) {
      console.error('❌ [PDF] Template not found:', templatePath);
      return NextResponse.json(
        { error: `Template "${templateName}" non trouvé` },
        { status: 404 }
      );
    }

    // Injecter les données avec Mustache
    console.log('🔧 [PDF] Rendering template with Mustache...');
    const html = Mustache.render(templateHtml, data);
    console.log('✅ [PDF] Template rendered');

    // Configuration Puppeteer pour Vercel (serverless)
    console.log('🌐 [PDF] Launching browser...');

    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

    // Import dynamique selon l'environnement
    let browser;
    if (isProduction) {
      const puppeteerCore = (await import('puppeteer-core')).default;
      const chromium = (await import('@sparticuz/chromium')).default;

      // Configuration optimisée pour Vercel
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = (await import('puppeteer')).default;
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    console.log('✅ [PDF] Browser launched');

    const page = await browser.newPage();
    console.log('✅ [PDF] New page created');

    // Charger le HTML
    console.log('📝 [PDF] Setting page content...');
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    console.log('✅ [PDF] Content loaded');

    // Options de génération PDF
    const pdfOptions: any = {
      format: options.format || 'A4',
      landscape: options.landscape || false,
      printBackground: true,
      margin: options.margin || {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    };

    // Générer le PDF
    console.log('🖨️  [PDF] Generating PDF...');
    const pdfBuffer = await page.pdf(pdfOptions);
    console.log('✅ [PDF] PDF generated, size:', pdfBuffer.length, 'bytes');

    await browser.close();
    console.log('✅ [PDF] Browser closed');

    // Retourner le PDF
    console.log('📤 [PDF] Sending PDF response');
    return new NextResponse(Buffer.from(pdfBuffer), {
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
    console.error('❌ [PDF] Error name:', error.name);
    return NextResponse.json(
      {
        error: 'Erreur lors de la génération du PDF',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Endpoint GET pour lister les templates disponibles
export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'templates', 'documents');
    const files = await fs.readdir(templatesDir);

    const templates = files
      .filter(file => file.endsWith('.html'))
      .map(file => ({
        name: file.replace('.html', ''),
        filename: file
      }));

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des templates',
        details: error.message
      },
      { status: 500 }
    );
  }
}
