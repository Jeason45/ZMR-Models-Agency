import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

// Note: Pour Next.js App Router, la limite de taille est gérée par Vercel (4.5MB sur Hobby plan)
// Les images sont compressées côté client avant upload pour respecter cette limite

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
    const rawExt = file.name.split('.').pop()?.toLowerCase();

    // Liste des extensions valides
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
    const validVideoExtensions = ['mp4', 'mov', 'avi', 'webm'];
    const isValidExt = rawExt && (validImageExtensions.includes(rawExt) || validVideoExtensions.includes(rawExt));

    if (!contentType) {
      if (rawExt === 'jpg' || rawExt === 'jpeg') contentType = 'image/jpeg';
      else if (rawExt === 'png') contentType = 'image/png';
      else if (rawExt === 'gif') contentType = 'image/gif';
      else if (rawExt === 'webp') contentType = 'image/webp';
      else if (rawExt === 'mp4') contentType = 'video/mp4';
      else if (rawExt === 'mov') contentType = 'video/quicktime';
      else if (rawExt === 'avi') contentType = 'video/x-msvideo';
      else contentType = 'application/octet-stream';
    }

    // Dériver l'extension à partir du Content-Type si l'extension du fichier n'est pas valide
    let extension = rawExt || 'bin';
    if (!isValidExt) {
      // Map Content-Type vers extension
      const contentTypeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/avif': 'avif',
        'video/mp4': 'mp4',
        'video/quicktime': 'mov',
        'video/x-msvideo': 'avi',
        'video/webm': 'webm',
      };
      extension = contentTypeToExt[contentType] || extension;
    }

    // Construire le chemin R2 (même structure que local)
    const subfolder = type === 'video' ? 'videos' : 'images';
    const prefix = `uploads/${category || 'models'}/${subfolder}/`;

    // Upload direct sans vérification de déduplication (trop lent)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const key = `${prefix}${fileName}`;

    const fileUrl = await uploadToR2(buffer, key, contentType);
    console.log(`✓ Fichier uploadé vers R2: ${key}`);

    return NextResponse.json({
      success: true,
      filePath: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
