import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// Initialiser le client S3 pour R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const prisma = new PrismaClient();

// Fonction pour uploader un fichier vers R2
async function uploadFileToR2(localFilePath: string, r2Key: string): Promise<string> {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const ext = path.extname(localFilePath).toLowerCase();

    // Déterminer le Content-Type
    let contentType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.mov') contentType = 'video/quicktime';
    else if (ext === '.avi') contentType = 'video/x-msvideo';

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileContent,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Retourner l'URL publique
    return `${R2_PUBLIC_URL}/${r2Key}`;
  } catch (error) {
    console.error(`Erreur lors de l'upload de ${localFilePath}:`, error);
    throw error;
  }
}

// Fonction pour parcourir un dossier récursivement
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

async function migrateToR2() {
  console.log('🚀 Démarrage de la migration vers R2...\n');

  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'models');

  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ Le dossier uploads/models n\'existe pas');
    return;
  }

  // Récupérer tous les fichiers
  const allFiles = getAllFiles(uploadsDir);
  console.log(`📁 ${allFiles.length} fichiers trouvés dans uploads/models\n`);

  // Map pour stocker les anciennes URLs et les nouvelles
  const urlMapping: { [key: string]: string } = {};

  // Uploader chaque fichier
  let successCount = 0;
  let errorCount = 0;

  for (const localFilePath of allFiles) {
    try {
      // Créer le chemin R2 en gardant la structure
      const relativePath = path.relative(
        path.join(__dirname, '..', 'public'),
        localFilePath
      );
      const r2Key = relativePath.replace(/\\/g, '/'); // Windows compatibility

      console.log(`⬆️  Uploading: ${relativePath}`);

      const r2Url = await uploadFileToR2(localFilePath, r2Key);

      // Mapper l'ancienne URL vers la nouvelle
      const oldUrl = '/' + relativePath.replace(/\\/g, '/');
      urlMapping[oldUrl] = r2Url;

      console.log(`   ✅ Uploaded to: ${r2Url}\n`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Erreur:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Résumé de la migration:');
  console.log(`   ✅ Fichiers uploadés avec succès: ${successCount}`);
  console.log(`   ❌ Erreurs: ${errorCount}`);

  // Sauvegarder le mapping dans un fichier JSON
  const mappingPath = path.join(__dirname, 'url-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(urlMapping, null, 2));
  console.log(`\n💾 Mapping des URLs sauvegardé dans: ${mappingPath}`);

  // Mettre à jour les URLs dans la base de données
  console.log('\n🔄 Mise à jour des URLs dans la base de données...');

  const talents = await prisma.talent.findMany();
  let updatedCount = 0;

  for (const talent of talents) {
    const updates: any = {};
    let hasUpdates = false;

    // Fonction helper pour remplacer les URLs
    const replaceUrl = (url: string | null): string | null => {
      if (!url) return null;
      return urlMapping[url] || url;
    };

    const replaceUrlArray = (urls: string[] | null): string[] | null => {
      if (!urls || !Array.isArray(urls)) return urls;
      return urls.map(url => urlMapping[url] || url);
    };

    // Remplacer toutes les URLs d'images et vidéos
    if (talent.mainImage) {
      updates.mainImage = replaceUrl(talent.mainImage);
      if (updates.mainImage !== talent.mainImage) hasUpdates = true;
    }
    if (talent.hoverImage) {
      updates.hoverImage = replaceUrl(talent.hoverImage);
      if (updates.hoverImage !== talent.hoverImage) hasUpdates = true;
    }
    if (talent.heroImage) {
      updates.heroImage = replaceUrl(talent.heroImage);
      if (updates.heroImage !== talent.heroImage) hasUpdates = true;
    }
    if (talent.heroVideo) {
      updates.heroVideo = replaceUrl(talent.heroVideo);
      if (updates.heroVideo !== talent.heroVideo) hasUpdates = true;
    }
    if (talent.galleryImages) {
      updates.galleryImages = replaceUrlArray(talent.galleryImages as string[]);
      if (JSON.stringify(updates.galleryImages) !== JSON.stringify(talent.galleryImages)) hasUpdates = true;
    }
    if (talent.portfolioImage) {
      updates.portfolioImage = replaceUrl(talent.portfolioImage);
      if (updates.portfolioImage !== talent.portfolioImage) hasUpdates = true;
    }
    if (talent.portfolioGallery) {
      updates.portfolioGallery = replaceUrlArray(talent.portfolioGallery as string[]);
      if (JSON.stringify(updates.portfolioGallery) !== JSON.stringify(talent.portfolioGallery)) hasUpdates = true;
    }
    if (talent.instagramImage) {
      updates.instagramImage = replaceUrl(talent.instagramImage);
      if (updates.instagramImage !== talent.instagramImage) hasUpdates = true;
    }
    if (talent.showsImage) {
      updates.showsImage = replaceUrl(talent.showsImage);
      if (updates.showsImage !== talent.showsImage) hasUpdates = true;
    }
    if (talent.showsVideo) {
      updates.showsVideo = replaceUrl(talent.showsVideo);
      if (updates.showsVideo !== talent.showsVideo) hasUpdates = true;
    }
    if (talent.showreelVideo) {
      updates.showreelVideo = replaceUrl(talent.showreelVideo);
      if (updates.showreelVideo !== talent.showreelVideo) hasUpdates = true;
    }
    if (talent.showreelImage) {
      updates.showreelImage = replaceUrl(talent.showreelImage);
      if (updates.showreelImage !== talent.showreelImage) hasUpdates = true;
    }
    if (talent.reelsGallery) {
      updates.reelsGallery = replaceUrlArray(talent.reelsGallery as string[]);
      if (JSON.stringify(updates.reelsGallery) !== JSON.stringify(talent.reelsGallery)) hasUpdates = true;
    }
    if (talent.creditsImage) {
      updates.creditsImage = replaceUrl(talent.creditsImage);
      if (updates.creditsImage !== talent.creditsImage) hasUpdates = true;
    }
    if (talent.collaborationsImage) {
      updates.collaborationsImage = replaceUrl(talent.collaborationsImage);
      if (updates.collaborationsImage !== talent.collaborationsImage) hasUpdates = true;
    }
    if (talent.eventsImage) {
      updates.eventsImage = replaceUrl(talent.eventsImage);
      if (updates.eventsImage !== talent.eventsImage) hasUpdates = true;
    }
    if (talent.eventsGallery) {
      updates.eventsGallery = replaceUrlArray(talent.eventsGallery as string[]);
      if (JSON.stringify(updates.eventsGallery) !== JSON.stringify(talent.eventsGallery)) hasUpdates = true;
    }
    if (talent.socialImage) {
      updates.socialImage = replaceUrl(talent.socialImage);
      if (updates.socialImage !== talent.socialImage) hasUpdates = true;
    }
    if (talent.campaignsImage) {
      updates.campaignsImage = replaceUrl(talent.campaignsImage);
      if (updates.campaignsImage !== talent.campaignsImage) hasUpdates = true;
    }

    if (hasUpdates) {
      await prisma.talent.update({
        where: { id: talent.id },
        data: updates,
      });
      console.log(`   ✅ Mis à jour: ${talent.name}`);
      updatedCount++;
    }
  }

  console.log(`\n✅ ${updatedCount} talents mis à jour dans la base de données`);
  console.log('\n🎉 Migration terminée avec succès !');

  await prisma.$disconnect();
}

// Exécuter la migration
migrateToR2().catch((error) => {
  console.error('❌ Erreur lors de la migration:', error);
  process.exit(1);
});
