import Mustache from 'mustache';
import fs from 'fs';
import path from 'path';

/**
 * Génère un PDF à partir d'un template HTML et des données
 */
export async function generatePDF(params: {
  htmlContent: string;
  data: Record<string, any>;
  outputPath?: string;
}): Promise<Buffer> {
  const { htmlContent, data, outputPath } = params;

  // Rendre le HTML avec Mustache
  const renderedHTML = Mustache.render(htmlContent, data);

  // Déterminer si on est en production (Vercel) ou en développement
  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

  let browser;
  try {
    if (isProduction) {
      // Production: Utiliser Chromium de Sparticuz pour serverless
      const puppeteerCore = (await import('puppeteer-core')).default;
      const chromium = (await import('@sparticuz/chromium')).default;

      browser = await puppeteerCore.launch({
        args: [
          ...chromium.args,
          '--disable-gpu',
          '--single-process',
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // Développement: Utiliser Puppeteer local
      const puppeteer = (await import('puppeteer')).default;

      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();

    // Charger le HTML rendu
    await page.setContent(renderedHTML, {
      waitUntil: 'networkidle0',
    });

    // Générer le PDF en Buffer
    const pdfData = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });

    // Convertir en Buffer si nécessaire (Puppeteer peut retourner Uint8Array ou Buffer)
    const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);

    // Si un outputPath est fourni, sauvegarder sur le disque
    if (outputPath) {
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, pdfBuffer);
      console.log(`✅ PDF généré: ${outputPath}`);
    }

    return pdfBuffer;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Charge un template HTML depuis le système de fichiers
 */
export function loadHTMLTemplate(templateSlug: string): string {
  const templatesDir = path.join(process.cwd(), 'templates', 'documents');
  const templatePath = path.join(templatesDir, `${templateSlug}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template HTML not found: ${templateSlug}.html`);
  }

  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Prévisualise un HTML rendu (sans générer de PDF)
 */
export function previewHTML(htmlContent: string, data: Record<string, any>): string {
  return Mustache.render(htmlContent, data);
}

/**
 * Génère un nom de fichier unique pour un document
 */
export function generateDocumentFileName(params: {
  templateName: string;
  contactName?: string;
  documentNumber?: string;
  date?: Date;
}): string {
  const { templateName, contactName, documentNumber, date } = params;

  const parts: string[] = [];

  // Nom du template (nettoyé)
  parts.push(templateName.replace(/[^a-zA-Z0-9]/g, '_'));

  // Nom du contact (si fourni)
  if (contactName) {
    parts.push(contactName.replace(/[^a-zA-Z0-9]/g, '_'));
  }

  // Numéro de document (si fourni)
  if (documentNumber) {
    parts.push(documentNumber);
  } else {
    // Date (si pas de numéro)
    const dateStr = (date || new Date()).toISOString().split('T')[0];
    parts.push(dateStr);
  }

  return `${parts.join('_')}.pdf`;
}

/**
 * Sauvegarde un document dans le stockage
 */
export function saveDocument(
  pdfBuffer: Buffer,
  fileName: string
): string {
  const storageDir = path.join(process.cwd(), 'public', 'storage', 'documents');

  // Créer le répertoire si nécessaire
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const filePath = path.join(storageDir, fileName);

  // Sauvegarder le fichier
  fs.writeFileSync(filePath, pdfBuffer);

  // Retourner le chemin relatif
  return `/storage/documents/${fileName}`;
}
