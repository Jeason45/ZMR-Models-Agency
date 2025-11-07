/**
 * Script pour vérifier les valeurs AgencySettings
 */

import { prisma } from '../lib/prisma';

async function checkAgencySettings() {
  console.log('🔍 Vérification des paramètres AgencySettings...\n');

  const settings = await prisma.agencySettings.findFirst();

  if (!settings) {
    console.log('❌ Aucun AgencySettings trouvé\n');
    return;
  }

  console.log('📋 Paramètres actuels :\n');
  console.log('Informations de base:');
  console.log('  - Nom agence:', settings.nom_agence);
  console.log('  - Adresse:', settings.adresse_agence);
  console.log('  - Téléphone:', settings.telephone_agence);
  console.log('  - Email:', settings.email_agence);
  console.log('  - Site web:', settings.site_web_agence || '(vide)');
  console.log('\nInformations juridiques:');
  console.log('  - SIRET:', settings.siret_agence);
  console.log('  - Forme juridique:', settings.forme_juridique || '❌ VIDE');
  console.log('  - Capital:', settings.capital || '❌ VIDE');
  console.log('  - Ville RCS:', settings.ville_rcs || '❌ VIDE');
  console.log('  - Numéro RCS:', settings.numero_rcs || '❌ VIDE');
  console.log('\nReprésentant légal:');
  console.log('  - Nom:', settings.representant_nom);
  console.log('  - Qualité:', settings.representant_qualite);
  console.log('\nParamètres par défaut:');
  console.log('  - TVA par défaut:', settings.tva_par_defaut, '%');
  console.log('  - Délai paiement:', settings.delai_paiement_defaut);
  console.log('  - Validité devis:', settings.validite_devis_defaut, 'jours');

  // Vérifier les champs manquants
  const missingFields = [];
  if (!settings.forme_juridique) missingFields.push('forme_juridique');
  if (!settings.capital) missingFields.push('capital');
  if (!settings.ville_rcs) missingFields.push('ville_rcs');
  if (!settings.numero_rcs) missingFields.push('numero_rcs');

  if (missingFields.length > 0) {
    console.log('\n⚠️  Champs manquants:', missingFields.join(', '));
    console.log('💡 Allez sur /admin/settings/agency pour les remplir\n');
  } else {
    console.log('\n✅ Tous les champs sont remplis !\n');
  }
}

checkAgencySettings()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
