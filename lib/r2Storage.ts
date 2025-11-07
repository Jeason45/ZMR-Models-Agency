import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configuration R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// Vérifier que les variables sont définies
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('❌ Configuration R2 incomplète. Vérifiez les variables d\'environnement.');
}

// Initialiser le client S3 pour R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload un fichier vers R2
 * @param buffer Buffer du fichier
 * @param key Chemin dans le bucket (ex: "documents/devis-2025-001.pdf")
 * @param contentType Type MIME (ex: "application/pdf")
 * @returns URL publique du fichier
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string = 'application/octet-stream'
): Promise<{ success: boolean; url?: string; key?: string; error?: string }> {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Construire l'URL publique
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    console.log('✅ Fichier uploadé sur R2:', publicUrl);

    return {
      success: true,
      url: publicUrl,
      key: key
    };
  } catch (error) {
    console.error('❌ Erreur upload R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Télécharge un fichier depuis R2
 * @param key Chemin dans le bucket
 * @returns Buffer du fichier
 */
export async function downloadFromR2(key: string): Promise<{ success: boolean; buffer?: Buffer; error?: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return {
        success: false,
        error: 'Empty response body'
      };
    }

    // Convertir le stream en Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log('✅ Fichier téléchargé depuis R2:', key);

    return {
      success: true,
      buffer
    };
  } catch (error) {
    console.error('❌ Erreur download R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Supprime un fichier de R2
 * @param key Chemin dans le bucket
 */
export async function deleteFromR2(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);

    console.log('✅ Fichier supprimé de R2:', key);

    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suppression R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Vérifie si un fichier existe sur R2
 * @param key Chemin dans le bucket
 */
export async function fileExistsOnR2(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Génère une URL signée temporaire pour un fichier privé
 * @param key Chemin dans le bucket
 * @param expiresIn Durée de validité en secondes (défaut: 3600 = 1h)
 */
export async function getSignedUrlForR2(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Extrait la clé (key) depuis une URL R2 publique
 * @param url URL complète (ex: https://pub-xxx.r2.dev/documents/file.pdf)
 * @returns La clé (ex: documents/file.pdf)
 */
export function extractKeyFromR2Url(url: string): string | null {
  try {
    if (!url.includes(R2_PUBLIC_URL)) {
      return null;
    }
    return url.replace(`${R2_PUBLIC_URL}/`, '');
  } catch (error) {
    return null;
  }
}
