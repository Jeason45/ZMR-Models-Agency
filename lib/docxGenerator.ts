/**
 * Générateur de documents basé sur templates .docx
 * Utilise docx-templates pour remplir les variables (gère automatiquement la fragmentation)
 */

import * as fs from 'fs';
import * as path from 'path';
import { createReport } from 'docx-templates';
import { exec } from 'child_process';
import { promisify } from 'util';
import { uploadToR2 } from './r2Storage';

const execAsync = promisify(exec);

interface DocumentData {
  [key: string]: any;
}

interface TemplateInfo {
  name: string;
  type: string;
  category: string;
  fileName?: string;
}

/**
 * Génère un document .docx rempli à partir d'un template
 * @param template - Information sur le template
 * @param data - Données à insérer
 * @param outputFileName - Nom du fichier de sortie
 * @returns Le chemin du fichier généré
 */
export async function generateDocx(
  template: TemplateInfo,
  data: DocumentData,
  outputFileName: string
): Promise<string> {
  try {
    // Déterminer le fichier template source
    const templateFileName = template.fileName || getTemplateFileName(template.type);
    const templatePath = path.join(process.cwd(), 'documents', templateFileName);

    console.log('📄 Génération document depuis template:', templatePath);

    // Vérifier que le template existe
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    // Lire le fichier template
    const templateBuffer = fs.readFileSync(templatePath);

    // Préparer les données (s'assurer que tout est string)
    const preparedData = prepareData(data);

    console.log('📝 Remplissage des variables...', Object.keys(preparedData).length, 'champs');

    // Générer le document avec docx-templates
    // Cette library gère automatiquement la fragmentation des variables
    const filledDocx = await createReport({
      template: templateBuffer,
      data: preparedData,
      cmdDelimiter: ['{{', '}}'],
    });

    // Nom du fichier .docx
    const docxFileName = outputFileName.replace('.pdf', '.docx');

    // Upload vers R2 au lieu de sauvegarder localement
    const r2Key = `documents/${docxFileName}`;
    const uploadResult = await uploadToR2(
      Buffer.from(filledDocx),
      r2Key,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    if (!uploadResult.success) {
      throw new Error(`Failed to upload to R2: ${uploadResult.error}`);
    }

    console.log('✅ Fichier .docx uploadé sur R2:', uploadResult.url);

    return uploadResult.url!;

  } catch (error) {
    console.error('❌ Erreur lors de la génération du document:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    throw new Error(`Failed to generate document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Génère un PDF à partir d'un template .docx
 * Note: Sur Vercel, LibreOffice n'est pas disponible, donc on génère un .docx
 * @param template - Information sur le template
 * @param data - Données à insérer
 * @param outputFileName - Nom du fichier PDF de sortie
 * @returns L'URL R2 du fichier généré (.docx ou .pdf si LibreOffice est disponible)
 */
export async function generatePDF(
  template: TemplateInfo,
  data: DocumentData,
  outputFileName: string
): Promise<string> {
  try {
    // D'abord générer le .docx et l'uploader sur R2
    const docxUrl = await generateDocx(template, data, outputFileName);

    console.log('✅ Document .docx généré et uploadé:', docxUrl);

    // Sur Vercel, LibreOffice n'est pas disponible
    // On retourne le .docx qui peut être téléchargé et converti par l'utilisateur
    return docxUrl;

  } catch (error) {
    console.error('❌ Erreur lors de la génération du document:', error);
    throw error;
  }
}

/**
 * Vérifie si LibreOffice est installé et retourne le chemin
 */
async function getLibreOfficePath(): Promise<string | null> {
  // Essayer le chemin macOS standard en premier
  const macPath = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
  try {
    await execAsync(`"${macPath}" --version`);
    return macPath;
  } catch {
    // Essayer la commande système
    try {
      const { stdout } = await execAsync('which soffice');
      return stdout.trim();
    } catch {
      return null;
    }
  }
}

/**
 * Vérifie si LibreOffice est installé
 */
async function checkLibreOffice(): Promise<boolean> {
  const path = await getLibreOfficePath();
  return path !== null;
}

/**
 * Détermine le nom du fichier template selon le type
 */
function getTemplateFileName(type: string): string {
  switch (type) {
    case 'DEVIS':
      return 'devis.docx';
    case 'CONTRAT':
      return 'contrat_mannequinat.docx';
    case 'FACTURE':
      return 'facture.docx';
    default:
      return 'template.docx';
  }
}

/**
 * Prépare les données pour docx-templates
 * Convertit tout en string et gère les valeurs spéciales
 */
function prepareData(data: DocumentData): Record<string, string> {
  const prepared: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === '') {
      prepared[key] = '';
    } else if (typeof value === 'number') {
      // Formater les nombres avec 2 décimales pour les prix
      if (key.includes('prix') || key.includes('montant') || key.includes('total')) {
        prepared[key] = value.toFixed(2);
      } else {
        prepared[key] = String(value);
      }
    } else if (typeof value === 'boolean') {
      prepared[key] = value ? 'Oui' : 'Non';
    } else if (value instanceof Date) {
      prepared[key] = value.toLocaleDateString('fr-FR');
    } else {
      prepared[key] = String(value);
    }
  }

  return prepared;
}

export default { generateDocx, generatePDF };