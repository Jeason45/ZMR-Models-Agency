import Mustache from 'mustache';
import fs from 'fs';
import path from 'path';
import { uploadToR2 } from './r2Storage';

/**
 * Génère un PDF à partir d'un template HTML Mustache et l'upload sur R2
 */
export async function generatePDFFromTemplate(params: {
  templateSlug: string;
  data: Record<string, any>;
  fileName: string;
}): Promise<{ success: boolean; url?: string; error?: string }> {
  const { templateSlug, data, fileName } = params;

  try {
    // Charger le template HTML
    const templatesDir = path.join(process.cwd(), 'templates', 'documents');
    const templatePath = path.join(templatesDir, `${templateSlug}.html`);

    if (!fs.existsSync(templatePath)) {
      return {
        success: false,
        error: `Template HTML not found: ${templateSlug}.html`
      };
    }

    const htmlContent = fs.readFileSync(templatePath, 'utf-8');

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
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
      });

      await browser.close();

      console.log('✅ PDF généré avec Puppeteer, taille:', pdfBuffer.length, 'bytes');

      // Upload vers R2
      const r2Key = `documents/${fileName}`;
      const uploadResult = await uploadToR2(
        Buffer.from(pdfBuffer),
        r2Key,
        'application/pdf'
      );

      if (!uploadResult.success) {
        return {
          success: false,
          error: `Failed to upload to R2: ${uploadResult.error}`
        };
      }

      console.log('✅ PDF uploadé sur R2:', uploadResult.url);

      return {
        success: true,
        url: uploadResult.url
      };

    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      if (browser) {
        await browser.close();
      }
      throw error;
    }

  } catch (error) {
    console.error('❌ Erreur dans generatePDFFromTemplate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
