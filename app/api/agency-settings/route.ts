/**
 * API pour gérer les paramètres de l'agence (singleton)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET : Récupérer les settings
export async function GET() {
  try {
    const settings = await prisma.agencySettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: 'Agency settings not found. Please run setup script.' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error fetching agency settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agency settings' },
      { status: 500 }
    );
  }
}

// POST/PUT : Créer ou mettre à jour les settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Vérifier si des settings existent déjà
    const existing = await prisma.agencySettings.findFirst();

    let settings;

    if (existing) {
      // Mise à jour
      settings = await prisma.agencySettings.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      // Création
      settings = await prisma.agencySettings.create({
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error saving agency settings:', error);
    return NextResponse.json(
      { error: 'Failed to save agency settings' },
      { status: 500 }
    );
  }
}
