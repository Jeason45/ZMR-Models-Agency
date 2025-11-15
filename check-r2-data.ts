import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check documents
    const totalDocs = await prisma.document.count();
    const docsWithR2 = await prisma.document.count({
      where: {
        filePath: {
          contains: 'r2.dev'
        }
      }
    });

    console.log('\n📊 STATISTIQUES R2 - DOCUMENTS:\n');
    console.log(`Documents totaux: ${totalDocs}`);
    console.log(`Documents avec R2: ${docsWithR2}`);
    console.log(`Documents locaux/autres: ${totalDocs - docsWithR2}\n`);

    // Exemples de documents
    const sampleDocs = await prisma.document.findMany({
      take: 5,
      select: {
        id: true,
        fileName: true,
        filePath: true,
        type: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📄 Derniers documents:');
    sampleDocs.forEach(doc => {
      const isR2 = doc.filePath?.includes('r2.dev');
      const location = isR2 ? '[R2]' : (doc.filePath?.startsWith('http') ? '[URL]' : '[LOCAL]');
      console.log(`  - ${doc.fileName} (${doc.type}) ${location}`);
      if (!isR2 && doc.filePath) {
        console.log(`    Path: ${doc.filePath.substring(0, 80)}...`);
      }
    });

    console.log('\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
