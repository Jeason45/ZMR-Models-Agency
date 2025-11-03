import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog - Liste tous les articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    const where: any = {};

    // Filtre par catégorie
    if (category && category !== 'Tous') {
      where.category = category;
    }

    // Filtre published (par défaut: que les publiés)
    if (published === 'all') {
      // Pas de filtre
    } else {
      where.published = true;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        publishedAt: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Créer un nouvel article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      published,
      readTime,
      metaTitle,
      metaDescription
    } = body;

    // Validation des champs requis
    if (!title || !slug || !excerpt || !content || !coverImage || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Créer l'article
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        tags: tags || [],
        author: author || 'ZMR Models Agency',
        published: published || false,
        publishedAt: published ? new Date() : null,
        readTime: readTime || null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);

    // Erreur si le slug existe déjà
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
