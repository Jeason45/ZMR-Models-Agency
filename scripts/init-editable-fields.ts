import { PrismaClient } from '@prisma/client';
import {
  DEVIS_FIELD_POSITIONS,
  FACTURE_FIELD_POSITIONS,
  CONTRAT_FIELD_POSITIONS,
  getFieldPositionsForType
} from '../lib/pdfFieldPositions';

const prisma = new PrismaClient();

/**
 * Créer les champs éditables pour un type de document
 */
function createEditableFields(templateType: string): any[] {
  const positions = getFieldPositionsForType(templateType);
  const fields = [];

  // Mapper les positions vers des champs éditables
  Object.entries(positions).forEach(([fieldName, position]) => {
    // Déterminer le type de champ
    let fieldType = 'text';
    let placeholder = '';

    // Types spéciaux basés sur le nom du champ
    if (fieldName.includes('email')) {
      fieldType = 'email';
      placeholder = 'exemple@email.com';
    } else if (fieldName.includes('date')) {
      fieldType = 'date';
      placeholder = 'JJ/MM/AAAA';
    } else if (fieldName.includes('telephone') || fieldName.includes('tel')) {
      fieldType = 'text';
      placeholder = '01 23 45 67 89';
    } else if (fieldName.includes('montant') || fieldName.includes('total') ||
               fieldName.includes('prix') || fieldName.includes('quantite') ||
               fieldName.includes('tva') || fieldName.includes('acompte') ||
               fieldName === 'sous_total') {
      fieldType = 'number';
      placeholder = '0.00';
    } else if (fieldName.includes('signature')) {
      fieldType = 'signature';
      placeholder = '';
    } else if (fieldName.includes('description')) {
      fieldType = 'textarea';
      placeholder = 'Description...';
    } else if (fieldName.includes('adresse')) {
      fieldType = 'text';
      placeholder = 'Adresse complète';
    }

    // Labels en français
    const labelMap: Record<string, string> = {
      // Document
      'numero_devis': 'Numéro de devis',
      'date_devis': 'Date du devis',
      'numero_facture': 'Numéro de facture',
      'date_facture': 'Date de facture',
      'date_echeance': 'Date d\'échéance',
      'numero_contrat': 'Numéro de contrat',
      'date_contrat': 'Date du contrat',

      // Client
      'nom_client': 'Nom du client',
      'adresse_client': 'Adresse du client',
      'telephone_client': 'Téléphone du client',
      'email_client': 'Email du client',
      'siret_client': 'SIRET du client',

      // Destinataire
      'nom_destinataire': 'Nom du destinataire',
      'adresse_destinataire': 'Adresse du destinataire',

      // Talent
      'prenom_talent': 'Prénom du talent',
      'nom_talent': 'Nom du talent',
      'date_naissance_talent': 'Date de naissance',
      'adresse_talent': 'Adresse du talent',
      'telephone_talent': 'Téléphone du talent',

      // Lignes de prestation
      'ligne_1_description': 'Description ligne 1',
      'ligne_1_quantite': 'Quantité',
      'ligne_1_prix_unitaire': 'Prix unitaire',
      'ligne_1_total': 'Total ligne 1',
      'ligne_2_description': 'Description ligne 2',
      'ligne_2_quantite': 'Quantité',
      'ligne_2_prix_unitaire': 'Prix unitaire',
      'ligne_2_total': 'Total ligne 2',
      'ligne_3_description': 'Description ligne 3',
      'ligne_3_quantite': 'Quantité',
      'ligne_3_prix_unitaire': 'Prix unitaire',
      'ligne_3_total': 'Total ligne 3',

      // Totaux
      'sous_total': 'Sous-total HT',
      'tva_pourcentage': 'TVA %',
      'tva_montant': 'Montant TVA',
      'total_ttc': 'Total TTC',

      // Conditions
      'validite_jours': 'Validité (jours)',
      'acompte_pourcentage': 'Acompte %',

      // Contrat
      'date_debut': 'Date de début',
      'date_fin': 'Date de fin',
      'montant_cachet': 'Montant du cachet',
      'lieu_prestation': 'Lieu de prestation',
      'signature_client': 'Signature du client',
      'signature_talent': 'Signature du talent'
    };

    // Déterminer si le champ est requis
    const isRequired = fieldName.includes('nom') ||
                      fieldName.includes('numero') ||
                      fieldName.includes('date_') ||
                      fieldName === 'total_ttc';

    // Déterminer si le champ est calculé automatiquement
    const isCalculated = fieldName.includes('_total') ||
                        fieldName === 'sous_total' ||
                        fieldName === 'tva_montant' ||
                        fieldName === 'total_ttc';

    fields.push({
      name: fieldName,
      label: labelMap[fieldName] || fieldName.replace(/_/g, ' '),
      type: fieldType,
      required: isRequired && !isCalculated,
      placeholder,
      position,
      calculated: isCalculated,
      editable: !isCalculated
    });
  });

  return fields;
}

async function initEditableFields() {
  console.log('🚀 Initialisation des champs éditables dans les templates...\n');

  try {
    // Types de documents à mettre à jour
    const templateConfigs = [
      { type: 'DEVIS', name: 'Devis Commercial' },
      { type: 'FACTURE', name: 'Facture' },
      { type: 'CONTRAT', names: ['Contrat de Mannequinat', 'Contrat Talent'] }
    ];

    for (const config of templateConfigs) {
      console.log(`\n📄 Mise à jour des templates ${config.type}...`);

      // Récupérer les champs éditables pour ce type
      const editableFields = createEditableFields(config.type);

      // Conditions de recherche
      const whereCondition = Array.isArray(config.names)
        ? { type: config.type, name: { in: config.names } }
        : { type: config.type, name: config.name };

      // Trouver et mettre à jour les templates
      const templates = await prisma.documentTemplate.findMany({
        where: whereCondition
      });

      for (const template of templates) {
        await prisma.documentTemplate.update({
          where: { id: template.id },
          data: {
            editableFields: editableFields
          }
        });

        console.log(`  ✅ ${template.name}: ${editableFields.length} champs configurés`);

        // Afficher quelques exemples de positions
        const examples = editableFields.slice(0, 3);
        examples.forEach(field => {
          console.log(`     - ${field.label}: x=${field.position.x}, y=${field.position.y}`);
        });
      }
    }

    console.log('\n✨ Initialisation terminée !');
    console.log('\nLes positions précises ont été configurées pour :');
    console.log('  - DEVIS: Numéro, date, client, lignes de prestation, totaux');
    console.log('  - FACTURE: Similaire au devis + date d\'échéance');
    console.log('  - CONTRAT: Parties, dates, montants, signatures');

    console.log('\n📍 Les champs apparaîtront maintenant aux bonnes positions');
    console.log('   sur les documents PDF générés, au lieu d\'être groupés au milieu.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'initialisation
initEditableFields();