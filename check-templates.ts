import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTemplates() {
  try {
    console.log('🔍 Vérification des templates de documents...\n');

    const templates = await prisma.documentTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (templates.length === 0) {
      console.log('❌ AUCUN TEMPLATE trouvé dans la base de données !');
      console.log('\n⚠️  Les templates ont été perdus avec la suppression de Supabase.\n');
      return;
    }

    console.log(`✅ ${templates.length} templates trouvés:\n`);

    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name}`);
      console.log(`   Type: ${template.type}`);
      console.log(`   Format: ${template.format}`);
      console.log(`   Slug: ${template.slug}`);
      console.log(`   Active: ${template.isActive ? '✓' : '✗'}`);
      console.log(`   File: ${template.fileName || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplates();
