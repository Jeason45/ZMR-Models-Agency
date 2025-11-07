import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { getFieldPositionsForType } from '@/lib/pdfFieldPositions';

/**
 * API pour générer un aperçu visuel des positions des champs sur un PDF
 * Dessine des rectangles et labels pour visualiser où chaque champ sera placé
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentType = 'DEVIS', positions, showLabels = true, showGrid = true } = body;

    // Utiliser les positions fournies ou celles par défaut
    const fieldPositions = positions || getFieldPositionsForType(documentType);

    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();

    // Ajouter une page A4
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();

    // Embed fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Dessiner la grille si demandé
    if (showGrid) {
      const gridSize = 20;

      // Lignes verticales
      for (let x = 0; x <= width; x += gridSize) {
        page.drawLine({
          start: { x, y: 0 },
          end: { x, y: height },
          thickness: 0.5,
          color: rgb(0.9, 0.9, 0.9),
          opacity: 0.5
        });
      }

      // Lignes horizontales
      for (let y = 0; y <= height; y += gridSize) {
        page.drawLine({
          start: { x: 0, y },
          end: { x: width, y },
          thickness: 0.5,
          color: rgb(0.9, 0.9, 0.9),
          opacity: 0.5
        });
      }

      // Axes principaux
      page.drawLine({
        start: { x: width / 2, y: 0 },
        end: { x: width / 2, y: height },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3
      });

      page.drawLine({
        start: { x: 0, y: height / 2 },
        end: { x: width, y: height / 2 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3
      });
    }

    // Dessiner les zones principales
    const zones = [
      { name: 'EN-TÊTE', x: 30, y: height - 150, w: width - 60, h: 120, color: rgb(0.2, 0.3, 0.9) },
      { name: 'CLIENT', x: 30, y: height - 320, w: 350, h: 150, color: rgb(0.2, 0.6, 0.3) },
      { name: 'TABLEAU', x: 30, y: height - 550, w: width - 60, h: 200, color: rgb(0.9, 0.5, 0.2) },
      { name: 'TOTAUX', x: 400, y: height - 700, w: 165, h: 130, color: rgb(0.8, 0.2, 0.2) },
      { name: 'SIGNATURES', x: 30, y: 50, w: width - 60, h: 100, color: rgb(0.6, 0.2, 0.8) }
    ];

    // Dessiner les zones
    zones.forEach(zone => {
      // Rectangle de zone
      page.drawRectangle({
        x: zone.x,
        y: zone.y,
        width: zone.w,
        height: zone.h,
        borderColor: zone.color,
        borderWidth: 1,
        opacity: 0.1,
        color: zone.color
      });

      // Label de zone
      page.drawText(zone.name, {
        x: zone.x + 5,
        y: zone.y + zone.h - 15,
        size: 10,
        font: helveticaBold,
        color: zone.color,
        opacity: 0.7
      });
    });

    // Couleurs par type de champ
    const typeColors = {
      text: rgb(0.4, 0.4, 0.4),
      number: rgb(0.95, 0.5, 0.05),
      date: rgb(0.67, 0.28, 0.74),
      email: rgb(0, 0.54, 0.45),
      signature: rgb(0.83, 0.18, 0.18),
      textarea: rgb(0.37, 0.21, 0.69)
    };

    // Dessiner chaque champ
    Object.entries(fieldPositions).forEach(([fieldName, position]: [string, any]) => {
      if (position.page !== 1) return; // On ne dessine que la page 1

      // Convertir les coordonnées PDF
      const pdfY = height - position.y - position.height;

      // Déterminer le type et la couleur
      let fieldType = 'text';
      if (fieldName.includes('email')) fieldType = 'email';
      else if (fieldName.includes('date')) fieldType = 'date';
      else if (fieldName.includes('montant') || fieldName.includes('total') ||
               fieldName.includes('prix') || fieldName.includes('quantite')) fieldType = 'number';
      else if (fieldName.includes('signature')) fieldType = 'signature';
      else if (fieldName.includes('description_generale') || fieldName.includes('mentions')) fieldType = 'textarea';

      const color = typeColors[fieldType] || rgb(0.5, 0.5, 0.5);

      // Dessiner le rectangle du champ
      page.drawRectangle({
        x: position.x,
        y: pdfY,
        width: position.width,
        height: position.height,
        borderColor: color,
        borderWidth: 2,
        opacity: 0.2,
        color: color
      });

      // Ajouter le label si demandé
      if (showLabels) {
        const label = fieldName.replace(/_/g, ' ');
        const fontSize = Math.min(8, position.height * 0.4);

        // Fond blanc pour le texte
        page.drawRectangle({
          x: position.x + 2,
          y: pdfY + position.height / 2 - fontSize / 2 - 1,
          width: Math.min(position.width - 4, label.length * fontSize * 0.6),
          height: fontSize + 2,
          color: rgb(1, 1, 1),
          opacity: 0.8
        });

        // Texte du label
        page.drawText(label, {
          x: position.x + 3,
          y: pdfY + position.height / 2 - fontSize / 2,
          size: fontSize,
          font: helvetica,
          color: color,
          maxWidth: position.width - 6
        });
      }

      // Ajouter les coordonnées
      const coordText = `${Math.round(position.x)},${Math.round(position.y)}`;
      page.drawText(coordText, {
        x: position.x,
        y: pdfY - 10,
        size: 6,
        font: helvetica,
        color: rgb(0.6, 0.6, 0.6)
      });
    });

    // Ajouter une légende
    const legendY = 30;
    page.drawText('LÉGENDE:', {
      x: 50,
      y: legendY,
      size: 10,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });

    const legendItems = [
      { type: 'text', label: 'Texte' },
      { type: 'number', label: 'Nombre' },
      { type: 'date', label: 'Date' },
      { type: 'email', label: 'Email' },
      { type: 'signature', label: 'Signature' }
    ];

    legendItems.forEach((item, index) => {
      const x = 120 + index * 80;

      // Rectangle coloré
      page.drawRectangle({
        x: x,
        y: legendY - 2,
        width: 15,
        height: 10,
        color: typeColors[item.type],
        opacity: 0.7
      });

      // Label
      page.drawText(item.label, {
        x: x + 20,
        y: legendY,
        size: 8,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
    });

    // Informations sur le document
    page.drawText(`Document: ${documentType}`, {
      x: 50,
      y: height - 30,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });

    page.drawText(`${Object.keys(fieldPositions).length} champs positionnés`, {
      x: 200,
      y: height - 30,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4)
    });

    page.drawText(`Page A4 (595 x 842 pt)`, {
      x: 400,
      y: height - 30,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4)
    });

    // Sauvegarder le PDF
    const pdfBytes = await pdfDoc.save();

    // Créer le fichier
    const outputDir = path.join(process.cwd(), 'public', 'storage', 'previews');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `preview_positions_${documentType.toLowerCase()}_${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, pdfBytes);

    return NextResponse.json({
      success: true,
      previewUrl: `/storage/previews/${filename}`,
      fieldCount: Object.keys(fieldPositions).length,
      message: 'Aperçu des positions généré avec succès'
    });

  } catch (error) {
    console.error('Erreur génération aperçu positions:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la génération de l\'aperçu',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Récupérer les positions actuelles pour un type de document
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentType = searchParams.get('type') || 'DEVIS';

    const positions = getFieldPositionsForType(documentType);

    // Analyser les positions
    const analysis = {
      totalFields: Object.keys(positions).length,
      byZone: {
        header: 0,
        client: 0,
        table: 0,
        totals: 0,
        footer: 0
      },
      byType: {
        text: 0,
        number: 0,
        date: 0,
        email: 0,
        signature: 0
      }
    };

    Object.entries(positions).forEach(([fieldName, position]: [string, any]) => {
      // Analyse par zone (basée sur la position Y)
      if (position.y < 150) analysis.byZone.header++;
      else if (position.y < 320) analysis.byZone.client++;
      else if (position.y < 550) analysis.byZone.table++;
      else if (position.y < 700) analysis.byZone.totals++;
      else analysis.byZone.footer++;

      // Analyse par type
      if (fieldName.includes('email')) analysis.byType.email++;
      else if (fieldName.includes('date')) analysis.byType.date++;
      else if (fieldName.includes('signature')) analysis.byType.signature++;
      else if (fieldName.includes('montant') || fieldName.includes('total') ||
               fieldName.includes('prix') || fieldName.includes('quantite')) {
        analysis.byType.number++;
      } else {
        analysis.byType.text++;
      }
    });

    return NextResponse.json({
      success: true,
      documentType,
      positions,
      analysis
    });

  } catch (error) {
    console.error('Erreur récupération positions:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des positions',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}