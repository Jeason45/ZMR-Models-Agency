import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script pour ajouter les positions aux editableFields existants
 * Les positions par défaut seront ajustables via l'interface admin
 */

async function main() {
  console.log('🔧 Ajout des positions aux editableFields existants...\n');

  // Récupérer tous les templates avec editableFields
  const templates = await prisma.documentTemplate.findMany({
    where: {
      editableFields: {
        not: null
      }
    }
  });

  console.log(`📋 ${templates.length} template(s) avec editableFields trouvé(s)\n`);

  for (const template of templates) {
    const fields = template.editableFields as any[];

    if (!fields || fields.length === 0) {
      console.log(`⚠️  "${template.name}" n'a pas de champs, skip.`);
      continue;
    }

    console.log(`✏️  Mise à jour de "${template.name}"...`);
    console.log(`   ${fields.length} champ(s) trouvé(s)`);

    // Ajouter les positions par défaut à chaque champ
    // Les champs seront placés verticalement avec un espacement de 60px
    let currentY = 150; // Position Y de départ (en haut du document)
    const startX = 100; // Position X (marge gauche)
    const fieldWidth = 400; // Largeur des champs
    const fieldHeight = 40; // Hauteur des champs
    const spacing = 60; // Espacement vertical entre les champs

    const updatedFields = fields.map((field, index) => {
      // Si le champ a déjà une position, ne pas la remplacer
      if (field.position) {
        return field;
      }

      const positionY = currentY + (index * spacing);

      return {
        ...field,
        position: {
          page: 1, // Première page par défaut
          x: startX,
          y: positionY,
          width: fieldWidth,
          height: fieldHeight
        }
      };
    });

    // Mettre à jour le template
    await prisma.documentTemplate.update({
      where: { id: template.id },
      data: {
        editableFields: updatedFields as any
      }
    });

    console.log(`✅ Positions ajoutées pour ${updatedFields.length} champ(s)`);
    updatedFields.forEach((field, index) => {
      console.log(`   ${index + 1}. ${field.label} -> Page ${field.position.page}, X:${field.position.x}, Y:${field.position.y}`);
    });
    console.log('');
  }

  console.log('🎉 Migration terminée!');
  console.log('\n💡 Note: Les positions par défaut ont été ajoutées.');
  console.log('   Vous pourrez les ajuster via l\'interface admin de configuration des templates.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
