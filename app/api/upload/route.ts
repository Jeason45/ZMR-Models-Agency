import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

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

// Fonction pour calculer le hash MD5 d'un buffer
function calculateHash(buffer: Buffer): string {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

// Fonction pour vérifier si un fichier identique existe déjà dans R2
async function findExistingFileInR2(buffer: Buffer, prefix: string): Promise<string | null> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await r2Client.send(command);
    const newFileHash = calculateHash(buffer);

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (!obj.Key) continue;

        try {
          // Récupérer le fichier pour comparer le hash
          const getCommand = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: obj.Key,
          });

          const existingFile = await r2Client.send(getCommand);
          if (existingFile.Body) {
            const existingBuffer = Buffer.from(await existingFile.Body.transformToByteArray());
            const existingHash = calculateHash(existingBuffer);

            if (existingHash === newFileHash) {
              console.log(`✓ Fichier identique trouvé dans R2: ${obj.Key}`);
              return obj.Key;
            }
          }
        } catch (error) {
          // Ignorer les erreurs de lecture de fichiers individuels
          continue;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking for existing file in R2:', error);
    return null;
  }
}

// Fonction pour uploader un fichier vers R2
async function uploadToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Retourner l'URL publique
    return `${R2_PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'video'
    const category = formData.get('category') as string; // 'models', 'actors', etc.

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Valider le type de fichier
    const fileType = file.type;
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');

    if (type === 'image' && !isImage) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    if (type === 'video' && !isVideo) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Déterminer le Content-Type
    let contentType = fileType;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!contentType) {
      if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
      else if (ext === 'png') contentType = 'image/png';
      else if (ext === 'gif') contentType = 'image/gif';
      else if (ext === 'webp') contentType = 'image/webp';
      else if (ext === 'mp4') contentType = 'video/mp4';
      else if (ext === 'mov') contentType = 'video/quicktime';
      else if (ext === 'avi') contentType = 'video/x-msvideo';
      else contentType = 'application/octet-stream';
    }

    // Construire le chemin R2 (même structure que local)
    const subfolder = type === 'video' ? 'videos' : 'images';
    const prefix = `uploads/${category || 'models'}/${subfolder}/`;

    // Vérifier si un fichier identique existe déjà
    const existingKey = await findExistingFileInR2(buffer, prefix);

    let fileUrl: string;
    let fileName: string;
    let isExisting = false;

    if (existingKey) {
      // Utiliser le fichier existant
      fileUrl = `${R2_PUBLIC_URL}/${existingKey}`;
      fileName = existingKey.split('/').pop() || '';
      isExisting = true;
      console.log(`♻️  Réutilisation du fichier existant: ${existingKey}`);
    } else {
      // Créer un nouveau fichier
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = ext || 'bin';
      fileName = `${timestamp}-${randomString}.${extension}`;
      const key = `${prefix}${fileName}`;

      fileUrl = await uploadToR2(buffer, key, contentType);
      console.log(`✓ Nouveau fichier uploadé vers R2: ${key}`);
    }

    return NextResponse.json({
      success: true,
      filePath: fileUrl, // Retourne maintenant l'URL R2 complète
      fileName: fileName,
      isExisting: isExisting,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
