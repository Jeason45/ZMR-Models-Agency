import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
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
    const body: GeneratePdfRequest = await request.json();
    const { templateName, data, options = {} } = body;

    // Valider les données
    if (!templateName || !data) {
      return NextResponse.json(
        { error: 'templateName et data sont requis' },
        { status: 400 }
      );
    }

    // Charger le template HTML
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'documents',
      `${templateName}.html`
    );

    let templateHtml: string;
    try {
      templateHtml = await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      return NextResponse.json(
        { error: `Template "${templateName}" non trouvé` },
        { status: 404 }
      );
    }

    // Injecter les données avec Mustache
    const html = Mustache.render(templateHtml, data);

    // Configuration Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Charger le HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

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
    const pdfBuffer = await page.pdf(pdfOptions);

    await browser.close();

    // Retourner le PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${templateName}-${Date.now()}.pdf"`
      }
    });

  } catch (error: any) {
    console.error('Erreur génération PDF:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la génération du PDF',
        details: error.message
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
