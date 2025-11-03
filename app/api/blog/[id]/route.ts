import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configuration R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// Initialiser le client S3 pour R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Fonction pour supprimer un fichier de R2
async function deleteFromR2(fileUrl: string): Promise<boolean> {
  try {
    // Extraire la clé du fichier depuis l'URL
    const key = fileUrl.replace(`${R2_PUBLIC_URL}/`, '');

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`✓ Fichier supprimé de R2: ${key}`);
    return true;
  } catch (error) {
    console.error('Error deleting from R2:', error);
    return false;
  }
}

// GET /api/blog/[id] - Récupérer un article par ID ou slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Chercher par ID ou par slug
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de vues
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Mettre à jour un article
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
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

    // Vérifier que l'article existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (coverImage) updateData.coverImage = coverImage;
    if (category) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (author) updateData.author = author;
    if (readTime !== undefined) updateData.readTime = readTime;
    if (metaTitle) updateData.metaTitle = metaTitle;
    if (metaDescription) updateData.metaDescription = metaDescription;

    // Gérer la publication
    if (published !== undefined) {
      updateData.published = published;

      // Si on publie pour la première fois
      if (published && !existingPost.published) {
        updateData.publishedAt = new Date();
      }

      // Si on dépublie
      if (!published && existingPost.published) {
        updateData.publishedAt = null;
      }
    }

    // Mettre à jour l'article
    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Error updating blog post:', error);

    // Erreur si le slug existe déjà
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Supprimer un article
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Vérifier que l'article existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Vérifier si l'image de couverture est utilisée par d'autres articles
    const coverImageUrl = existingPost.coverImage;
    let shouldDeleteImage = false;

    if (coverImageUrl && coverImageUrl.includes(R2_PUBLIC_URL)) {
      const otherPostsWithSameImage = await prisma.blogPost.count({
        where: {
          coverImage: coverImageUrl,
          id: { not: id } // Exclure l'article actuel
        }
      });

      // Si aucun autre article n'utilise cette image, on peut la supprimer
      shouldDeleteImage = otherPostsWithSameImage === 0;
    }

    // Supprimer l'article
    await prisma.blogPost.delete({
      where: { id }
    });

    // Supprimer l'image de R2 si elle n'est plus utilisée
    if (shouldDeleteImage && coverImageUrl) {
      await deleteFromR2(coverImageUrl);
    }

    return NextResponse.json(
      {
        message: 'Blog post deleted successfully',
        imageDeleted: shouldDeleteImage
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
