/**
 * Script pour vérifier le fieldMapping d'un template
 */

import { prisma } from '../lib/prisma';

async function checkTemplateMapping() {
  console.log('🔍 Vérification du mapping des templates...\n');

  const templates = await prisma.documentTemplate.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      fieldMapping: true
    }
  });

  for (const template of templates) {
    console.log(`📄 Template: ${template.name}`);
    console.log(`   Slug: ${template.slug}\n`);

    const mapping = template.fieldMapping as Record<string, any>;

    // Vérifier les champs spécifiques
    const fieldsToCheck = [
      'capital',
      'ville_rcs',
      'numero_rcs',
      'forme_juridique',
      'validite_devis',
      'delai_paiement',
      'acompte_pourcentage'
    ];

    console.log('   Champs vérifiés:');
    for (const field of fieldsToCheck) {
      if (mapping[field]) {
        const config = mapping[field];
        console.log(`   ✅ ${field}:`);
        console.log(`      - source: ${config.source}`);
        console.log(`      - field: ${config.field || 'N/A'}`);
        console.log(`      - autoFill: ${config.autoFill}`);
        console.log(`      - defaultValue: ${config.defaultValue || 'N/A'}`);
      } else {
        console.log(`   ❌ ${field}: NON TROUVÉ`);
      }
    }
    console.log('\n' + '='.repeat(60) + '\n');
  }
}

checkTemplateMapping()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
