import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les contacts (pour le CRM)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const contacts = await prisma.contact.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: 'Failed to fetch contacts',
        details: error instanceof Error ? error.message : String(error),
        dbUrl: process.env.DATABASE_URL ? 'DB_URL is set' : 'DB_URL is missing'
      },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau contact (depuis le formulaire public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, message } = body;

    // Validation
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Créer le contact
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        type,
        message,
        status: 'new',
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le statut d'un contact
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}
