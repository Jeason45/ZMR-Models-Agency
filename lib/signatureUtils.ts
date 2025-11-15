import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Génère un hash SHA-256 d'un fichier
 */
export function generateFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Génère un hash SHA-256 d'une chaîne de caractères
 */
export function generateStringHash(data: string): string {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(data);
  return hashSum.digest('hex');
}

/**
 * Sauvegarde une image de signature (base64 → PNG)
 */
export function saveSignatureImage(
  base64Data: string,
  documentId: string,
  signerEmail: string
): string {
  // Retirer le préfixe data:image/png;base64,
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Image, 'base64');

  // Créer un nom de fichier unique
  const timestamp = Date.now();
  const emailHash = generateStringHash(signerEmail).substring(0, 8);
  const fileName = `signature_${documentId}_${emailHash}_${timestamp}.png`;

  // Chemin de stockage
  const storageDir = path.join(process.cwd(), 'public', 'storage', 'signatures');

  // Créer le répertoire si nécessaire
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const filePath = path.join(storageDir, fileName);

  // Sauvegarder l'image
  fs.writeFileSync(filePath, imageBuffer);

  // Retourner le chemin relatif
  return `/storage/signatures/${fileName}`;
}

/**
 * Sauvegarde les preuves de signature en JSON
 */
export function saveSignatureProof(
  proofData: any,
  documentId: string,
  signatureId: string
): string {
  const fileName = `proof_${documentId}_${signatureId}.json`;
  const storageDir = path.join(process.cwd(), 'public', 'storage', 'proofs');

  // Créer le répertoire si nécessaire
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const filePath = path.join(storageDir, fileName);

  // Sauvegarder les preuves
  fs.writeFileSync(filePath, JSON.stringify(proofData, null, 2));

  // Retourner le chemin relatif
  return `/storage/proofs/${fileName}`;
}

/**
 * Récupère l'adresse IP du client
 */
export function getClientIP(request: Request): string {
  // Vérifier les headers de proxy
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Récupère le User Agent du client
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Génère un token sécurisé pour les liens de signature
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calcule la date d'expiration (30 jours par défaut)
 */
export function calculateExpirationDate(days: number = 30): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

/**
 * Vérifie si un token est expiré
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Crée les données de preuve cryptographique
 */
export function createSignatureProofData(params: {
  documentId: string;
  documentHash: string;
  signerName: string;
  signerEmail: string;
  signerRole: string;
  signatureType: string;
  signedAt: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
}): any {
  const signedAtISO = params.signedAt.toISOString();

  // Créer la chaîne de preuve
  const proofString = [
    params.documentId,
    params.documentHash,
    params.signerName,
    params.signerEmail,
    params.signerRole,
    params.signatureType,
    signedAtISO,
    params.ipAddress,
    params.userAgent,
    params.location || ''
  ].join('|');

  // Générer le hash de la preuve
  const proofHash = generateStringHash(proofString);

  return {
    documentId: params.documentId,
    documentHash: params.documentHash,
    signerName: params.signerName,
    signerEmail: params.signerEmail,
    signerRole: params.signerRole,
    signatureType: params.signatureType,
    signedAt: signedAtISO,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    location: params.location,
    proofHash,
    proofString, // Pour debugging
    verificationInstructions: 'Recalculer le hash avec les données ci-dessus pour vérifier l\'intégrité'
  };
}

/**
 * Vérifie l'intégrité d'une preuve de signature
 */
export function verifySignatureProof(proofData: any): boolean {
  try {
    // Recréer la chaîne de preuve
    const proofString = [
      proofData.documentId,
      proofData.documentHash,
      proofData.signerName,
      proofData.signerEmail,
      proofData.signerRole,
      proofData.signatureType,
      proofData.signedAt,
      proofData.ipAddress,
      proofData.userAgent,
      proofData.location || ''
    ].join('|');

    // Recalculer le hash
    const calculatedHash = generateStringHash(proofString);

    // Comparer avec le hash stocké
    return calculatedHash === proofData.proofHash;
  } catch (error) {
    console.error('Error verifying signature proof:', error);
    return false;
  }
}
