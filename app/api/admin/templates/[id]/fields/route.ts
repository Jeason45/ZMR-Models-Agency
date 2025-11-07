import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { editableFields } = body;

    // Validate editableFields structure
    if (!Array.isArray(editableFields)) {
      return NextResponse.json(
        { error: 'editableFields must be an array' },
        { status: 400 }
      );
    }

    // Validate each field
    for (const field of editableFields) {
      if (!field.name || !field.label || !field.type || !field.position) {
        return NextResponse.json(
          { error: 'Each field must have name, label, type, and position' },
          { status: 400 }
        );
      }

      if (!field.position.page ||
          field.position.x === undefined ||
          field.position.y === undefined ||
          !field.position.width ||
          !field.position.height) {
        return NextResponse.json(
          { error: 'Position must have page, x, y, width, and height' },
          { status: 400 }
        );
      }
    }

    // Update template with new editableFields
    const template = await prisma.documentTemplate.update({
      where: { id },
      data: {
        editableFields: editableFields as any
      }
    });

    return NextResponse.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Error saving editable fields:', error);
    return NextResponse.json(
      { error: 'Failed to save editable fields' },
      { status: 500 }
    );
  }
}
