/**
 * API pour préparer les données d'un document
 * Auto-remplit les champs selon le mapping du template
 */

import { NextRequest, NextResponse } from 'next/server';
import { DocumentDataMapper } from '@/lib/documentDataMapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, contactId, talentId } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      );
    }

    // Utiliser le mapper pour préparer les données
    const mapper = new DocumentDataMapper();
    const result = await mapper.populateFields(templateId, contactId, talentId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error preparing document data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to prepare document data' },
      { status: 500 }
    );
  }
}
