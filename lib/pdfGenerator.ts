import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

interface DocumentData {
  [key: string]: string;
}

interface TemplateInfo {
  name: string;
  type: string;
  category: string;
  content?: string;
}

/**
 * Génère un PDF à partir d'un template et des données fournies
 * @param template - Information sur le template
 * @param data - Données à insérer dans le document
 * @param fileName - Nom du fichier PDF à générer
 * @param documentNumber - Numéro du document (ex: CONT-2025-001)
 * @returns Le chemin complet du fichier généré
 */
export async function generatePDF(
  template: TemplateInfo,
  data: DocumentData,
  fileName: string,
  documentNumber: string
): Promise<string> {
  try {
    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();

    // Charger les polices standard
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Ajouter une page
    const page = pdfDoc.addPage([595, 842]); // A4 size in points
    const { width, height } = page.getSize();

    // Marges
    const marginLeft = 60;
    const marginRight = 60;
    const marginTop = 60;
    let currentY = height - marginTop;

    // Couleurs
    const primaryColor = rgb(0.4, 0.42, 0.95); // #6366f1
    const darkColor = rgb(0.06, 0.09, 0.16); // #0f172a
    const grayColor = rgb(0.39, 0.46, 0.55); // #64748b

    // ============ EN-TÊTE ============

    // Logo/Nom de l'agence
    page.drawText('ZMR MODELS AGENCY', {
      x: marginLeft,
      y: currentY,
      size: 24,
      font: helveticaBold,
      color: primaryColor
    });
    currentY -= 10;

    // Ligne de séparation
    page.drawLine({
      start: { x: marginLeft, y: currentY },
      end: { x: width - marginRight, y: currentY },
      thickness: 2,
      color: primaryColor
    });
    currentY -= 30;

    // Informations de l'agence (côté gauche)
    page.drawText('ZMR Models Agency', {
      x: marginLeft,
      y: currentY,
      size: 10,
      font: helvetica,
      color: darkColor
    });
    currentY -= 15;

    page.drawText('123 Avenue des Champs-Élysées', {
      x: marginLeft,
      y: currentY,
      size: 9,
      font: helvetica,
      color: grayColor
    });
    currentY -= 12;

    page.drawText('75008 Paris, France', {
      x: marginLeft,
      y: currentY,
      size: 9,
      font: helvetica,
      color: grayColor
    });
    currentY -= 12;

    page.drawText('contact@zmrmodels.com | +33 1 23 45 67 89', {
      x: marginLeft,
      y: currentY,
      size: 9,
      font: helvetica,
      color: grayColor
    });

    // Numéro de document et date (côté droit)
    const rightColumnX = width - marginRight - 200;
    let rightY = height - marginTop - 40;

    page.drawText(`N° ${documentNumber}`, {
      x: rightColumnX,
      y: rightY,
      size: 11,
      font: helveticaBold,
      color: darkColor
    });
    rightY -= 15;

    const today = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    page.drawText(`Date: ${today}`, {
      x: rightColumnX,
      y: rightY,
      size: 9,
      font: helvetica,
      color: grayColor
    });

    currentY -= 60;

    // ============ TITRE DU DOCUMENT ============

    page.drawText(template.name.toUpperCase(), {
      x: marginLeft,
      y: currentY,
      size: 18,
      font: helveticaBold,
      color: darkColor
    });
    currentY -= 40;

    // ============ CORPS DU DOCUMENT ============

    // Remplacer les variables dans le contenu du template
    let content = template.content || generateDefaultContent(template, data);

    // Remplacer toutes les variables {{variable}} par leurs valeurs
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, data[key]);
    });

    // Afficher le contenu ligne par ligne
    const lines = content.split('\n');
    const lineHeight = 14;
    const maxWidth = width - marginLeft - marginRight;
    let currentPage = page;

    for (const line of lines) {
      // Vérifier si on doit créer une nouvelle page (laisser 80px pour le pied de page)
      if (currentY < 120) {
        currentPage = pdfDoc.addPage([595, 842]);
        currentY = height - marginTop;
      }

      if (line.trim() === '') {
        currentY -= lineHeight / 2;
        continue;
      }

      // Déterminer le style de la ligne
      let font = helvetica;
      let size = 10;
      let color = darkColor;

      if (line.startsWith('# ')) {
        // Titre de section
        font = helveticaBold;
        size = 13;
        color = primaryColor;
        const text = line.substring(2);

        // Vérifier si on a assez d'espace pour le titre et au moins 2 lignes
        if (currentY < 150) {
          currentPage = pdfDoc.addPage([595, 842]);
          currentY = height - marginTop;
        }

        currentPage.drawText(text, { x: marginLeft, y: currentY, size, font, color });
        currentY -= lineHeight * 1.8;
        continue;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Texte en gras
        font = helveticaBold;
        const text = line.substring(2, line.length - 2);

        if (currentY < 120) {
          currentPage = pdfDoc.addPage([595, 842]);
          currentY = height - marginTop;
        }

        currentPage.drawText(text, { x: marginLeft, y: currentY, size, font, color });
        currentY -= lineHeight * 1.2;
        continue;
      }

      // Texte normal - gérer le retour à la ligne si trop long
      const words = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = font.widthOfTextAtSize(testLine, size);

        if (testWidth > maxWidth && currentLine !== '') {
          if (currentY < 120) {
            currentPage = pdfDoc.addPage([595, 842]);
            currentY = height - marginTop;
          }

          currentPage.drawText(currentLine, {
            x: marginLeft,
            y: currentY,
            size,
            font,
            color
          });
          currentY -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        if (currentY < 120) {
          currentPage = pdfDoc.addPage([595, 842]);
          currentY = height - marginTop;
        }

        currentPage.drawText(currentLine, {
          x: marginLeft,
          y: currentY,
          size,
          font,
          color
        });
        currentY -= lineHeight;
      }
    }

    // ============ PIED DE PAGE (sur la dernière page uniquement) ============

    // Signature si nécessaire
    if (template.type === 'CONTRAT') {
      // S'assurer qu'on a assez d'espace pour les signatures, sinon créer une nouvelle page
      if (currentY < 180) {
        currentPage = pdfDoc.addPage([595, 842]);
        currentY = height - marginTop - 100;
      } else {
        currentY -= 60;
      }

      // Zone de signature client
      currentPage.drawText('Signature du client:', {
        x: marginLeft,
        y: currentY,
        size: 9,
        font: helveticaBold,
        color: darkColor
      });

      currentPage.drawText('Date: _____________', {
        x: marginLeft,
        y: currentY - 15,
        size: 9,
        font: helvetica,
        color: grayColor
      });

      currentPage.drawLine({
        start: { x: marginLeft, y: currentY - 50 },
        end: { x: marginLeft + 150, y: currentY - 50 },
        thickness: 1,
        color: grayColor
      });

      // Zone de signature agence
      currentPage.drawText('Pour ZMR Models Agency:', {
        x: rightColumnX,
        y: currentY,
        size: 9,
        font: helveticaBold,
        color: darkColor
      });

      currentPage.drawText('Date: _____________', {
        x: rightColumnX,
        y: currentY - 15,
        size: 9,
        font: helvetica,
        color: grayColor
      });

      currentPage.drawLine({
        start: { x: rightColumnX, y: currentY - 50 },
        end: { x: rightColumnX + 150, y: currentY - 50 },
        thickness: 1,
        color: grayColor
      });
    }

    // Note en bas de page (sur la dernière page)
    const footerText = 'Document généré automatiquement par ZMR Models Agency';
    const footerWidth = helveticaItalic.widthOfTextAtSize(footerText, 8);
    currentPage.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 30,
      size: 8,
      font: helveticaItalic,
      color: grayColor
    });

    // ============ SAUVEGARDER LE PDF ============

    const pdfBytes = await pdfDoc.save();

    // Créer le répertoire s'il n'existe pas
    const documentsDir = path.join(process.cwd(), 'public', 'storage', 'documents');
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    // Écrire le fichier
    const filePath = path.join(documentsDir, fileName);
    fs.writeFileSync(filePath, pdfBytes);

    return `/storage/documents/${fileName}`;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Génère un contenu par défaut pour un template
 */
