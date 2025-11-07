/**
 * Script pour initialiser les paramètres de l'agence si ils n'existent pas
 */

import { prisma } from '../lib/prisma';

async function initAgencySettings() {
  console.log('🔍 Vérification des paramètres AgencySettings...\n');

  const existing = await prisma.agencySettings.findFirst();

  if (existing) {
    console.log('✅ AgencySettings existe déjà');
    console.log('   ID:', existing.id);
    console.log('   Nom:', existing.nom_agence);
    console.log('\n💡 Pour modifier les paramètres, allez sur /admin/settings/agency\n');
    return;
  }

  console.log('⚠️  Aucun AgencySettings trouvé. Création...\n');

  const settings = await prisma.agencySettings.create({
    data: {
      // Informations de base
      nom_agence: 'ZMR Models Agency',
      adresse_agence: '123 Avenue des Champs-Élysées',
      telephone_agence: '+33 1 23 45 67 89',
      email_agence: 'contact@zmr-models.com',
      site_web_agence: 'https://zmr-models.com',

      // Informations juridiques
      siret_agence: '123 456 789 00012',
      forme_juridique: 'SARL',
      capital: '10 000 EUR',
      ville_rcs: 'Paris',
      numero_rcs: '123 456 789',

      // Représentant légal
      representant_nom: 'Jean Dupont',
      representant_qualite: 'Gérant',

      // Paramètres par défaut (déjà définis dans le schéma avec @default)
      tva_par_defaut: 20.0,
      delai_paiement_defaut: '30 jours',
      validite_devis_defaut: 30
    }
  });

  console.log('✅ AgencySettings créé avec succès !');
  console.log('   ID:', settings.id);
  console.log('\n⚠️  IMPORTANT : Ces données sont des exemples.');
  console.log('   Allez sur /admin/settings/agency pour les personnaliser.\n');
}

initAgencySettings()
  .then(() => {
    console.log('✅ Terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
