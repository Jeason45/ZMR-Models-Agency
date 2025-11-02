import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/documents - Fetch all documents with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const talentId = searchParams.get('talentId');
    const contactId = searchParams.get('contactId');
    const limit = searchParams.get('limit');

    // Build filter object
    const where: any = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (category) where.category = category;
    if (talentId) where.talentId = talentId;
    if (contactId) where.contactId = contactId;

    const documents = await prisma.document.findMany({
      where,
      include: {
        template: true,
        talent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        contact: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        signatures: {
          select: {
            id: true,
            signerName: true,
            signerEmail: true,
            signedAt: true
          }
        },
        mailLogs: {
          select: {
            id: true,
            type: true,
            to: true,
            sentAt: true,
            status: true
          },
          orderBy: {
            sentAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents - Delete multiple documents
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { documentIds } = body;

    if (!documentIds || !Array.isArray(documentIds)) {
      return NextResponse.json(
        { error: 'Invalid documentIds array' },
        { status: 400 }
      );
    }

    // Delete documents
    const result = await prisma.document.deleteMany({
      where: {
        id: {
          in: documentIds
        }
      }
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count
    });

  } catch (error) {
    console.error('Error deleting documents:', error);
    return NextResponse.json(
      { error: 'Failed to delete documents' },
      { status: 500 }
    );
  }
}
