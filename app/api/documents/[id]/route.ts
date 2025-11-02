import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/documents/[id] - Get single document by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        template: true,
        talent: true,
        contact: true,
        signatures: {
          orderBy: {
            signedAt: 'desc'
          }
        },
        mailLogs: {
          orderBy: {
            sentAt: 'desc'
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const {
      status,
      notes,
      tags,
      amountHT,
      amountTTC,
      issueDate,
      dueDate,
      expiresAt
    } = body;

    // Check if document exists
    const existing = await prisma.document.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update document
    const document = await prisma.document.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(tags !== undefined && { tags }),
        ...(amountHT !== undefined && { amountHT }),
        ...(amountTTC !== undefined && { amountTTC }),
        ...(issueDate && { issueDate: new Date(issueDate) }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null })
      },
      include: {
        template: true,
        talent: true,
        contact: true
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if document exists
    const existing = await prisma.document.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete document (cascade will delete signatures and mail logs)
    await prisma.document.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
