/**
 * Signature Utilities
 * Handles cryptographic operations for electronic signatures
 */

import crypto from 'crypto';
import fs from 'fs';

/**
 * Generate SHA-256 hash of a file
 */
export function generateFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Generate SHA-256 hash of a string
 */
export function generateStringHash(data: string): string {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(data);
  return hashSum.digest('hex');
}

/**
 * Create complete signature proof data
 * This creates a verifiable proof that can be used for legal purposes
 */
export interface SignatureProofData {
  documentId: string;
  documentHash: string;
  signerName: string;
  signerEmail: string;
  signerRole: string;
  signatureType: string;
  signedAt: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  proofHash: string;  // Hash of all the proof data
}

export function createSignatureProof(data: {
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
}): SignatureProofData {
  const signedAtISO = data.signedAt.toISOString();

  // Create canonical proof string
  const proofString = [
    data.documentId,
    data.documentHash,
    data.signerName,
    data.signerEmail,
    data.signerRole,
    data.signatureType,
    signedAtISO,
    data.ipAddress,
    data.userAgent,
    data.location || ''
  ].join('|');

  // Hash the proof string
  const proofHash = generateStringHash(proofString);

  return {
    documentId: data.documentId,
    documentHash: data.documentHash,
    signerName: data.signerName,
    signerEmail: data.signerEmail,
    signerRole: data.signerRole,
    signatureType: data.signatureType,
    signedAt: signedAtISO,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    location: data.location,
    proofHash
  };
}

/**
 * Verify signature proof integrity
 */
export function verifySignatureProof(proof: SignatureProofData): boolean {
  const proofString = [
    proof.documentId,
    proof.documentHash,
    proof.signerName,
    proof.signerEmail,
    proof.signerRole,
    proof.signatureType,
    proof.signedAt,
    proof.ipAddress,
    proof.userAgent,
    proof.location || ''
  ].join('|');

  const calculatedHash = generateStringHash(proofString);

  return calculatedHash === proof.proofHash;
}

/**
 * Save signature image from base64 data
 */
export function saveSignatureImage(
  base64Data: string,
  documentId: string,
  signerEmail: string
): string {
  // Remove data:image prefix if present
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');

  // Create buffer from base64
  const imageBuffer = Buffer.from(base64Image, 'base64');

  // Generate filename
  const timestamp = Date.now();
  const emailHash = generateStringHash(signerEmail).substring(0, 8);
  const fileName = `signature_${documentId}_${emailHash}_${timestamp}.png`;
  const filePath = `storage/signatures/${fileName}`;

  // Ensure directory exists
  const fs = require('fs');
  const path = require('path');
  const dirPath = path.join(process.cwd(), 'storage', 'signatures');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Save file
  const fullPath = path.join(process.cwd(), filePath);
  fs.writeFileSync(fullPath, imageBuffer);

  return filePath;
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  // Check common proxy headers
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
 * Get user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}
