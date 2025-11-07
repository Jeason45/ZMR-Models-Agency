import { generatePDFForm } from '../lib/pdfFormGenerator';
import { getFieldPositionsForType } from '../lib/pdfFieldPositions';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

async function testPDFPositions() {
  console.log('🧪 Test des positions PDF avec le nouveau système...\n');

  try {
    // 1. Créer un document DOCX de test (devis)
    const devisPath = path.join(process.cwd(), 'documents', 'devis.docx');

    if (!fs.existsSync(devisPath)) {
      console.error('❌ Le fichier devis.docx n\'existe pas dans le dossier documents/');
      return;
    }

    // 2. Convertir en PDF
    console.log('📄 Conversion DOCX vers PDF...');
    const outputPdfPath = path.join(process.cwd(), 'public', 'storage', 'test', 'devis_test.pdf');

    // Créer le dossier de sortie s'il n'existe pas
    const outputDir = path.dirname(outputPdfPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Conversion avec LibreOffice
    await execAsync(
      `soffice --headless --convert-to pdf --outdir "${outputDir}" "${devisPath}"`
    );

    const basePdfPath = path.join(outputDir, 'devis.pdf');

    // Renommer le fichier converti
    if (fs.existsSync(basePdfPath)) {
      fs.renameSync(basePdfPath, outputPdfPath);
    }

    // 3. Récupérer les positions pour un devis
    const positions = getFieldPositionsForType('DEVIS');

    // 4. Créer les champs éditables avec les positions précises
    const editableFields = Object.entries(positions).map(([fieldName, position]) => {
      // Déterminer le type de champ
      let fieldType = 'text';
      let label = fieldName.replace(/_/g, ' ');

      if (fieldName.includes('email')) {
        fieldType = 'email';
      } else if (fieldName.includes('date')) {
        fieldType = 'date';
      } else if (fieldName.includes('montant') || fieldName.includes('total') ||
                 fieldName.includes('prix') || fieldName.includes('quantite') ||
                 fieldName.includes('tva') || fieldName.includes('acompte')) {
        fieldType = 'number';
      } else if (fieldName.includes('signature')) {
        fieldType = 'signature';
      }

      // Labels plus jolis
      const labelMap: Record<string, string> = {
        'numero_devis': 'Numéro de devis',
        'date_devis': 'Date du devis',
        'nom_client': 'Nom du client',
        'adresse_client': 'Adresse du client',
        'telephone_client': 'Téléphone',
        'email_client': 'Email',
        'nom_destinataire': 'Nom du destinataire',
        'adresse_destinataire': 'Adresse du destinataire',
        'sous_total': 'Sous-total HT',
        'tva_pourcentage': 'TVA %',
        'tva_montant': 'Montant TVA',
        'total_ttc': 'TOTAL TTC',
        'validite_jours': 'Validité (jours)',
        'acompte_pourcentage': 'Acompte %'
      };

      return {
        name: fieldName,
        label: labelMap[fieldName] || label,
        type: fieldType,
        required: fieldName.includes('nom') || fieldName.includes('numero'),
        position: position as any
      };
    });

    // 5. Ajouter quelques données de test
    const testData = {
      numero_devis: 'DEV-2025-001',
      date_devis: '05/11/2025',
      nom_client: 'Société Test SARL',
      adresse_client: '123 Rue de la République, 75001 Paris',
      telephone_client: '01 23 45 67 89',
      email_client: 'contact@societe-test.fr',

      ligne_1_description: 'Prestation de mannequinat - Shooting photo produit',
      ligne_1_quantite: '2',
      ligne_1_prix_unitaire: '500',
      ligne_1_total: '1000',

      ligne_2_description: 'Frais de déplacement et logistique',
      ligne_2_quantite: '1',
      ligne_2_prix_unitaire: '150',
      ligne_2_total: '150',

      sous_total: '1150',
      tva_pourcentage: '20',
      tva_montant: '230',
      total_ttc: '1380',

      validite_jours: '30',
      acompte_pourcentage: '30'
    };

    // 6. Générer le PDF avec champs éditables
    console.log(`\n📝 Ajout de ${editableFields.length} champs éditables avec positions précises...`);

    const editablePdfPath = path.join(outputDir, 'devis_test_editable.pdf');

    await generatePDFForm({
      basePdfPath: outputPdfPath,
      editableFields,
      data: testData,
      outputPath: editablePdfPath
    });

    console.log('\n✅ Test terminé avec succès !');
    console.log(`📂 PDF éditable généré : ${editablePdfPath}`);
    console.log('\n📊 Résumé des positions utilisées :');
    console.log('─'.repeat(60));

    // Afficher un résumé des positions
    editableFields.slice(0, 5).forEach(field => {
      console.log(`  ${field.label}:`);
      console.log(`    Position: x=${field.position.x}, y=${field.position.y}`);
      console.log(`    Taille: ${field.position.width}x${field.position.height}`);
    });
    console.log(`  ... et ${editableFields.length - 5} autres champs`);

    console.log('\n🎯 Les champs devraient maintenant apparaître aux positions exactes');
    console.log('   définies dans le template, au lieu d\'être empilés au milieu.');

    // Nettoyer le PDF temporaire
    if (fs.existsSync(outputPdfPath)) {
      fs.unlinkSync(outputPdfPath);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
  }
}

// Exécuter le test
testPDFPositions();