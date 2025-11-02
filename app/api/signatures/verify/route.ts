import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import {
  generateFileHash,
  verifySignatureProof,
  SignatureProofData
} from '@/lib/signatureUtils';

const prisma = new PrismaClient();

// POST /api/signatures/verify - Verify a signature's authenticity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { signatureId } = body;

    if (!signatureId) {
      return NextResponse.json(
        { error: 'Missing signatureId' },
        { status: 400 }
      );
    }

    // Get signature from database
    const signature = await prisma.signature.findUnique({
      where: { id: signatureId },
      include: {
        document: true
      }
    });

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature not found' },
        { status: 404 }
      );
    }

    const verificationResults = {
      signatureId: signature.id,
      documentId: signature.documentId,
      signerName: signature.signerName,
      signerEmail: signature.signerEmail,
      signedAt: signature.signedAt,
      checks: {
        proofIntegrity: false,
        documentHashMatch: false,
        timestampValid: false,
        signatureNotRevoked: false
      },
      isValid: false,
      details: {} as any
    };

    // Check 1: Verify proof integrity
    const proof = signature.proofData as SignatureProofData;
    if (proof) {
      verificationResults.checks.proofIntegrity = verifySignatureProof(proof);
    }

    // Check 2: Verify document hash matches
    try {
      const documentPath = path.join(process.cwd(), signature.document.filePath);
      const currentHash = generateFileHash(documentPath);
      verificationResults.checks.documentHashMatch = currentHash === signature.documentHash;
      verificationResults.details.storedHash = signature.documentHash;
      verificationResults.details.currentHash = currentHash;
    } catch (error) {
      verificationResults.details.hashError = 'Could not generate current document hash';
    }

    // Check 3: Timestamp is valid (not in the future)
    const now = new Date();
    const signedAt = new Date(signature.signedAt);
    verificationResults.checks.timestampValid = signedAt <= now;

    // Check 4: Signature not revoked
    verificationResults.checks.signatureNotRevoked = signature.isValid;

    // Overall validity
    verificationResults.isValid =
      verificationResults.checks.proofIntegrity &&
      verificationResults.checks.documentHashMatch &&
      verificationResults.checks.timestampValid &&
      verificationResults.checks.signatureNotRevoked;

    // Add additional details
    verificationResults.details.ipAddress = signature.ipAddress;
    verificationResults.details.userAgent = signature.userAgent;
    verificationResults.details.location = signature.location;
    verificationResults.details.signatureType = signature.signatureType;

    return NextResponse.json(verificationResults);

  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify signature',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/signatures/verify?signatureId=xxx - Alternative GET endpoint
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const signatureId = searchParams.get('signatureId');

    if (!signatureId) {
      return NextResponse.json(
        { error: 'Missing signatureId parameter' },
        { status: 400 }
      );
    }

    // Use POST logic
    return POST(
      new Request(request.url, {
        method: 'POST',
        body: JSON.stringify({ signatureId }),
        headers: request.headers
      })
    );

  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { error: 'Failed to verify signature' },
      { status: 500 }
    );
  }
}
