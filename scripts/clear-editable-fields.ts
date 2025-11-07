import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Nettoyage de tous les editableFields...\n');

  // Mettre à jour tous les templates pour vider editableFields
  const result = await prisma.documentTemplate.updateMany({
    data: {
      editableFields: null
    }
  });

  console.log(`✅ ${result.count} template(s) nettoyé(s)`);
  console.log('\n💡 Les templates sont maintenant prêts pour la configuration manuelle.');
  console.log('   Utilisez l\'éditeur admin pour placer les champs sur chaque document.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
