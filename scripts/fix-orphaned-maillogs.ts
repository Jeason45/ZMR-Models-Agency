import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrphanedMailLogs() {
  try {
    console.log('Fixing orphaned mail_logs...');

    // Find all mail_logs with contactId that don't exist in contacts
    const result = await prisma.$executeRaw`
      UPDATE mail_logs
      SET "contactId" = NULL
      WHERE "contactId" IS NOT NULL
      AND "contactId" NOT IN (SELECT id FROM contacts)
    `;

    console.log(`✓ Fixed ${result} orphaned mail_logs records`);
  } catch (error) {
    console.error('Error fixing orphaned mail_logs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixOrphanedMailLogs();
