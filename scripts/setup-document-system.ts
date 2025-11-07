/**
 * Script de configuration du système de documents
 * - Crée les settings de l'agence (à personnaliser)
 * - Configure le mapping des templates Devis et Contrat Mannequinat
 */

import { prisma } from '../lib/prisma';
import { DocumentDataMapper } from '../lib/documentDataMapper';

async function main() {
  console.log('🚀 Configuration du système de documents...\n');

  // 1. Créer ou mettre à jour les paramètres de l'agence
  console.log('1️⃣ Configuration AgencySettings...');

  const existingSettings = await prisma.agencySettings.findFirst();

  if (!existingSettings) {
    await prisma.agencySettings.create({
      data: {
        nom_agence: 'ZMR Models Agency',
        adresse_agence: '123 Avenue des Champs-Élysées, 75008 Paris, France',
        telephone_agence: '+33 1 23 45 67 89',
        email_agence: 'contact@zmrmodels.com',
        site_web_agence: 'https://zmrmodels.com',
        siret_agence: '123 456 789 00010',
        forme_juridique: 'SAS',
        capital: '50 000 EUR',
        ville_rcs: 'Paris',
        numero_rcs: '123 456 789',
        representant_nom: 'Rémy ZMR',
        representant_qualite: 'Président',
        tva_par_defaut: 20.0,
        delai_paiement_defaut: '30 jours',
        validite_devis_defaut: 30,
      },
    });
    console.log('✅ AgencySettings créé');
  } else {
    console.log('✅ AgencySettings existe déjà');
  }

  // 2. Configuration du template Devis
  console.log('\n2️⃣ Configuration du template DEVIS...');

  const devisVariables = [
    // Agence
    'nom_agence', 'adresse_agence', 'telephone_agence', 'email_agence', 'siret_agence',
    // Devis info
    'date_devis', 'numero_devis',
    // Client
    'nom_client', 'adresse_client', 'telephone_client', 'email_client', 'site_web_client',
    // Destinataire
    'nom_destinataire', 'adresse_destinataire', 'telephone_destinataire', 'email_destinataire',
    // Lignes
    'ligne_1_description', 'ligne_1_prix_unitaire', 'ligne_1_quantite', 'ligne_1_total',
    'ligne_2_description', 'ligne_2_prix_unitaire', 'ligne_2_quantite', 'ligne_2_total',
    'ligne_3_description', 'ligne_3_prix_unitaire', 'ligne_3_quantite', 'ligne_3_total',
    // Totaux
    'sous_total', 'tva_pourcentage', 'tva_montant', 'total_ttc',
    // Conditions
    'validite_jours', 'acompte_pourcentage',
  ];

  const devisMapping = {
    // AGENCE (auto)
    nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true, required: true, label: 'Nom de l\'agence' },
    adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true, required: true, label: 'Adresse de l\'agence' },
    telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true, required: true, label: 'Téléphone agence' },
    email_agence: { source: 'agency', field: 'email_agence', autoFill: true, required: true, label: 'Email agence' },
    siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true, required: true, label: 'SIRET agence' },

    // DEVIS INFO (auto-généré)
    date_devis: { source: 'auto', field: 'today', format: 'DD MMMM YYYY', autoFill: true, required: true, label: 'Date du devis' },
    numero_devis: { source: 'auto', field: 'documentNumber', autoFill: true, required: true, label: 'Numéro du devis' },

    // CLIENT (auto depuis Contact)
    nom_client: { source: 'contact', field: 'name', autoFill: true, required: true, label: 'Nom du client' },
    adresse_client: { source: 'contact', field: 'adresse_client', autoFill: true, required: false, label: 'Adresse du client' },
    telephone_client: { source: 'contact', field: 'phone', autoFill: true, required: false, label: 'Téléphone client' },
    email_client: { source: 'contact', field: 'email', autoFill: true, required: true, label: 'Email client' },
    site_web_client: { source: 'contact', field: 'site_web_client', autoFill: true, required: false, label: 'Site web client' },

    // DESTINATAIRE (auto avec fallback sur client)
    nom_destinataire: { source: 'contact', field: 'nom_destinataire', autoFill: true, required: false, fallback: 'name', label: 'Nom destinataire' },
    adresse_destinataire: { source: 'contact', field: 'adresse_destinataire', autoFill: true, required: false, fallback: 'adresse_client', label: 'Adresse destinataire' },
    telephone_destinataire: { source: 'contact', field: 'telephone_destinataire', autoFill: true, required: false, fallback: 'phone', label: 'Téléphone destinataire' },
    email_destinataire: { source: 'contact', field: 'email_destinataire', autoFill: true, required: false, fallback: 'email', label: 'Email destinataire' },

    // LIGNES (manuel + calculé)
    ligne_1_description: { source: 'manual', autoFill: false, required: true, type: 'textarea', label: 'Description ligne 1' },
    ligne_1_prix_unitaire: { source: 'manual', autoFill: false, required: true, type: 'number', format: 'currency', label: 'Prix unitaire ligne 1 (€)' },
    ligne_1_quantite: { source: 'manual', autoFill: false, required: true, type: 'number', defaultValue: 1, label: 'Quantité ligne 1' },
    ligne_1_total: { source: 'calculated', formula: 'ligne_1_prix_unitaire * ligne_1_quantite', autoFill: true, format: 'currency', label: 'Total ligne 1 (€)' },

    ligne_2_description: { source: 'manual', autoFill: false, required: false, type: 'textarea', label: 'Description ligne 2' },
    ligne_2_prix_unitaire: { source: 'manual', autoFill: false, required: false, type: 'number', format: 'currency', label: 'Prix unitaire ligne 2 (€)' },
    ligne_2_quantite: { source: 'manual', autoFill: false, required: false, type: 'number', defaultValue: 1, label: 'Quantité ligne 2' },
    ligne_2_total: { source: 'calculated', formula: 'ligne_2_prix_unitaire * ligne_2_quantite', autoFill: true, format: 'currency', label: 'Total ligne 2 (€)' },

    ligne_3_description: { source: 'manual', autoFill: false, required: false, type: 'textarea', label: 'Description ligne 3' },
    ligne_3_prix_unitaire: { source: 'manual', autoFill: false, required: false, type: 'number', format: 'currency', label: 'Prix unitaire ligne 3 (€)' },
    ligne_3_quantite: { source: 'manual', autoFill: false, required: false, type: 'number', defaultValue: 1, label: 'Quantité ligne 3' },
    ligne_3_total: { source: 'calculated', formula: 'ligne_3_prix_unitaire * ligne_3_quantite', autoFill: true, format: 'currency', label: 'Total ligne 3 (€)' },

    // TOTAUX (calculés)
    sous_total: { source: 'calculated', formula: 'ligne_1_total + ligne_2_total + ligne_3_total', autoFill: true, format: 'currency', label: 'Sous-total HT (€)' },
    tva_pourcentage: { source: 'fixed', defaultValue: 20, autoFill: true, label: 'TVA (%)' },
    tva_montant: { source: 'calculated', formula: 'sous_total * (tva_pourcentage / 100)', autoFill: true, format: 'currency', label: 'Montant TVA (€)' },
    total_ttc: { source: 'calculated', formula: 'sous_total + tva_montant', autoFill: true, format: 'currency', label: 'Total TTC (€)' },

    // CONDITIONS (manuel avec défaut)
    validite_jours: { source: 'manual', autoFill: false, required: true, type: 'number', defaultValue: 30, label: 'Validité (jours)' },
    acompte_pourcentage: { source: 'manual', autoFill: false, required: false, type: 'number', defaultValue: 30, label: 'Acompte (%)' },
  };

  let devisTemplate = await prisma.documentTemplate.findUnique({
    where: { slug: 'devis-luxe' },
  });

  if (!devisTemplate) {
    devisTemplate = await prisma.documentTemplate.create({
      data: {
        name: 'Devis Luxe',
        slug: 'devis-luxe',
        type: 'DEVIS',
        category: 'commercial',
        description: 'Devis professionnel avec lignes de prestation détaillées',
        fileName: 'devis.docx',
        filePath: '/documents/devis.docx',
        variables: devisVariables,
        fieldMapping: devisMapping,
        requiresSignature: false,
        isActive: true,
      },
    });
    console.log('✅ Template Devis créé avec mapping');
  } else {
    // Mettre à jour le mapping
    await prisma.documentTemplate.update({
      where: { id: devisTemplate.id },
      data: {
        variables: devisVariables,
        fieldMapping: devisMapping,
      },
    });
    console.log('✅ Template Devis mis à jour avec mapping');
  }

  // 3. Configuration du template Contrat Mannequinat
  console.log('\n3️⃣ Configuration du template CONTRAT MANNEQUINAT...');

  const contratVariables = [
    // Agence
    'nom_agence', 'adresse_agence', 'telephone_agence', 'email_agence', 'siret_agence',
    'forme_juridique', 'capital', 'ville_rcs', 'numero_rcs', 'representant_nom', 'representant_qualite',
    // Contrat info
    'numero_contrat', 'date_debut_contrat', 'duree_contrat', 'delai_renouvellement',
    // Talent
    'prenom_talent', 'nom_talent', 'date_naissance_talent', 'lieu_naissance_talent',
    'nationalite_talent', 'adresse_talent', 'numero_ss_talent',
    // Conditions
    'territoire', 'clause_exclusivite', 'pourcentage_commission', 'delai_paiement', 'preavis_resiliation',
    // Signature
    'lieu_signature', 'date_signature', 'juridiction_competente',
  ];

  const contratMapping = {
    // AGENCE (auto)
    nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true, required: true, label: 'Nom de l\'agence' },
    adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true, required: true, label: 'Adresse agence' },
    telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true, required: true, label: 'Téléphone agence' },
    email_agence: { source: 'agency', field: 'email_agence', autoFill: true, required: true, label: 'Email agence' },
    siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true, required: true, label: 'SIRET' },
    forme_juridique: { source: 'agency', field: 'forme_juridique', autoFill: true, required: true, label: 'Forme juridique' },
    capital: { source: 'agency', field: 'capital', autoFill: true, required: true, label: 'Capital social' },
    ville_rcs: { source: 'agency', field: 'ville_rcs', autoFill: true, required: true, label: 'Ville RCS' },
    numero_rcs: { source: 'agency', field: 'numero_rcs', autoFill: true, required: true, label: 'Numéro RCS' },
    representant_nom: { source: 'agency', field: 'representant_nom', autoFill: true, required: true, label: 'Représentant' },
    representant_qualite: { source: 'agency', field: 'representant_qualite', autoFill: true, required: true, label: 'Qualité représentant' },

    // CONTRAT INFO (auto + manuel)
    numero_contrat: { source: 'auto', field: 'documentNumber', autoFill: true, required: true, label: 'Numéro du contrat' },
    date_debut_contrat: { source: 'manual', autoFill: false, required: true, type: 'date', label: 'Date de début' },
    duree_contrat: { source: 'manual', autoFill: false, required: true, type: 'text', defaultValue: '1 an', placeholder: 'Ex: 1 an, 2 ans', label: 'Durée du contrat' },
    delai_renouvellement: { source: 'manual', autoFill: false, required: true, type: 'text', defaultValue: '3 mois', placeholder: 'Ex: 3 mois', label: 'Délai de renouvellement' },

    // TALENT (auto)
    prenom_talent: { source: 'talent', field: 'prenom_talent', autoFill: true, required: true, fallback: 'name_split_first', label: 'Prénom du talent' },
    nom_talent: { source: 'talent', field: 'nom_talent', autoFill: true, required: true, fallback: 'name_split_last', label: 'Nom du talent' },
    date_naissance_talent: { source: 'talent', field: 'date_naissance', autoFill: true, required: true, format: 'DD/MM/YYYY', label: 'Date de naissance' },
    lieu_naissance_talent: { source: 'talent', field: 'lieu_naissance', autoFill: true, required: true, label: 'Lieu de naissance' },
    nationalite_talent: { source: 'talent', field: 'nationalite', autoFill: true, required: true, defaultValue: 'Française', label: 'Nationalité' },
    adresse_talent: { source: 'talent', field: 'adresse_talent', autoFill: true, required: true, label: 'Adresse du talent' },
    numero_ss_talent: { source: 'talent', field: 'numero_ss_talent', autoFill: true, required: false, sensitive: true, label: 'N° Sécurité Sociale' },

    // CONDITIONS (manuel)
    territoire: { source: 'manual', autoFill: false, required: true, type: 'select', options: ['France', 'Europe', 'Monde'], defaultValue: 'France', label: 'Territoire' },
    clause_exclusivite: { source: 'manual', autoFill: false, required: true, type: 'textarea', placeholder: 'Décrire les conditions...', label: 'Clause d\'exclusivité' },
    pourcentage_commission: { source: 'manual', autoFill: false, required: true, type: 'number', defaultValue: 20, suffix: '%', label: 'Commission (%)' },
    delai_paiement: { source: 'manual', autoFill: false, required: true, type: 'text', defaultValue: '30 jours', placeholder: 'Ex: 30 jours', label: 'Délai de paiement' },
    preavis_resiliation: { source: 'manual', autoFill: false, required: true, type: 'text', defaultValue: '3 mois', placeholder: 'Ex: 3 mois', label: 'Préavis de résiliation' },

    // SIGNATURE (auto + manuel)
    lieu_signature: { source: 'manual', autoFill: false, required: true, type: 'text', defaultValue: 'Paris', label: 'Lieu de signature' },
    date_signature: { source: 'auto', field: 'today', format: 'DD MMMM YYYY', autoFill: true, required: true, label: 'Date de signature' },
    juridiction_competente: { source: 'manual', autoFill: false, required: true, type: 'text', defaultValue: 'Paris', label: 'Juridiction compétente' },
  };

  let contratTemplate = await prisma.documentTemplate.findUnique({
    where: { slug: 'contrat-mannequinat' },
  });

  if (!contratTemplate) {
    contratTemplate = await prisma.documentTemplate.create({
      data: {
        name: 'Contrat Mannequinat',
        slug: 'contrat-mannequinat',
        type: 'CONTRAT',
        category: 'talent',
        description: 'Contrat de mannequinat avec conditions complètes',
        fileName: 'contrat_mannequinat.docx',
        filePath: '/documents/contrat_mannequinat.docx',
        variables: contratVariables,
        fieldMapping: contratMapping,
        requiresSignature: true,
        isActive: true,
      },
    });
    console.log('✅ Template Contrat Mannequinat créé avec mapping');
  } else {
    // Mettre à jour le mapping
    await prisma.documentTemplate.update({
      where: { id: contratTemplate.id },
      data: {
        variables: contratVariables,
        fieldMapping: contratMapping,
      },
    });
    console.log('✅ Template Contrat Mannequinat mis à jour avec mapping');
  }

  console.log('\n✨ Configuration terminée avec succès !');
  console.log('\n📋 Résumé :');
  console.log(`   - AgencySettings configuré`);
  console.log(`   - Template Devis : ${devisVariables.length} champs`);
  console.log(`   - Template Contrat : ${contratVariables.length} champs`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
