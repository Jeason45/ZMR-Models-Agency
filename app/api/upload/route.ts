import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

// Fonction pour calculer le hash MD5 d'un buffer
function calculateHash(buffer: Buffer): string {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

// Fonction pour vérifier si un fichier identique existe déjà
async function findExistingFile(buffer: Buffer, uploadDir: string): Promise<string | null> {
  try {
    if (!existsSync(uploadDir)) {
      return null;
    }

    const files = await readdir(uploadDir);
    const newFileHash = calculateHash(buffer);

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      try {
        const existingBuffer = await readFile(filePath);
        const existingHash = calculateHash(existingBuffer);

        if (existingHash === newFileHash) {
          console.log(`✓ Fichier identique trouvé: ${file}`);
          return file;
        }
      } catch (error) {
        // Ignorer les erreurs de lecture de fichiers individuels
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking for existing file:', error);
    return null;
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

    // Déterminer le chemin de stockage
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      category || 'models',
      type === 'video' ? 'videos' : 'images'
    );

    // Créer le dossier s'il n'existe pas
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Vérifier si un fichier identique existe déjà
    const existingFileName = await findExistingFile(buffer, uploadDir);

    let fileName: string;

    if (existingFileName) {
      // Utiliser le fichier existant
      fileName = existingFileName;
      console.log(`♻️  Réutilisation du fichier existant: ${fileName}`);
    } else {
      // Créer un nouveau fichier
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = file.name.split('.').pop();
      fileName = `${timestamp}-${randomString}.${extension}`;

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      console.log(`✓ Nouveau fichier créé: ${fileName}`);
    }

    // Retourner le chemin relatif pour stockage en BDD
    const relativePath = `/uploads/${category || 'models'}/${type === 'video' ? 'videos' : 'images'}/${fileName}`;

    return NextResponse.json({
      success: true,
      filePath: relativePath,
      fileName: fileName,
      isExisting: !!existingFileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
