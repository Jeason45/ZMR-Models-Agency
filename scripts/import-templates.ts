/**
 * Script d'import des templates DOCX dans la base de données
 * Usage: npx ts-node scripts/import-templates.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Mapping des templates avec leurs métadonnées
const TEMPLATES_CONFIG = [
  {
    fileName: 'Contrat_Mannequinat_Mode.docx',
    name: 'Contrat Mannequinat Mode',
    slug: 'contrat-mannequinat-mode',
    type: 'CONTRAT',
    category: 'talent',
    description: 'Contrat standard pour mannequins mode (défilés, shootings, catalogues)',
    requiresSignature: true,
    variables: ['nom_talent', 'date_naissance', 'adresse', 'date_debut', 'date_fin', 'tarif_journalier', 'type_prestation']
  },
  {
    fileName: 'Contrat_Acting_Publicite.docx',
    name: 'Contrat Acting & Publicité',
    slug: 'contrat-acting-publicite',
    type: 'CONTRAT',
    category: 'talent',
    description: 'Contrat pour comédiens et talents publicitaires',
    requiresSignature: true,
    variables: ['nom_talent', 'projet', 'producteur', 'date_tournage', 'duree', 'cachet']
  },
  {
    fileName: 'Contrat_Hotesse_Promo_VIP.docx',
    name: 'Contrat Hôtesse Promo VIP',
    slug: 'contrat-hotesse-promo-vip',
    type: 'CONTRAT',
    category: 'talent',
    description: 'Contrat pour hôtesses d\'accueil, événementiel et animations',
    requiresSignature: true,
    variables: ['nom_hotesse', 'evenement', 'lieu', 'date', 'horaires', 'tenue', 'tarif_horaire']
  },
  {
    fileName: 'Contrat_Modele_Details.docx',
    name: 'Contrat Modèle Détails',
    slug: 'contrat-modele-details',
    type: 'CONTRAT',
    category: 'talent',
    description: 'Contrat spécifique pour modèles détails (mains, pieds, visage)',
    requiresSignature: true,
    variables: ['nom_modele', 'type_detail', 'campagne', 'client', 'date', 'tarif']
  },
  {
    fileName: 'Contrat_Cadre_Client.docx',
    name: 'Contrat Cadre Client',
    slug: 'contrat-cadre-client',
    type: 'CONTRAT',
    category: 'client',
    description: 'Contrat cadre pour nouveaux clients professionnels',
    requiresSignature: true,
    variables: ['nom_entreprise', 'siret', 'representant', 'adresse', 'conditions_paiement', 'duree']
  },
  {
    fileName: 'Contrat_Cadre_Client_Recurrent.docx',
    name: 'Contrat Cadre Client Récurrent',
    slug: 'contrat-cadre-client-recurrent',
    type: 'CONTRAT',
    category: 'client',
    description: 'Contrat cadre pour clients réguliers avec conditions préférentielles',
    requiresSignature: true,
    variables: ['nom_entreprise', 'volume_annuel', 'remise', 'conditions_speciales']
  },
  {
    fileName: 'Contrat_Mise_A_Disposition_Client.docx',
    name: 'Contrat Mise à Disposition Client',
    slug: 'contrat-mise-disposition-client',
    type: 'CONTRAT',
    category: 'client',
    description: 'Contrat de mise à disposition de talents pour un projet spécifique',
    requiresSignature: true,
    variables: ['client', 'talent_fourni', 'dates', 'tarif_global', 'conditions']
  },
  {
    fileName: 'Contrat_Prestataire_Creatif.docx',
    name: 'Contrat Prestataire Créatif',
    slug: 'contrat-prestataire-creatif',
    type: 'CONTRAT',
    category: 'admin',
    description: 'Contrat pour photographes, maquilleurs, stylistes partenaires',
    requiresSignature: true,
    variables: ['nom_prestataire', 'specialite', 'tarif', 'conditions']
  },
  {
    fileName: 'Contrat_Prestataire_Freelance.docx',
    name: 'Contrat Prestataire Freelance',
    slug: 'contrat-prestataire-freelance',
    type: 'CONTRAT',
    category: 'admin',
    description: 'Contrat pour freelances et consultants externes',
    requiresSignature: true,
    variables: ['nom', 'mission', 'duree', 'tjm', 'livrables']
  },
  {
    fileName: 'Contrat_Test_Shoot_Book_Agreement.docx',
    name: 'Contrat Test Shoot / Book Agreement',
    slug: 'contrat-test-shoot',
    type: 'CONTRAT',
    category: 'talent',
    description: 'Convention pour test shoots et création de books',
    requiresSignature: true,
    variables: ['nom_talent', 'photographe', 'date', 'lieu', 'usage_photos']
  },
  {
    fileName: 'Facture_Modele.docx',
    name: 'Facture',
    slug: 'facture',
    type: 'FACTURE',
    category: 'commercial',
    description: 'Facture standard avec mentions légales',
    requiresSignature: false,
    variables: ['numero_facture', 'date', 'client', 'prestations', 'montant_ht', 'tva', 'montant_ttc', 'echeance']
  },
  {
    fileName: 'Devis_Proposition_Commerciale.docx',
    name: 'Devis / Proposition Commerciale',
    slug: 'devis',
    type: 'DEVIS',
    category: 'commercial',
    description: 'Devis détaillé pour prestations de talents',
    requiresSignature: false,
    variables: ['numero_devis', 'date', 'client', 'prestations', 'tarifs', 'total_ht', 'validite']
  },
  {
    fileName: 'Conditions_Generales_Vente_CGV.docx',
    name: 'Conditions Générales de Vente (CGV)',
    slug: 'cgv',
    type: 'ADMINISTRATIF',
    category: 'admin',
    description: 'CGV de l\'agence (annexe aux contrats clients)',
    requiresSignature: false,
    variables: ['date_version']
  },
  {
    fileName: 'Avenant_Amendment.docx',
    name: 'Avenant / Amendment',
    slug: 'avenant',
    type: 'ADMINISTRATIF',
    category: 'admin',
    description: 'Avenant pour modifier un contrat existant',
    requiresSignature: true,
    variables: ['contrat_original', 'date_avenant', 'modifications', 'parties']
  },
  {
    fileName: 'Autorisation_Parentale_Mineur.docx',
    name: 'Autorisation Parentale Mineur',
    slug: 'autorisation-parentale',
    type: 'ADMINISTRATIF',
    category: 'talent',
    description: 'Autorisation obligatoire pour talents mineurs',
    requiresSignature: true,
    variables: ['nom_mineur', 'date_naissance', 'nom_parent', 'lien_parente', 'projet', 'date']
  },
  {
    fileName: 'Ordre_De_Mission.docx',
    name: 'Ordre de Mission',
    slug: 'ordre-mission',
    type: 'ADMINISTRATIF',
    category: 'admin',
    description: 'Ordre de mission pour une prestation spécifique',
    requiresSignature: false,
    variables: ['talent', 'client', 'date', 'lieu', 'horaires', 'contact_client', 'instructions']
  },
  {
    fileName: 'Welcome_Pack_Talent.docx',
    name: 'Welcome Pack Talent',
    slug: 'welcome-pack',
    type: 'ADMINISTRATIF',
    category: 'talent',
    description: 'Pack d\'accueil pour nouveaux talents (guide, conseils, process)',
    requiresSignature: false,
    variables: ['nom_talent', 'date_inscription', 'agent_referent']
  },
  {
    fileName: 'Fiche_Talent_Casting_Sheet.docx',
    name: 'Fiche Talent / Casting Sheet',
    slug: 'fiche-talent',
    type: 'ADMINISTRATIF',
    category: 'talent',
    description: 'Fiche descriptive complète du talent (mensurations, expérience)',
    requiresSignature: false,
    variables: ['nom', 'mensurations', 'experience', 'competences', 'disponibilites']
  },
  {
    fileName: 'Casting_Sheet_Fiche_Talent.docx',
    name: 'Casting Sheet',
    slug: 'casting-sheet',
    type: 'ADMINISTRATIF',
    category: 'talent',
    description: 'Fiche de casting pour projet client',
    requiresSignature: false,
    variables: ['projet', 'client', 'profil_recherche', 'dates', 'tarif']
  },
  {
    fileName: 'Feuille_De_Presence_Timesheet.docx',
    name: 'Feuille de Présence / Timesheet',
    slug: 'timesheet',
    type: 'ADMINISTRATIF',
    category: 'admin',
    description: 'Relevé d\'heures de prestation pour facturation',
    requiresSignature: true,
    variables: ['talent', 'projet', 'dates', 'horaires', 'total_heures']
  },
  {
    fileName: 'Grille_Tarifaire_Rate_Card.docx',
    name: 'Grille Tarifaire / Rate Card',
    slug: 'grille-tarifaire',
    type: 'ADMINISTRATIF',
    category: 'commercial',
    description: 'Tarifs officiels de l\'agence par type de prestation',
    requiresSignature: false,
    variables: ['annee', 'tarifs_mannequins', 'tarifs_acting', 'tarifs_hotesses']
  },
  {
    fileName: 'Dossier_De_Presse_Press_Kit.docx',
    name: 'Dossier de Presse / Press Kit',
    slug: 'dossier-presse',
    type: 'ADMINISTRATIF',
    category: 'commercial',
    description: 'Dossier de presse de l\'agence (présentation, talents phares)',
    requiresSignature: false,
    variables: ['date', 'talents_vedettes', 'clients_references']
  },
];

async function importTemplates() {
  console.log('🚀 Import des templates de documents...\n');

  const templatesDir = path.join(process.cwd(), 'storage', 'templates');

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const config of TEMPLATES_CONFIG) {
    try {
      const filePath = path.join(templatesDir, config.fileName);

      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        console.log(`❌ Fichier introuvable: ${config.fileName}`);
        errors++;
        continue;
      }

      // Vérifier si le template existe déjà
      const existing = await prisma.documentTemplate.findUnique({
        where: { slug: config.slug }
      });

      if (existing) {
        console.log(`⏭️  Déjà importé: ${config.name}`);
        skipped++;
        continue;
      }

      // Créer le template dans la DB
      await prisma.documentTemplate.create({
        data: {
          name: config.name,
          slug: config.slug,
          type: config.type,
          category: config.category,
          description: config.description,
          fileName: config.fileName,
          filePath: `storage/templates/${config.fileName}`,
          variables: config.variables,
          requiresSignature: config.requiresSignature,
          isActive: true,
        }
      });

      console.log(`✅ Importé: ${config.name}`);
      imported++;

    } catch (error) {
      console.error(`❌ Erreur pour ${config.fileName}:`, error);
      errors++;
    }
  }

  console.log('\n📊 Résumé:');
  console.log(`  ✅ Importés: ${imported}`);
  console.log(`  ⏭️  Déjà existants: ${skipped}`);
  console.log(`  ❌ Erreurs: ${errors}`);
  console.log(`  📦 Total: ${TEMPLATES_CONFIG.length}`);
}

// Exécuter l'import
importTemplates()
  .then(() => {
    console.log('\n✨ Import terminé!');
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    prisma.$disconnect();
    process.exit(1);
  });
