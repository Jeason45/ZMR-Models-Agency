import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

// Charger .env.local
dotenv.config({ path: '.env.local' });

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;

console.log('Config R2:', {
  accountId: R2_ACCOUNT_ID ? '✓' : '✗',
  accessKey: R2_ACCESS_KEY_ID ? '✓' : '✗',
  secretKey: R2_SECRET_ACCESS_KEY ? '✓' : '✗',
  bucket: R2_BUCKET_NAME || 'MISSING'
});

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function listR2Contents() {
  try {
    console.log('🔍 Vérification du contenu de R2...\n');

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 1000,
    });

    const response = await r2Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      console.log('❌ Le bucket R2 est VIDE');
      return;
    }

    console.log(`✅ Trouvé ${response.Contents.length} fichiers dans R2:\n`);

    // Grouper par dossier
    const byFolder: Record<string, any[]> = {};

    response.Contents.forEach(item => {
      const key = item.Key || '';
      const folder = key.includes('/') ? key.split('/')[0] : 'root';

      if (!byFolder[folder]) {
        byFolder[folder] = [];
      }

      byFolder[folder].push({
        key,
        size: item.Size,
        modified: item.LastModified
      });
    });

    // Afficher par dossier
    Object.entries(byFolder).forEach(([folder, files]) => {
      console.log(`\n📁 ${folder}/ (${files.length} fichiers)`);
      files.forEach(file => {
        const sizeMB = ((file.size || 0) / 1024 / 1024).toFixed(2);
        console.log(`  - ${file.key} (${sizeMB} MB)`);
      });
    });

    console.log(`\n📊 Total: ${response.Contents.length} fichiers`);

    // Chercher spécifiquement les templates
    const templateFiles = response.Contents.filter(item =>
      item.Key?.includes('template') || item.Key?.includes('.docx')
    );

    if (templateFiles.length > 0) {
      console.log(`\n\n🎯 Templates DOCX trouvés sur R2:`);
      templateFiles.forEach(file => {
        console.log(`  ✓ ${file.Key}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

listR2Contents();
