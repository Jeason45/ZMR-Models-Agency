#!/usr/bin/env tsx

/**
 * Script pour appliquer les positions de champs exportées depuis l'éditeur visuel
 *
 * Usage:
 * 1. Positionnez les champs dans l'éditeur visuel
 * 2. Cliquez sur "Exporter configuration"
 * 3. Collez la configuration exportée dans ce script
 * 4. Exécutez: npx tsx scripts/apply-field-positions.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// ============================================================
// COLLEZ VOTRE CONFIGURATION EXPORTÉE ICI
// ============================================================

// Positions des champs pour DEVIS
export const DEVIS_FIELD_POSITIONS = {
  // Cette configuration sera remplacée par l'export de l'éditeur
  // Exemple:
  "numero_devis": {
    "page": 1,
    "x": 400,
    "y": 50,
    "width": 150,
    "height": 25
  },
  "date_devis": {
    "page": 1,
    "x": 400,
    "y": 80,
    "width": 150,
    "height": 20
  }
  // ... autres champs
};

// Mapping des labels et types
export const DEVIS_FIELD_MAPPING = {
  // Cette configuration sera remplacée par l'export de l'éditeur
  "numero_devis": {
    "label": "Numéro de devis",
    "type": "text"
  },
  "date_devis": {
    "label": "Date du devis",
    "type": "date"
  }
  // ... autres champs
};

// ============================================================
// FIN DE LA ZONE DE CONFIGURATION
// ============================================================

async function applyFieldPositions() {
  console.log('🚀 Application des positions de champs...\n');

  try {
    // 1. Mettre à jour le fichier pdfFieldPositions.ts
    const positionsFilePath = path.join(
      process.cwd(),
      'lib',
      'pdfFieldPositions.ts'
    );

    // Lire le fichier existant
    let fileContent = fs.readFileSync(positionsFilePath, 'utf-8');

    // Remplacer les positions DEVIS
    const newPositionsCode = `export const DEVIS_FIELD_POSITIONS: DocumentFieldPositions = ${JSON.stringify(DEVIS_FIELD_POSITIONS, null, 2)};`;

    // Utiliser une regex pour remplacer la section DEVIS_FIELD_POSITIONS
    const devisRegex = /export const DEVIS_FIELD_POSITIONS[^;]*;/s;

    if (devisRegex.test(fileContent)) {
      fileContent = fileContent.replace(devisRegex, newPositionsCode);
      console.log('✅ Positions DEVIS mises à jour dans pdfFieldPositions.ts');
    } else {
      console.log('⚠️ Section DEVIS_FIELD_POSITIONS non trouvée, ajout en fin de fichier');
      fileContent += '\n\n' + newPositionsCode;
    }

    // Ajouter le mapping si nécessaire
    const mappingCode = `\n\n// Mapping des champs DEVIS\nexport const DEVIS_FIELD_MAPPING = ${JSON.stringify(DEVIS_FIELD_MAPPING, null, 2)};`;

    if (!fileContent.includes('DEVIS_FIELD_MAPPING')) {
      fileContent += mappingCode;
      console.log('✅ Mapping DEVIS ajouté');
    }

    // Sauvegarder le fichier
    fs.writeFileSync(positionsFilePath, fileContent);

    // 2. Mettre à jour les templates en base de données
    console.log('\n📄 Mise à jour des templates en base de données...');

    // Créer les champs éditables à partir de la configuration
    const editableFields = Object.entries(DEVIS_FIELD_POSITIONS).map(([fieldName, position]) => {
      const mapping = DEVIS_FIELD_MAPPING[fieldName] || {};

      return {
        name: fieldName,
        label: mapping.label || fieldName.replace(/_/g, ' '),
        type: mapping.type || 'text',
        required: determineIfRequired(fieldName, mapping.type),
        position: position,
        placeholder: getPlaceholder(fieldName, mapping.type),
        calculated: isCalculatedField(fieldName),
        editable: !isCalculatedField(fieldName)
      };
    });

    // Mettre à jour le template DEVIS
    const devisTemplates = await prisma.documentTemplate.findMany({
      where: {
        type: 'DEVIS'
      }
    });

    for (const template of devisTemplates) {
      await prisma.documentTemplate.update({
        where: { id: template.id },
        data: {
          editableFields: editableFields
        }
      });

      console.log(`  ✅ ${template.name}: ${editableFields.length} champs configurés`);
    }

    // 3. Créer un rapport
    console.log('\n📊 Rapport de configuration :');
    console.log('─'.repeat(60));

    const fieldsByType = editableFields.reduce((acc, field) => {
      const type = field.type as string;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Types de champs :');
    Object.entries(fieldsByType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} champs`);
    });

    console.log('\nZones configurées :');
    const zones = [
      { name: 'En-tête', fields: editableFields.filter(f => f.position.y < 150).length },
      { name: 'Client', fields: editableFields.filter(f => f.position.y >= 150 && f.position.y < 320).length },
      { name: 'Tableau', fields: editableFields.filter(f => f.name.includes('ligne_')).length },
      { name: 'Totaux', fields: editableFields.filter(f => f.name.includes('total') || f.name.includes('tva')).length },
      { name: 'Signatures', fields: editableFields.filter(f => f.name.includes('signature')).length }
    ];

    zones.forEach(zone => {
      if (zone.fields > 0) {
        console.log(`  - ${zone.name}: ${zone.fields} champs`);
      }
    });

    console.log('\n✨ Configuration appliquée avec succès !');
    console.log('\nLes positions sont maintenant actives pour :');
    console.log('  - Génération de nouveaux documents');
    console.log('  - Éditeur PDF interactif');
    console.log('  - Export et signatures électroniques');

    // 4. Générer un PDF de test pour vérifier
    console.log('\n🧪 Génération d\'un PDF test pour vérification...');

    const testScript = path.join(process.cwd(), 'scripts', 'test-pdf-positions.ts');
    if (fs.existsSync(testScript)) {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      try {
        await execAsync('npx tsx scripts/test-pdf-positions.ts');
        console.log('✅ PDF de test généré dans /public/storage/test/');
      } catch (error) {
        console.log('⚠️ Impossible de générer le PDF de test automatiquement');
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'application des positions :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helpers
function determineIfRequired(fieldName: string, type?: string): boolean {
  // Champs toujours requis
  const requiredFields = [
    'numero_devis', 'date_devis', 'nom_client', 'nom_agence',
    'total_ttc'
  ];

  return requiredFields.some(req => fieldName.includes(req));
}

function getPlaceholder(fieldName: string, type?: string): string {
  if (type === 'email') return 'exemple@email.com';
  if (type === 'date') return 'JJ/MM/AAAA';
  if (type === 'number') return '0.00';

  if (fieldName.includes('telephone')) return '01 23 45 67 89';
  if (fieldName.includes('adresse')) return 'Adresse complète';
  if (fieldName.includes('siret')) return 'XXX XXX XXX XXXXX';
  if (fieldName.includes('code_postal')) return '75001';
  if (fieldName.includes('ville')) return 'Ville';
  if (fieldName.includes('description')) return 'Description...';

  return '';
}

function isCalculatedField(fieldName: string): boolean {
  // Champs calculés automatiquement
  const calculatedFields = [
    'ligne_1_total', 'ligne_2_total', 'ligne_3_total', 'ligne_4_total', 'ligne_5_total',
    'sous_total_ht', 'tva_montant', 'total_ttc', 'total_ht_apres_remise',
    'remise_montant', 'acompte_montant'
  ];

  return calculatedFields.includes(fieldName);
}

// Exécuter le script
applyFieldPositions();