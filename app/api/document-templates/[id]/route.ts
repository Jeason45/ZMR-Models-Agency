import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/document-templates/[id] - Fetch single template by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.documentTemplate.findUnique({
      where: { id }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching document template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document template' },
      { status: 500 }
    );
  }
}

// PUT /api/document-templates/[id] - Update a template
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      slug,
      type,
      category,
      description,
      fileName,
      filePath,
      variables,
      requiresSignature,
      isActive
    } = body;

    // Check if template exists
    const existing = await prisma.documentTemplate.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // If slug is changing, check it's not taken
    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.documentTemplate.findUnique({
        where: { slug }
      });

      if (slugTaken) {
        return NextResponse.json(
          { error: 'Slug already in use' },
          { status: 409 }
        );
      }
    }

    // Update template
    const template = await prisma.documentTemplate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(type && { type }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(fileName && { fileName }),
        ...(filePath && { filePath }),
        ...(variables !== undefined && { variables }),
        ...(requiresSignature !== undefined && { requiresSignature }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating document template:', error);
    return NextResponse.json(
      { error: 'Failed to update document template' },
      { status: 500 }
    );
  }
}

// DELETE /api/document-templates/[id] - Delete a template
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if template exists
    const existing = await prisma.documentTemplate.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Delete template
    await prisma.documentTemplate.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting document template:', error);
    return NextResponse.json(
      { error: 'Failed to delete document template' },
      { status: 500 }
    );
  }
}
