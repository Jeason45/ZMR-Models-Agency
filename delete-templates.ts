import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteTemplates() {
  await prisma.documentTemplate.deleteMany({});
  console.log('✅ Tous les templates supprimés');
  await prisma.$disconnect();
}

deleteTemplates();
