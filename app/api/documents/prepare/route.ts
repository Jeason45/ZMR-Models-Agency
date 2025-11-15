import { NextRequest, NextResponse } from 'next/server';
import { DocumentDataMapper } from '@/lib/documentDataMapper';

/**
 * API pour préparer les données d'un document (auto-remplissage)
 * Appelée par SmartDocumentForm pour charger les champs pré-remplis
 */
export async function POST(request: NextRequest) {
  try {
    const { templateId, contactId, talentId } = await request.json();

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    console.log('📋 Préparation du document:', { templateId, contactId, talentId });

    // Utiliser le DocumentDataMapper pour auto-remplir les champs
    // Note: talentId n'est pas supporté dans cette version de DocumentDataMapper
    const result = await DocumentDataMapper.populateFields(templateId, contactId);

    console.log('✅ Données préparées:', {
      autoFieldsGenerated: result.metadata.autoFieldsGenerated,
      manualFieldsRequired: result.metadata.manualFieldsRequired,
      agencyLoaded: result.metadata.agencyLoaded,
      contactLoaded: result.metadata.contactLoaded
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error preparing document:', error);
    return NextResponse.json(
      { error: 'Failed to prepare document data' },
      { status: 500 }
    );
  }
}
