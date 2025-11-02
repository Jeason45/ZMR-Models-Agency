import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration from models to talents...');

  // Get all existing models
  const models = await prisma.$queryRaw<any[]>`SELECT * FROM models`;

  console.log(`Found ${models.length} models to migrate`);

  if (models.length === 0) {
    console.log('No models to migrate');
    return;
  }

  // Store models data temporarily
  const modelsData = models.map(model => ({
    ...model,
    type: 'MODELS' // Add the type field
  }));

  console.log('Models data saved. Now applying schema changes...');
  console.log('Please run: DATABASE_URL="..." npx prisma db push --accept-data-loss');
  console.log('Then run this script with --restore flag');

  // Save to JSON file for restoration
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const backupPath = path.join(__dirname, 'models-backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(modelsData, null, 2));
  console.log(`Backup saved to: ${backupPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
