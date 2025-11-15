import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAgencySettings() {
  try {
    // Vérifier si existe déjà
    const existing = await prisma.agencySettings.findFirst();

    if (existing) {
      console.log('✓ Les paramètres de l\'agence existent déjà');
      console.log(`  Nom: ${existing.nom_agence}`);
      return;
    }

    // Créer les paramètres par défaut
    const settings = await prisma.agencySettings.create({
      data: {
        nom_agence: 'ZMR Models Agency',
        adresse_agence: '123 Avenue des Champs-Élysées, 75008 Paris',
        telephone_agence: '+33 1 23 45 67 89',
        email_agence: 'contact@zmrmodels.com',
        site_web_agence: 'https://zmrmodels.com',

        // Informations juridiques
        siret_agence: '123 456 789 00012',
        forme_juridique: 'SARL',
        capital: '10 000 EUR',
        ville_rcs: 'Paris',
        numero_rcs: '123 456 789',

        // Représentant légal
        representant_nom: 'Rémy MARTIN',
        representant_qualite: 'Gérant',

        // Paramètres par défaut
        tva_par_defaut: 20.0,
        delai_paiement_defaut: '30 jours',
        validite_devis_defaut: 30
      }
    });

    console.log('✅ Paramètres de l\'agence créés avec succès !');
    console.log(`  ID: ${settings.id}`);
    console.log(`  Nom: ${settings.nom_agence}`);
    console.log(`  Email: ${settings.email_agence}`);
    console.log(`  SIRET: ${settings.siret_agence}`);

    console.log('\n⚠️  IMPORTANT: Modifiez ces informations via l\'interface admin dans Paramètres → Agence');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAgencySettings();
