import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, contactId } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId est requis' },
        { status: 400 }
      );
    }

    // Récupérer le template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    const autoFilledData: Record<string, any> = {};

    // 1. Récupérer les paramètres de l'agence
    const agencySettings = await prisma.agencySettings.findFirst();

    // 2. Récupérer le contact si fourni
    let contact = null;
    if (contactId) {
      contact = await prisma.contact.findUnique({
        where: { id: contactId }
      });
    }

    // 3. Auto-remplir selon le mapping
    const fieldMapping = template.fieldMapping as Record<string, any>;

    // Fonction helper pour mapper les noms de champs contact
    const mapContactField = (fieldName: string): string => {
      const fieldMap: Record<string, string> = {
        'nom_client': 'name',
        'email_client': 'email',
        'telephone_client': 'phone',
        'adresse_client': 'adresse_client',
        'ville_client': 'ville',
        'code_postal_client': 'code_postal',
      };
      return fieldMap[fieldName] || fieldName;
    };

    if (fieldMapping) {
      for (const [fieldName, mapping] of Object.entries(fieldMapping)) {
        if (mapping.autoFill) {
          if (mapping.source === 'agency' && agencySettings) {
            // Remplir depuis les paramètres de l'agence
            const value = (agencySettings as any)[mapping.field];
            if (value) {
              autoFilledData[fieldName] = value;
            }
          } else if (mapping.source === 'contact' && contact) {
            // Remplir depuis le contact avec mapping des noms de champs
            const mappedField = mapContactField(mapping.field);
            const value = (contact as any)[mappedField];
            if (value) {
              autoFilledData[fieldName] = value;
            }
          }
        }
      }
    }

    // 4. Ajouter des valeurs par défaut pour les champs manquants
    if (agencySettings && !autoFilledData.nom_agence) {
      autoFilledData.nom_agence = agencySettings.nom_agence;
      autoFilledData.adresse_agence = agencySettings.adresse_agence;
      autoFilledData.telephone_agence = agencySettings.telephone_agence;
      autoFilledData.email_agence = agencySettings.email_agence;
      autoFilledData.siret_agence = agencySettings.siret_agence;
    }

    // 5. Générer un numéro de document
    const now = new Date();
    const year = now.getFullYear();

    let prefix = 'DOC';
    if (template.type === 'DEVIS') prefix = 'DEV';
    else if (template.type === 'FACTURE') prefix = 'FACT';
    else if (template.type === 'CONTRAT') prefix = 'CONT';

    // Compter les documents du même type cette année
    const count = await prisma.document.count({
      where: {
        type: template.type,
        createdAt: {
          gte: new Date(`${year}-01-01`)
        }
      }
    });

    const numero = `${prefix}-${year}-${String(count + 1).padStart(3, '0')}`;
    autoFilledData.numero_devis = numero;
    autoFilledData.numero_facture = numero;
    autoFilledData.numero_contrat = numero;

    // 6. Dates par défaut
    autoFilledData.date_devis = now.toLocaleDateString('fr-FR');
    autoFilledData.date_facture = now.toLocaleDateString('fr-FR');
    autoFilledData.date_contrat = now.toLocaleDateString('fr-FR');
    autoFilledData.date_document = now.toLocaleDateString('fr-FR');

    // Date de validité (30 jours par défaut pour devis)
    if (template.type === 'DEVIS') {
      const validiteDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      autoFilledData.date_validite = validiteDate.toLocaleDateString('fr-FR');
      autoFilledData.validite_jours = '30';
    }

    // 7. Valeurs par défaut pour les totaux
    autoFilledData.tva_pourcentage = '20';
    autoFilledData.sous_total_ht = '0.00';
    autoFilledData.tva_montant = '0.00';
    autoFilledData.total_ttc = '0.00';

    // 8. Conditions par défaut
    autoFilledData.conditions_reglement = '30 jours net';
    autoFilledData.mode_reglement = 'Virement bancaire';

    // 9. Lignes vides par défaut
    autoFilledData.lignes = [];

    return NextResponse.json({
      success: true,
      data: autoFilledData,
      contact: contact ? {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      } : null,
      template: {
        id: template.id,
        name: template.name,
        type: template.type
      }
    });

  } catch (error: any) {
    console.error('Erreur auto-remplissage:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'auto-remplissage',
        details: error.message
      },
      { status: 500 }
    );
  }
}
