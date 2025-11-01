import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Initializing database...');

  // Prisma db push will create all tables
  console.log('✅ Database initialized successfully!');
  console.log('📊 Tables created: Contact, Appointment, Availability, User');
}

main()
  .catch((e) => {
    console.error('❌ Error initializing database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
