import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Restoring models to talents table...');

  // Read backup file
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const backupPath = path.join(__dirname, 'models-backup.json');

  if (!fs.existsSync(backupPath)) {
    console.error('Backup file not found!');
    return;
  }

  const modelsData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  console.log(`Found ${modelsData.length} models in backup`);

  for (const model of modelsData) {
    try {
      await prisma.talent.create({
        data: {
          id: model.id,
          type: 'MODELS',
          name: model.name,
          slug: model.slug,
          category: model.category,
          status: model.status,
          mainImage: model.mainImage,
          hoverImage: model.hoverImage,
          heroVideo: model.heroVideo,
          galleryImages: model.galleryImages,
          portfolioImage: model.portfolioImage,
          portfolioGallery: model.portfolioGallery,
          instagramImage: model.instagramImage,
          instagramUrl: model.instagramUrl,
          showsImage: model.showsImage,
          showsVideo: model.showsVideo,
          height: model.height,
          neck: model.neck,
          bust: model.bust,
          chest: model.chest,
          waist: model.waist,
          hips: model.hips,
          suit: model.suit,
          inseam: model.inseam,
          shoes: model.shoes,
          eyes: model.eyes,
          hair: model.hair,
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
        },
      });
      console.log(`✓ Restored: ${model.name}`);
    } catch (error) {
      console.error(`✗ Error restoring ${model.name}:`, error);
    }
  }

  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
