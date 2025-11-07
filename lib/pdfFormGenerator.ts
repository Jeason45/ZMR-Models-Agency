/**
 * PDF Form Generator
 * Converts static PDFs to interactive PDF Forms with editable fields and signature support
 */

import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface EditableField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'number' | 'signature' | 'checkbox';
  required: boolean;
  position: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  defaultValue?: string;
}

export interface GeneratePDFFormParams {
  basePdfPath: string;           // Path to the static PDF (from DOCX conversion)
  editableFields: EditableField[]; // Field configuration from DB
  data?: Record<string, any>;      // Optional pre-fill data
  outputPath: string;              // Where to save the generated PDF Form
}

/**
 * Generate an interactive PDF Form with editable fields
 */
export async function generatePDFForm({
  basePdfPath,
  editableFields,
  data = {},
  outputPath
}: GeneratePDFFormParams): Promise<string> {
  try {
    // Read the base PDF
    const existingPdfBytes = fs.readFileSync(basePdfPath);

    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the form (or create it)
    const form = pdfDoc.getForm();

    // Embed standard font for text fields
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get pages
    const pages = pdfDoc.getPages();

    // Add fields to the PDF
    for (const field of editableFields) {
      const pageIndex = field.position.page - 1; // Convert to 0-based index

      if (pageIndex < 0 || pageIndex >= pages.length) {
        console.warn(`Page ${field.position.page} does not exist. Skipping field: ${field.name}`);
        continue;
      }

      const page = pages[pageIndex];
      const pageHeight = page.getHeight();

      // Convert coordinates (PDF coordinates start from bottom-left)
      const pdfY = pageHeight - field.position.y - field.position.height;

      try {
        if (field.type === 'checkbox') {
          // Add checkbox field
          const checkBox = form.createCheckBox(field.name);
          checkBox.addToPage(page, {
            x: field.position.x,
            y: pdfY,
            width: field.position.width,
            height: field.position.height,
            borderWidth: 1,
            borderColor: rgb(0.39, 0.4, 0.95), // #6366f1
          });

          // Pre-fill if data provided
          if (data[field.name] === true || data[field.name] === 'true') {
            checkBox.check();
          }

        } else if (field.type === 'signature') {
          // Add signature field (text field with special formatting)
          const signatureField = form.createTextField(field.name);
          signatureField.addToPage(page, {
            x: field.position.x,
            y: pdfY,
            width: field.position.width,
            height: field.position.height,
            borderWidth: 2,
            borderColor: rgb(0.95, 0.59, 0.05), // Orange for signature
            backgroundColor: rgb(1, 1, 0.95),
          });

          signatureField.setText(data[field.name] || '');
          signatureField.enableMultiline();
          signatureField.setFontSize(14);

          // Make required fields mandatory
          if (field.required) {
            signatureField.enableRequired();
          }

        } else {
          // Add text field (default for text, email, date, number)
          const textField = form.createTextField(field.name);
          textField.addToPage(page, {
            x: field.position.x,
            y: pdfY,
            width: field.position.width,
            height: field.position.height,
            borderWidth: 1,
            borderColor: rgb(0.39, 0.4, 0.95), // #6366f1
            backgroundColor: rgb(1, 1, 1),
          });

          // Configure based on type
          if (field.type === 'email') {
            textField.setFontSize(10);
          } else if (field.type === 'date') {
            textField.setFontSize(10);
            textField.setText(data[field.name] || field.defaultValue || '');
          } else if (field.type === 'number') {
            textField.setFontSize(11);
            textField.setText(data[field.name]?.toString() || field.defaultValue || '');
          } else {
            // Regular text field
            textField.setFontSize(11);
            textField.setText(data[field.name] || field.defaultValue || '');
          }

          // Make required fields mandatory
          if (field.required) {
            textField.enableRequired();
          }
        }
      } catch (fieldError) {
        console.error(`Error adding field ${field.name}:`, fieldError);
        // Continue with other fields
      }
    }

    // Update field appearances
    form.updateFieldAppearances(font);

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(outputPath, pdfBytes);

    console.log(`✅ PDF Form generated: ${outputPath}`);
    console.log(`   Fields: ${editableFields.length}`);
    console.log(`   Size: ${Math.round(pdfBytes.length / 1024)}KB`);

    return outputPath;

  } catch (error) {
    console.error('Error generating PDF Form:', error);
    throw new Error(`PDF Form generation failed: ${error}`);
  }
}

/**
 * Fill an existing PDF Form with data
 */
export async function fillPDFForm(
  formPdfPath: string,
  data: Record<string, any>,
  outputPath: string
): Promise<string> {
  try {
    // Read the PDF Form
    const formPdfBytes = fs.readFileSync(formPdfPath);

    // Load the PDF
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // Get the form
    const form = pdfDoc.getForm();

    // Fill fields
    for (const [fieldName, value] of Object.entries(data)) {
      try {
        const field = form.getField(fieldName);

        if (field instanceof PDFTextField) {
          field.setText(value?.toString() || '');
        } else if (field instanceof PDFCheckBox) {
          if (value === true || value === 'true') {
            field.check();
          } else {
            field.uncheck();
          }
        }
      } catch (fieldError) {
        console.warn(`Field ${fieldName} not found or error filling:`, fieldError);
      }
    }

    // Flatten the form (make it non-editable after filling)
    // Comment this line if you want the PDF to remain editable
    // form.flatten();

    // Save the filled PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    console.log(`✅ PDF Form filled: ${outputPath}`);

    return outputPath;

  } catch (error) {
    console.error('Error filling PDF Form:', error);
    throw new Error(`PDF Form filling failed: ${error}`);
  }
}

/**
 * Extract data from a filled PDF Form
 */
export async function extractPDFFormData(formPdfPath: string): Promise<Record<string, any>> {
  try {
    const formPdfBytes = fs.readFileSync(formPdfPath);
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    const data: Record<string, any> = {};
    const fields = form.getFields();

    for (const field of fields) {
      const fieldName = field.getName();

      if (field instanceof PDFTextField) {
        data[fieldName] = field.getText() || '';
      } else if (field instanceof PDFCheckBox) {
        data[fieldName] = field.isChecked();
      }
    }

    return data;

  } catch (error) {
    console.error('Error extracting PDF Form data:', error);
    throw new Error(`PDF Form data extraction failed: ${error}`);
  }
}
