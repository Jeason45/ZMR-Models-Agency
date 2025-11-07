/**
 * Document Generator Utility
 * Handles DOCX template filling, PDF conversion, and document numbering
 *
 * NOTE: Migrated from docxtemplater to docx-templates
 * docx-templates automatically handles XML fragmentation issues
 */

import { createReport } from 'docx-templates';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface GenerateDocumentParams {
  templatePath: string;      // Path to DOCX template file
  data: Record<string, any>;  // Variables to fill in template
  outputFileName: string;     // Name for output file (without extension)
  outputDir?: string;         // Optional custom output directory
}

interface GenerateDocumentResult {
  docxPath: string;  // Path to filled DOCX
  pdfPath: string;   // Path to generated PDF
  fileName: string;  // Base filename
}

/**
 * Fill DOCX template with data and generate PDF
 * Uses docx-templates which handles XML fragmentation automatically
 */
export async function generateDocument({
  templatePath,
  data,
  outputFileName,
  outputDir = 'storage/documents'
}: GenerateDocumentParams): Promise<GenerateDocumentResult> {
  try {
    // Ensure output directory exists
    const fullOutputDir = path.join(process.cwd(), outputDir);
    if (!fs.existsSync(fullOutputDir)) {
      fs.mkdirSync(fullOutputDir, { recursive: true });
    }

    // Read template file
    const template = fs.readFileSync(templatePath);

    // Generate filled DOCX using docx-templates
    // This library automatically handles fragmented {{variables}}
    const filledDocx = await createReport({
      template,
      data,
      cmdDelimiter: ['{{', '}}'],
    });

    // Save filled DOCX
    const docxFileName = `${outputFileName}.docx`;
    const docxPath = path.join(fullOutputDir, docxFileName);
    fs.writeFileSync(docxPath, filledDocx);

    console.log(`✅ DOCX generated: ${docxPath}`);

    // Convert DOCX to PDF using LibreOffice (macOS)
    // Note: This requires LibreOffice to be installed
    // On macOS: brew install --cask libreoffice
    const pdfFileName = `${outputFileName}.pdf`;
    const pdfPath = path.join(fullOutputDir, pdfFileName);

    try {
      // Try LibreOffice conversion
      await convertDocxToPdf(docxPath, fullOutputDir);
      console.log(`✅ PDF generated: ${pdfPath}`);
    } catch (error) {
      console.warn('⚠️  PDF conversion failed. DOCX only available.');
      console.warn('Install LibreOffice for PDF conversion: brew install --cask libreoffice');

      // Return with empty PDF path if conversion fails
      return {
        docxPath,
        pdfPath: '', // Empty if conversion failed
        fileName: outputFileName
      };
    }

    return {
      docxPath,
      pdfPath,
      fileName: outputFileName
    };
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error(`Document generation failed: ${error}`);
  }
}

/**
 * Convert DOCX to PDF using LibreOffice
 */
async function convertDocxToPdf(docxPath: string, outputDir: string): Promise<void> {
  // LibreOffice command for conversion
  // --headless: run without GUI
  // --convert-to pdf: convert to PDF format
  // --outdir: output directory
  const command = `/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf --outdir "${outputDir}" "${docxPath}"`;

  try {
    await execAsync(command, { timeout: 30000 }); // 30 second timeout
  } catch (error) {
    throw new Error(`PDF conversion failed: ${error}`);
  }
}

/**
 * Generate unique document number based on type and date
 * Format: PREFIX-YYYY-NNN
 * Examples: FACT-2025-001, CONT-2025-042, DEV-2025-015
 */
export function generateDocumentNumber(
  type: string,
  existingNumbers: string[]
): string {
  const year = new Date().getFullYear();

  // Determine prefix based on document type
  const prefixMap: Record<string, string> = {
    'FACTURE': 'FACT',
    'DEVIS': 'DEV',
    'CONTRAT': 'CONT',
    'ADMINISTRATIF': 'ADMIN',
  };

  const prefix = prefixMap[type] || 'DOC';

  // Find existing numbers for this prefix and year
  const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`);
  const existingNumbersForType = existingNumbers
    .filter(num => pattern.test(num))
    .map(num => {
      const match = num.match(pattern);
      return match ? parseInt(match[1], 10) : 0;
    });

  // Get next number
  const maxNumber = existingNumbersForType.length > 0
    ? Math.max(...existingNumbersForType)
    : 0;

  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');

  return `${prefix}-${year}-${nextNumber}`;
}

/**
 * Format date for French documents
 * Returns: "2 novembre 2025"
 */
export function formatDateFrench(date: Date): string {
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Format currency for French documents
 * Returns: "1 234,56 €"
 */
export function formatCurrencyEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Calculate amounts with French VAT
 */
export function calculateAmountsWithVAT(
  amountHT: number,
  vatRate: number = 0.20
): {
  amountHT: number;
  vat: number;
  amountTTC: number;
} {
  const vat = amountHT * vatRate;
  const amountTTC = amountHT + vat;

  return {
    amountHT: Math.round(amountHT * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    amountTTC: Math.round(amountTTC * 100) / 100
  };
}

/**
 * Validate template variables
 * Check that all required variables are present in data
 */
export function validateTemplateData(
  requiredVariables: string[],
  data: Record<string, any>
): { valid: boolean; missingVariables: string[] } {
  const missingVariables = requiredVariables.filter(
    variable => !(variable in data) || data[variable] === null || data[variable] === undefined
  );

  return {
    valid: missingVariables.length === 0,
    missingVariables
  };
}

/**
 * Clean filename for safe file system usage
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-z0-9_\-\.]/gi, '_')  // Replace special chars with underscore
    .replace(/_{2,}/g, '_')             // Replace multiple underscores with single
    .replace(/^_|_$/g, '');             // Remove leading/trailing underscores
}
