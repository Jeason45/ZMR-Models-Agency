/**
 * Configuration des positions des champs dans les PDFs
 * Coordonnées en points PDF (1 point = 1/72 pouce)
 * Page A4 : 595 x 842 points
 */

export interface FieldPosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DocumentFieldPositions {
  [fieldName: string]: FieldPosition;
}

/**
 * Positions des champs pour un DEVIS
 */
export const DEVIS_FIELD_POSITIONS: DocumentFieldPositions = {
  // Numéro de devis (après "Devis n°")
  'numero_devis': {
    page: 1,
    x: 200,
    y: 355,
    width: 150,
    height: 20
  },

  // Date du devis (en haut à droite)
  'date_devis': {
    page: 1,
    x: 450,
    y: 355,
    width: 100,
    height: 20
  },

  // Informations client
  'nom_client': {
    page: 1,
    x: 100,
    y: 420,
    width: 250,
    height: 20
  },

  'adresse_client': {
    page: 1,
    x: 100,
    y: 445,
    width: 250,
    height: 20
  },

  'telephone_client': {
    page: 1,
    x: 100,
    y: 470,
    width: 150,
    height: 20
  },

  'email_client': {
    page: 1,
    x: 100,
    y: 495,
    width: 200,
    height: 20
  },

  // Informations destinataire (si différent)
  'nom_destinataire': {
    page: 1,
    x: 100,
    y: 530,
    width: 250,
    height: 20
  },

  'adresse_destinataire': {
    page: 1,
    x: 100,
    y: 555,
    width: 250,
    height: 20
  },

  // Lignes de prestation - Ligne 1
  'ligne_1_description': {
    page: 1,
    x: 90,
    y: 610,
    width: 250,
    height: 40
  },

  'ligne_1_prix_unitaire': {
    page: 1,
    x: 345,
    y: 610,
    width: 70,
    height: 20
  },

  'ligne_1_quantite': {
    page: 1,
    x: 420,
    y: 610,
    width: 50,
    height: 20
  },

  'ligne_1_total': {
    page: 1,
    x: 475,
    y: 610,
    width: 80,
    height: 20
  },

  // Ligne 2
  'ligne_2_description': {
    page: 1,
    x: 90,
    y: 655,
    width: 250,
    height: 40
  },

  'ligne_2_prix_unitaire': {
    page: 1,
    x: 345,
    y: 655,
    width: 70,
    height: 20
  },

  'ligne_2_quantite': {
    page: 1,
    x: 420,
    y: 655,
    width: 50,
    height: 20
  },

  'ligne_2_total': {
    page: 1,
    x: 475,
    y: 655,
    width: 80,
    height: 20
  },

  // Ligne 3
  'ligne_3_description': {
    page: 1,
    x: 90,
    y: 700,
    width: 250,
    height: 40
  },

  'ligne_3_prix_unitaire': {
    page: 1,
    x: 345,
    y: 700,
    width: 70,
    height: 20
  },

  'ligne_3_quantite': {
    page: 1,
    x: 420,
    y: 700,
    width: 50,
    height: 20
  },

  'ligne_3_total': {
    page: 1,
    x: 475,
    y: 700,
    width: 80,
    height: 20
  },

  // Totaux (en bas à droite)
  'sous_total': {
    page: 1,
    x: 475,
    y: 760,
    width: 80,
    height: 20
  },

  'tva_pourcentage': {
    page: 1,
    x: 420,
    y: 785,
    width: 50,
    height: 20
  },

  'tva_montant': {
    page: 1,
    x: 475,
    y: 785,
    width: 80,
    height: 20
  },

  'total_ttc': {
    page: 1,
    x: 475,
    y: 815,
    width: 80,
    height: 25
  },

  // Conditions
  'validite_jours': {
    page: 1,
    x: 200,
    y: 880,
    width: 50,
    height: 20
  },

  'acompte_pourcentage': {
    page: 1,
    x: 150,
    y: 900,
    width: 50,
    height: 20
  }
};

/**
 * Positions des champs pour une FACTURE
 */
export const FACTURE_FIELD_POSITIONS: DocumentFieldPositions = {
  // Structure similaire au devis
  ...DEVIS_FIELD_POSITIONS,

  // Champs spécifiques facture
  'numero_facture': {
    page: 1,
    x: 200,
    y: 355,
    width: 150,
    height: 20
  },

  'date_facture': {
    page: 1,
    x: 450,
    y: 355,
    width: 100,
    height: 20
  },

  'date_echeance': {
    page: 1,
    x: 450,
    y: 380,
    width: 100,
    height: 20
  }
};

