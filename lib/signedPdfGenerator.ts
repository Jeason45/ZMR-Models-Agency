import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Génère un PDF signé en intégrant la signature sur le document original
 * @param originalPdfPath - Chemin vers le PDF original
 * @param signatureImagePath - Chemin vers l'image de signature PNG
 * @param signatureData - Données de la signature (nom, date, IP, etc.)
 * @returns Le chemin du PDF signé généré
 */
export async function generateSignedPDF(
  originalPdfPath: string,
  signatureImagePath: string,
  signatureData: {
    signerName: string;
    signerEmail: string;
    signedAt: Date;
    ipAddress: string;
    documentHash: string;
    formData?: Record<string, string>; // Données du formulaire remplies par le client
  }
): Promise<string> {
  try {
    // Lire le PDF original
    const existingPdfBytes = fs.readFileSync(originalPdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Charger l'image de signature
    const signatureImageBytes = fs.readFileSync(signatureImagePath);
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

    // Charger les polices
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Couleurs JL Digital Studio
    const primaryColor = rgb(0.4, 0.42, 0.95); // #6366f1 (indigo)
    const darkColor = rgb(0.06, 0.09, 0.16); // #0f172a
    const grayColor = rgb(0.39, 0.46, 0.55); // #64748b
    const greenColor = rgb(0.13, 0.6, 0.33); // #22c55e

    // Récupérer la dernière page (où on va ajouter la signature)
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();

    // Calculer les dimensions de la signature (proportionnelles)
    const signatureWidth = 200;
    const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth;

    // Position de la signature (en bas à droite, au-dessus de la zone de signature existante)
    const signatureX = width - 250; // 250px du bord droit
    const signatureY = 120; // 120px du bas

    // Dessiner un rectangle blanc derrière la signature pour bien la voir
    lastPage.drawRectangle({
      x: signatureX - 10,
      y: signatureY - 10,
      width: signatureWidth + 20,
      height: signatureHeight + 60,
      color: rgb(1, 1, 1),
      borderColor: primaryColor,
      borderWidth: 1
    });

    // Ajouter l'image de signature
    lastPage.drawImage(signatureImage, {
      x: signatureX,
      y: signatureY + 30,
      width: signatureWidth,
      height: signatureHeight
    });

    // Ajouter le nom du signataire
    lastPage.drawText(signatureData.signerName, {
      x: signatureX,
      y: signatureY + 15,
      size: 10,
      font: helveticaBold,
      color: darkColor
    });

    // Ajouter la date de signature
    const dateStr = signatureData.signedAt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    lastPage.drawText(`Signé le ${dateStr}`, {
      x: signatureX,
      y: signatureY,
      size: 8,
      font: helvetica,
      color: grayColor
    });

    // ========== SECTION INFORMATIONS CLIENT (si formData fourni) ==========

    if (signatureData.formData && Object.keys(signatureData.formData).length > 0) {
      // Position au-dessus de la signature
      let formDataY = signatureY + signatureHeight + 100;
      const formDataX = 50; // Marge gauche

      // Titre de la section
      lastPage.drawText('Informations fournies par le client', {
        x: formDataX,
        y: formDataY,
        size: 12,
        font: helveticaBold,
        color: primaryColor
      });

      formDataY -= 20;

      // Afficher chaque champ du formulaire
      Object.entries(signatureData.formData).forEach(([key, value]) => {
        // Formater le label (remplacer les underscores par des espaces et mettre en majuscule)
        const label = key
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Dessiner le label en gras
        lastPage.drawText(`${label}:`, {
          x: formDataX,
          y: formDataY,
          size: 9,
          font: helveticaBold,
          color: darkColor
        });

        // Dessiner la valeur (tronquer si trop longue)
        const maxValueLength = 80;
        const displayValue = value.length > maxValueLength
          ? value.substring(0, maxValueLength) + '...'
          : value;

        lastPage.drawText(displayValue, {
          x: formDataX + 150,
          y: formDataY,
          size: 9,
          font: helvetica,
          color: darkColor
        });

        formDataY -= 15; // Espacement entre les champs
      });
    }

    // ========== BANDEAU DE CERTIFICATION EN HAUT DE LA DERNIÈRE PAGE ==========

    // Rectangle vert de certification
    lastPage.drawRectangle({
      x: 0,
      y: height - 35,
      width: width,
      height: 35,
      color: rgb(0.95, 0.99, 0.96), // Fond vert très clair
      borderColor: greenColor,
      borderWidth: 2
    });

    // Icône de validation (checkmark)
    const checkSize = 18;
    lastPage.drawCircle({
      x: 30,
      y: height - 17.5,
      size: checkSize / 2,
      color: greenColor
    });

    // Texte du bandeau
    lastPage.drawText('DOCUMENT SIGNE ELECTRONIQUEMENT', {
      x: 55,
      y: height - 23,
      size: 11,
      font: helveticaBold,
      color: greenColor
    });

    // Détails à droite (plus discrets)
    const rightText = `ID: ${signatureData.documentHash.substring(0, 8)}`;
    const rightTextWidth = helvetica.widthOfTextAtSize(rightText, 6);
    lastPage.drawText(rightText, {
      x: width - rightTextWidth - 20,
      y: height - 22,
      size: 6,
      font: helvetica,
      color: rgb(0.75, 0.75, 0.75) // Plus clair
    });

    // ========== FOOTER AVEC PREUVES LÉGALES ==========

    // Rectangle de footer
    lastPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 40,
      color: rgb(0.97, 0.98, 0.99) // Fond gris très clair
    });

    // Texte du footer
    const footerText = `Ce document a ete signe electroniquement par ${signatureData.signerName} (${signatureData.signerEmail})`;
    const footerTextWidth = helvetica.widthOfTextAtSize(footerText, 8);
    lastPage.drawText(footerText, {
      x: (width - footerTextWidth) / 2,
      y: 25,
      size: 8,
      font: helvetica,
      color: darkColor
    });

    const legalText = `Signature conforme eIDAS - Hash SHA-256: ${signatureData.documentHash.substring(0, 32)}... - JL Digital Studio`;
    const legalTextWidth = helvetica.widthOfTextAtSize(legalText, 7);
    lastPage.drawText(legalText, {
      x: (width - legalTextWidth) / 2,
      y: 12,
      size: 7,
      font: helvetica,
      color: grayColor
    });

    // ========== SAUVEGARDER LE PDF SIGNÉ ==========

    const pdfBytes = await pdfDoc.save();

    // Créer le nom du fichier signé
    const originalFileName = path.basename(originalPdfPath, '.pdf');
    const signedFileName = `${originalFileName}_SIGNED.pdf`;
    const signedDir = path.join(process.cwd(), 'public', 'storage', 'documents', 'signed');

    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(signedDir)) {
      fs.mkdirSync(signedDir, { recursive: true });
    }

    // Écrire le fichier signé
    const signedFilePath = path.join(signedDir, signedFileName);
    fs.writeFileSync(signedFilePath, pdfBytes);

    return `/storage/documents/signed/${signedFileName}`;

  } catch (error) {
    console.error('Error generating signed PDF:', error);
    throw new Error(`Failed to generate signed PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
