import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, DeleteObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

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

// GET - Lister les fichiers dans un dossier
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';
    const action = searchParams.get('action');

    // Si action=stats, retourner les statistiques du bucket
    if (action === 'stats') {
      try {
        const command = new ListObjectsV2Command({
          Bucket: R2_BUCKET_NAME,
        });

        const response = await r2Client.send(command);

        let totalSize = 0;
        let fileCount = 0;

        if (response.Contents) {
          fileCount = response.Contents.length;
          response.Contents.forEach(obj => {
            totalSize += obj.Size || 0;
          });
        }

        return NextResponse.json({
          totalSize,
          fileCount,
          totalSizeFormatted: formatBytes(totalSize)
        });
      } catch (error) {
        console.error('Error getting bucket stats:', error);
        return NextResponse.json({
          totalSize: 0,
          fileCount: 0,
          totalSizeFormatted: '0 B'
        });
      }
    }

    // Lister les fichiers avec le préfixe
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
      Delimiter: '/',
    });

    const response = await r2Client.send(command);

    // Extraire les dossiers (CommonPrefixes)
    const folders = (response.CommonPrefixes || []).map(p => ({
      name: p.Prefix?.replace(prefix, '').replace('/', '') || '',
      path: p.Prefix || '',
      type: 'folder' as const,
    }));

    // Extraire les fichiers (Contents)
    const files = (response.Contents || [])
      .filter(obj => obj.Key !== prefix) // Exclure le préfixe lui-même
      .map(obj => ({
        name: obj.Key?.replace(prefix, '') || '',
        path: obj.Key || '',
        size: obj.Size || 0,
        sizeFormatted: formatBytes(obj.Size || 0),
        lastModified: obj.LastModified?.toISOString() || '',
        url: `${R2_PUBLIC_URL}/${obj.Key}`,
        type: getFileType(obj.Key || ''),
      }));

    return NextResponse.json({
      folders,
      files,
      currentPath: prefix,
    });
  } catch (error) {
    console.error('Error listing R2 files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un fichier
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour formater les bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Fonction pour déterminer le type de fichier
function getFileType(filename: string): 'image' | 'video' | 'document' | 'other' {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')) {
    return 'image';
  }

  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext || '')) {
    return 'video';
  }

  if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(ext || '')) {
    return 'document';
  }

  return 'other';
}