/**
 * Positions des champs pour un CONTRAT
 */
export const CONTRAT_FIELD_POSITIONS: DocumentFieldPositions = {
  // En-tête
  'numero_contrat': {
    page: 1,
    x: 400,
    y: 100,
    width: 150,
    height: 20
  },

  'date_contrat': {
    page: 1,
    x: 400,
    y: 125,
    width: 150,
    height: 20
  },

  // Partie 1 : Client
  'nom_client': {
    page: 1,
    x: 100,
    y: 200,
    width: 200,
    height: 20
  },

  'adresse_client': {
    page: 1,
    x: 100,
    y: 225,
    width: 250,
    height: 20
  },

  'siret_client': {
    page: 1,
    x: 100,
    y: 250,
    width: 150,
    height: 20
  },

  // Partie 2 : Talent/Modèle
  'prenom_talent': {
    page: 1,
    x: 100,
    y: 320,
    width: 150,
    height: 20
  },

  'nom_talent': {
    page: 1,
    x: 260,
    y: 320,
    width: 150,
    height: 20
  },

  'date_naissance_talent': {
    page: 1,
    x: 100,
    y: 345,
    width: 100,
    height: 20
  },

  'adresse_talent': {
    page: 1,
    x: 100,
    y: 370,
    width: 250,
    height: 20
  },

  'telephone_talent': {
    page: 1,
    x: 100,
    y: 395,
    width: 150,
    height: 20
  },

  // Conditions du contrat
  'date_debut': {
    page: 1,
    x: 150,
    y: 450,
    width: 100,
    height: 20
  },

  'date_fin': {
    page: 1,
    x: 300,
    y: 450,
    width: 100,
    height: 20
  },

  'montant_cachet': {
    page: 1,
    x: 150,
    y: 480,
    width: 100,
    height: 20
  },

  'lieu_prestation': {
    page: 1,
    x: 150,
    y: 510,
    width: 200,
    height: 20
  },

  // Zone de signature (bas de page)
  'signature_client': {
    page: 1,
    x: 100,
    y: 700,
    width: 200,
    height: 60
  },

  'signature_talent': {
    page: 1,
    x: 350,
    y: 700,
    width: 200,
    height: 60
  }
};

/**
 * Obtenir les positions pour un type de document
 */
export function getFieldPositionsForType(templateType: string): DocumentFieldPositions {
  switch (templateType.toUpperCase()) {
    case 'DEVIS':
      return DEVIS_FIELD_POSITIONS;
    case 'FACTURE':
      return FACTURE_FIELD_POSITIONS;
    case 'CONTRAT':
      return CONTRAT_FIELD_POSITIONS;
    default:
      return {};
  }
}

/**
 * Créer des champs éditables avec les bonnes positions
 */
export function createEditableFieldsWithPositions(
  fieldMapping: Record<string, any>,
  templateType: string
): any[] {
  const positions = getFieldPositionsForType(templateType);
  const fields = [];

  // Parcourir le mapping et créer les champs avec positions
  Object.entries(fieldMapping).forEach(([fieldName, config]) => {
    const position = positions[fieldName];

    if (!position) {
      // Si pas de position définie, ignorer ou utiliser position par défaut
      console.warn(`Pas de position définie pour le champ: ${fieldName}`);
      return;
    }

    // Déterminer le type de champ
    let fieldType = 'text';
    if (config.type === 'email') fieldType = 'email';
    else if (config.type === 'date') fieldType = 'date';
    else if (config.type === 'number') fieldType = 'number';
    else if (fieldName.includes('signature')) fieldType = 'signature';

    fields.push({
      name: fieldName,
      label: config.label || fieldName.replace(/_/g, ' '),
      type: fieldType,
      required: config.required || false,
      position: position
    });
  });

  return fields;
}

/**
 * Ajuster les positions pour la conversion PDF
 * Les coordonnées PDF commencent en bas à gauche, pas en haut à gauche
 */
export function adjustPositionForPDF(position: FieldPosition, pageHeight: number = 842): FieldPosition {
  return {
    ...position,
    y: pageHeight - position.y - position.height
  };
}