/**
 * Utilitaires d'alignement automatique pour les champs PDF
 * Permet d'aligner et distribuer les champs de manière professionnelle
 */

interface Field {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Aligner plusieurs champs horizontalement
 */
export function alignHorizontally(fields: Field[], alignment: 'left' | 'center' | 'right' = 'left'): Field[] {
  if (fields.length === 0) return fields;

  const referenceX = fields[0].x;
  const referenceWidth = fields[0].width;

  return fields.map(field => {
    let newX = field.x;

    switch (alignment) {
      case 'left':
        newX = referenceX;
        break;
      case 'center':
        newX = referenceX + (referenceWidth - field.width) / 2;
        break;
      case 'right':
        newX = referenceX + referenceWidth - field.width;
        break;
    }

    return { ...field, x: newX };
  });
}

/**
 * Aligner plusieurs champs verticalement
 */
export function alignVertically(fields: Field[], alignment: 'top' | 'middle' | 'bottom' = 'top'): Field[] {
  if (fields.length === 0) return fields;

  const referenceY = fields[0].y;
  const referenceHeight = fields[0].height;

  return fields.map(field => {
    let newY = field.y;

    switch (alignment) {
      case 'top':
        newY = referenceY;
        break;
      case 'middle':
        newY = referenceY + (referenceHeight - field.height) / 2;
        break;
      case 'bottom':
        newY = referenceY + referenceHeight - field.height;
        break;
    }

    return { ...field, y: newY };
  });
}

/**
 * Distribuer les champs horizontalement avec espacement égal
 */
export function distributeHorizontally(fields: Field[], containerWidth: number = 595): Field[] {
  if (fields.length <= 1) return fields;

  // Trier par position X
  const sortedFields = [...fields].sort((a, b) => a.x - b.x);

  // Calculer l'espace total disponible
  const totalFieldsWidth = sortedFields.reduce((sum, field) => sum + field.width, 0);
  const availableSpace = containerWidth - 100; // Marges de 50px de chaque côté
  const spacing = (availableSpace - totalFieldsWidth) / (fields.length - 1);

  let currentX = 50; // Marge gauche

  return sortedFields.map(field => {
    const newField = { ...field, x: currentX };
    currentX += field.width + spacing;
    return newField;
  });
}

/**
 * Distribuer les champs verticalement avec espacement égal
 */
export function distributeVertically(fields: Field[], startY: number, endY: number): Field[] {
  if (fields.length <= 1) return fields;

  // Trier par position Y
  const sortedFields = [...fields].sort((a, b) => a.y - b.y);

  // Calculer l'espacement
  const totalHeight = endY - startY;
  const totalFieldsHeight = sortedFields.reduce((sum, field) => sum + field.height, 0);
  const spacing = (totalHeight - totalFieldsHeight) / (fields.length - 1);

  let currentY = startY;

  return sortedFields.map(field => {
    const newField = { ...field, y: currentY };
    currentY += field.height + spacing;
    return newField;
  });
}

/**
 * Créer une grille de champs alignés
 */
export function createGrid(
  fields: Field[],
  columns: number,
  startX: number = 50,
  startY: number = 50,
  spacingX: number = 10,
  spacingY: number = 10
): Field[] {
  return fields.map((field, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    return {
      ...field,
      x: startX + col * (field.width + spacingX),
      y: startY + row * (field.height + spacingY)
    };
  });
}

/**
 * Aligner les champs d'un tableau (pour les lignes de devis)
 */
export function alignTableFields(
  fields: Field[],
  lineNumber: number,
  tableConfig: {
    startX: number;
    startY: number;
    lineHeight: number;
    columns: Array<{ field: string; x: number; width: number }>;
  }
): Field[] {
  const y = tableConfig.startY + (lineNumber - 1) * tableConfig.lineHeight;

  return fields.map(field => {
    const columnConfig = tableConfig.columns.find(col =>
      field.name.includes(col.field)
    );

    if (columnConfig) {
      return {
        ...field,
        x: tableConfig.startX + columnConfig.x,
        y: y,
        width: columnConfig.width,
        height: 25
      };
    }

    return field;
  });
}

/**
 * Configuration pour un tableau professionnel de devis
 */
export const DEVIS_TABLE_CONFIG = {
  startX: 30,
  startY: 350,
  lineHeight: 35,
  columns: [
    { field: 'reference', x: 0, width: 60 },
    { field: 'description', x: 65, width: 200 },
    { field: 'quantite', x: 270, width: 40 },
    { field: 'unite', x: 315, width: 40 },
    { field: 'prix_unitaire', x: 360, width: 60 },
    { field: 'tva', x: 425, width: 40 },
    { field: 'total', x: 470, width: 70 }
  ]
};

/**
 * Ajuster automatiquement la largeur des champs pour qu'ils s'adaptent au contenu
 */
export function autoSizeFields(fields: Field[], minWidth: number = 20, maxWidth: number = 300): Field[] {
  return fields.map(field => {
    let idealWidth = field.width;

    // Ajuster selon le type de champ
    if (field.name.includes('description')) {
      idealWidth = 200;
    } else if (field.name.includes('adresse')) {
      idealWidth = 250;
    } else if (field.name.includes('email')) {
      idealWidth = 180;
    } else if (field.name.includes('telephone') || field.name.includes('tel')) {
      idealWidth = 120;
    } else if (field.name.includes('code_postal') || field.name.includes('cp')) {
      idealWidth = 60;
    } else if (field.name.includes('ville')) {
      idealWidth = 150;
    } else if (field.name.includes('quantite') || field.name.includes('qte')) {
      idealWidth = 40;
    } else if (field.name.includes('prix') || field.name.includes('montant') || field.name.includes('total')) {
      idealWidth = 80;
    } else if (field.name.includes('pourcentage') || field.name.includes('tva')) {
      idealWidth = 50;
    } else if (field.name.includes('reference')) {
      idealWidth = 60;
    } else if (field.name.includes('unite')) {
      idealWidth = 40;
    } else if (field.name.includes('signature')) {
      idealWidth = 120;
    } else if (field.name.includes('date')) {
      idealWidth = 100;
    } else if (field.name.includes('numero')) {
      idealWidth = 120;
    }

    // Respecter les limites
    idealWidth = Math.max(minWidth, Math.min(maxWidth, idealWidth));

    return { ...field, width: idealWidth };
  });
}

/**
 * Organiser les champs en sections logiques pour un devis
 */
export function organizeDevisFields(fields: Field[]): Field[] {
  const organized: Field[] = [];

  // 1. En-tête agence (gauche)
  const agenceFields = fields.filter(f => f.name.includes('agence'));
  const alignedAgence = alignHorizontally(agenceFields, 'left');
  alignedAgence.forEach((field, index) => {
    field.x = 50;
    field.y = 50 + index * 25;
  });
  organized.push(...alignedAgence);

  // 2. Numérotation et dates (droite)
  const headerFields = fields.filter(f =>
    f.name.includes('numero_devis') ||
    f.name.includes('date_devis') ||
    f.name.includes('date_validite')
  );
  headerFields.forEach((field, index) => {
    field.x = 400;
    field.y = 50 + index * 25;
    field.width = 150;
  });
  organized.push(...headerFields);

  // 3. Informations client
  const clientFields = fields.filter(f => f.name.includes('client'));
  clientFields.forEach((field, index) => {
    field.x = 50;
    field.y = 180 + index * 25;

    // Ajuster les largeurs
    if (field.name.includes('nom')) field.width = 250;
    else if (field.name.includes('adresse')) field.width = 250;
    else if (field.name.includes('code_postal')) {
      field.width = 60;
      field.x = 50;
    } else if (field.name.includes('ville')) {
      field.width = 180;
      field.x = 120;
    } else if (field.name.includes('telephone')) {
      field.width = 120;
      field.x = 50;
    } else if (field.name.includes('email')) {
      field.width = 180;
      field.x = 180;
    }
  });
  organized.push(...clientFields);

  // 4. Lignes de tableau
  for (let i = 1; i <= 5; i++) {
    const lineFields = fields.filter(f => f.name.includes(`ligne_${i}_`));
    const alignedLine = alignTableFields(lineFields, i, DEVIS_TABLE_CONFIG);
    organized.push(...alignedLine);
  }

  // 5. Totaux (alignés à droite)
  const totalFields = fields.filter(f =>
    f.name.includes('total') ||
    f.name.includes('tva') ||
    f.name.includes('remise') ||
    f.name.includes('sous_total')
  );
  totalFields.forEach((field, index) => {
    if (field.name.includes('pourcentage')) {
      field.x = 420;
      field.width = 50;
    } else {
      field.x = 480;
      field.width = 80;
    }
    field.y = 550 + index * 25;

    // Le total TTC plus grand
    if (field.name === 'total_ttc') {
      field.height = 30;
      field.y = 655;
    }
  });
  organized.push(...totalFields);

  // 6. Conditions et signatures (bas de page)
  const footerFields = fields.filter(f =>
    f.name.includes('condition') ||
    f.name.includes('signature') ||
    f.name.includes('bon_pour') ||
    f.name.includes('cachet')
  );
  footerFields.forEach(field => {
    if (field.name.includes('signature_client')) {
      field.x = 320;
      field.y = 730;
      field.width = 120;
      field.height = 50;
    } else if (field.name.includes('cachet')) {
      field.x = 450;
      field.y = 730;
      field.width = 100;
      field.height = 50;
    } else {
      field.y = 700;
    }
  });
  organized.push(...footerFields);

  // Ajouter les champs restants
  const processedNames = new Set(organized.map(f => f.name));
  const remaining = fields.filter(f => !processedNames.has(f.name));
  organized.push(...remaining);

  return organized;
}