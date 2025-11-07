/**
 * Script pour nettoyer et recréer les templates de documents
 * Supprime tous les anciens templates et recrée seulement devis.docx et contrat_mannequinat.docx
 */

import { prisma } from '../lib/prisma';
import { DocumentDataMapper } from '../lib/documentDataMapper';

async function resetTemplates() {
  console.log('🗑️  Nettoyage des anciens templates...\n');

  // Supprimer tous les templates existants
  const deleted = await prisma.documentTemplate.deleteMany({});
  console.log(`✅ ${deleted.count} templates supprimés\n`);

  console.log('📄 Création des nouveaux templates...\n');

  // Variables pour DEVIS (EXACTEMENT comme dans devis.docx)
  const devisVariables = [
    // Agence
    'nom_agence', 'adresse_agence', 'telephone_agence', 'email_agence', 'siret_agence',

    // Devis
    'date_devis', 'numero_devis',

    // Client
    'nom_client', 'adresse_client', 'telephone_client', 'email_client', 'site_web_client',

    // Destinataire
    'nom_destinataire', 'adresse_destinataire', 'telephone_destinataire', 'email_destinataire',

    // Lignes (3 lignes)
    'ligne_1_description', 'ligne_1_prix_unitaire', 'ligne_1_quantite', 'ligne_1_total',
    'ligne_2_description', 'ligne_2_prix_unitaire', 'ligne_2_quantite', 'ligne_2_total',
    'ligne_3_description', 'ligne_3_prix_unitaire', 'ligne_3_quantite', 'ligne_3_total',

    // Totaux
    'sous_total', 'tva_pourcentage', 'tva_montant', 'total_ttc',

    // Conditions
    'validite_jours', 'acompte_pourcentage'
  ];

  // Variables pour CONTRAT MANNEQUINAT (EXACTEMENT comme dans contrat_mannequinat.docx)
  const contratVariables = [
    // Agence
    'nom_agence', 'adresse_agence', 'telephone_agence', 'email_agence', 'siret_agence',
    'forme_juridique', 'capital', 'ville_rcs', 'numero_rcs',
    'representant_nom', 'representant_qualite',

    // Contrat
    'numero_contrat', 'date_debut_contrat', 'duree_contrat', 'delai_renouvellement',

    // Talent
    'prenom_talent', 'nom_talent', 'date_naissance_talent', 'lieu_naissance_talent',
    'nationalite_talent', 'adresse_talent', 'numero_ss_talent',

    // Conditions
    'territoire', 'clause_exclusivite', 'pourcentage_commission', 'delai_paiement',
    'preavis_resiliation',

    // Signature
    'lieu_signature', 'date_signature', 'juridiction_competente'
  ];

  // Créer le mapping pour DEVIS
  const devisMapping = DocumentDataMapper.createDefaultMapping(
    devisVariables,
    'DEVIS',
    'commercial'
  );

  // Créer le template DEVIS
  const devisTemplate = await prisma.documentTemplate.create({
    data: {
      name: 'Devis Commercial',
      slug: 'devis-commercial',
      fileName: 'devis.docx',
      description: 'Devis pour prestations de mannequins et talents',
      type: 'DEVIS',
      category: 'commercial',
      variables: devisVariables,
      fieldMapping: devisMapping as any,
      filePath: '/documents/devis.docx',
      requiresSignature: false,
      isActive: true
    }
  });

  console.log(`✅ Template DEVIS créé (${devisVariables.length} champs)`);

  // Créer le mapping pour CONTRAT
  const contratMapping = DocumentDataMapper.createDefaultMapping(
    contratVariables,
    'CONTRAT',
    'talent'
  );

  // Créer le template CONTRAT
  const contratTemplate = await prisma.documentTemplate.create({
    data: {
      name: 'Contrat de Mannequinat',
      slug: 'contrat-mannequinat',
      fileName: 'contrat_mannequinat.docx',
      description: 'Contrat de représentation exclusive pour mannequins',
      type: 'CONTRAT',
      category: 'talent',
      variables: contratVariables,
      fieldMapping: contratMapping as any,
      filePath: '/documents/contrat_mannequinat.docx',
      requiresSignature: true,
      isActive: true
    }
  });

  console.log(`✅ Template CONTRAT créé (${contratVariables.length} champs)\n`);

  console.log('✨ Templates recréés avec succès !\n');
  console.log('📋 Résumé :');
  console.log(`   - Devis Commercial: ${devisVariables.length} champs`);
  console.log(`   - Contrat Mannequinat: ${contratVariables.length} champs`);
}

resetTemplates()
  .then(() => {
    console.log('\n✅ Terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
