import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/document-templates - Fetch all templates or filter by type/category
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const isActive = searchParams.get('isActive');

    // Build filter object
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (slug) where.slug = slug;
    if (isActive !== null) where.isActive = isActive === 'true';

    const templates = await prisma.documentTemplate.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching document templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document templates' },
      { status: 500 }
    );
  }
}

// POST /api/document-templates - Create a new template
export async function POST(request: Request) {
  try {
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

    // Validation
    if (!name || !slug || !type || !category || !fileName || !filePath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.documentTemplate.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Template with this slug already exists' },
        { status: 409 }
      );
    }

    // Create template
    const template = await prisma.documentTemplate.create({
      data: {
        name,
        slug,
        type,
        category,
        description,
        fileName,
        filePath,
        variables: variables || [],
        requiresSignature: requiresSignature ?? false,
        isActive: isActive ?? true
      }
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating document template:', error);
    return NextResponse.json(
      { error: 'Failed to create document template' },
      { status: 500 }
    );
  }
}
