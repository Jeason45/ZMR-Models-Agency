import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script pour vérifier les valeurs filePath dans la DB
 */

async function main() {
  console.log('🔍 Vérification des filePaths dans la base de données...\n');

  const templates = await prisma.documentTemplate.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      fileName: true,
      filePath: true
    }
  });

  console.log(`📋 ${templates.length} template(s) trouvé(s)\n`);

  for (const template of templates) {
    const filePathValue = template.filePath;
    const filePathType = typeof filePathValue;
    const filePathLength = filePathValue ? filePathValue.length : 0;
    const isNull = filePathValue === null;
    const isEmptyString = filePathValue === '';
    const isTrimmedEmpty = filePathValue ? filePathValue.trim() === '' : false;

    console.log(`\n📄 ${template.name}`);
    console.log(`   ID: ${template.id}`);
    console.log(`   Slug: ${template.slug}`);
    console.log(`   fileName: ${template.fileName || '(null)'}`);
    console.log(`   filePath: "${filePathValue}"`);
    console.log(`   - Type: ${filePathType}`);
    console.log(`   - Length: ${filePathLength}`);
    console.log(`   - Is null: ${isNull}`);
    console.log(`   - Is empty string: ${isEmptyString}`);
    console.log(`   - Is trimmed empty: ${isTrimmedEmpty}`);
  }

  console.log('\n✨ Vérification terminée!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
