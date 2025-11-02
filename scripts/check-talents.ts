import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTalents() {
  try {
    const talents = await prisma.talent.findMany();
    console.log('📊 Nombre de talents:', talents.length);

    if (talents.length > 0) {
      console.log('\n✅ Talents trouvés:');
      talents.forEach(t => {
        console.log(`  - ${t.name} (${t.type}) - slug: ${t.slug}`);
      });
    } else {
      console.log('\n⚠️  AUCUN TALENT TROUVÉ !');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkTalents();