function generateDefaultContent(template: TemplateInfo, data: DocumentData): string {
  const type = template.type;

  if (type === 'CONTRAT') {
    return `# ${template.name}

Entre les soussignés:

**ZMR Models Agency**
123 Avenue des Champs-Élysées
75008 Paris, France
SIRET: 123 456 789 00010

Ci-après dénommée "L'Agence"

Et:

**${data.nom_complet || data.nom_talent || 'Le Talent'}**
${data.adresse || ''}
${data.ville ? data.ville + ', ' : ''}${data.code_postal || ''}

Ci-après dénommé(e) "Le Talent"

# Article 1 - Objet du contrat

Le présent contrat a pour objet de définir les conditions dans lesquelles L'Agence assurera la représentation et la promotion du Talent dans le cadre de ses activités professionnelles ${data.categorie || 'artistiques'}.

# Article 2 - Durée du contrat

Le présent contrat prend effet à compter du ${data.date_debut || '__/__/____'} pour une durée de ${data.duree || '1 an'}, renouvelable par tacite reconduction.

# Article 3 - Obligations de l'Agence

L'Agence s'engage à:
- Promouvoir le Talent auprès de clients potentiels
- Négocier les contrats au nom du Talent
- Gérer l'agenda et les rendez-vous professionnels
- Fournir des conseils en matière de développement de carrière

# Article 4 - Obligations du Talent

Le Talent s'engage à:
- Accorder l'exclusivité de sa représentation à L'Agence
- Se rendre disponible pour les castings et rendez-vous organisés
- Maintenir une image professionnelle
- Informer l'Agence de toute opportunité professionnelle

# Article 5 - Rémunération

L'Agence percevra une commission de ${data.taux_commission || '20'}% sur l'ensemble des revenus générés par le Talent dans le cadre de ce contrat.

# Article 6 - Résiliation

Le présent contrat peut être résilié par l'une ou l'autre des parties moyennant un préavis de ${data.preavis || '3 mois'} par lettre recommandée avec accusé de réception.

Fait en deux exemplaires originaux, à ${data.ville || 'Paris'}, le ${data.date || today()}.`;
  }

  if (type === 'FACTURE') {
    return `# FACTURE

**Client:**
${data.nom_client || ''}
${data.adresse_client || ''}
${data.email_client || ''}

# Détails de la prestation

Prestation: ${data.description_prestation || data.prestation || 'Prestation de services'}

Date de la prestation: ${data.date_prestation || ''}

# Montant

Montant HT: ${data.montant_ht || data.montant || '0.00'} €
TVA (${data.taux_tva || '20'}%): ${calculateTVA(data.montant_ht || data.montant || '0', data.taux_tva || '20')} €
**Montant TTC: ${calculateTTC(data.montant_ht || data.montant || '0', data.taux_tva || '20')} €**

# Conditions de paiement

Règlement à effectuer sous ${data.delai_paiement || '30'} jours par virement bancaire.

Coordonnées bancaires:
IBAN: FR76 1234 5678 9012 3456 7890 123
BIC: BNPAFRPPXXX

En cas de retard de paiement, une pénalité de ${data.penalite || '3'}% du montant dû sera appliquée.`;
  }

  if (type === 'DEVIS') {
    return `# DEVIS

**Client:**
${data.nom_client || ''}
${data.adresse_client || ''}
${data.email_client || ''}

# Description de la prestation

${data.description || 'Prestation de services'}

# Détail

${data.detail_prestation || ''}

# Montant

Montant HT: ${data.montant_ht || data.montant || '0.00'} €
TVA (${data.taux_tva || '20'}%): ${calculateTVA(data.montant_ht || data.montant || '0', data.taux_tva || '20')} €
**Montant TTC: ${calculateTTC(data.montant_ht || data.montant || '0', data.taux_tva || '20')} €**

# Validité

Ce devis est valable ${data.validite || '30'} jours à compter de sa date d'émission.

# Conditions

${data.conditions || 'Devis accepté tel quel, sans réserve. Tout acompte versé ne pourra être remboursé en cas d\'annulation.'}`;
  }

  // Template générique
  return `# ${template.name}

${Object.entries(data).map(([key, value]) => {
  const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `**${label}:** ${value}`;
}).join('\n\n')}`;
}

function today(): string {
  return new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function calculateTVA(montant: string, taux: string): string {
  const m = parseFloat(montant);
  const t = parseFloat(taux);
  if (isNaN(m) || isNaN(t)) return '0.00';
  return (m * t / 100).toFixed(2);
}

function calculateTTC(montant: string, taux: string): string {
  const m = parseFloat(montant);
  const t = parseFloat(taux);
  if (isNaN(m) || isNaN(t)) return '0.00';
  return (m + (m * t / 100)).toFixed(2);
}
