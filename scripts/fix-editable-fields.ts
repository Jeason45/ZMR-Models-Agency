import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour deviner le type de champ en fonction du nom de la variable
function guessFieldType(varName: string): 'text' | 'email' | 'date' | 'number' | 'textarea' {
  const lowerName = varName.toLowerCase();

  if (lowerName.includes('email') || lowerName.includes('mail')) return 'email';
  if (lowerName.includes('date') || lowerName.includes('naissance')) return 'date';
  if (lowerName.includes('tarif') || lowerName.includes('montant') || lowerName.includes('prix') ||
      lowerName.includes('cachet') || lowerName.includes('volume')) return 'number';
  if (lowerName.includes('description') || lowerName.includes('message') ||
      lowerName.includes('notes') || lowerName.includes('modifications')) return 'textarea';

  return 'text';
}

// Fonction pour formater le label à partir du nom de variable
function formatLabel(varName: string): string {
  return varName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function main() {
  console.log('🔧 Correction des editableFields pour correspondre aux variables existantes...\n');

  // Récupérer tous les templates avec signature
  const templates = await prisma.documentTemplate.findMany({
    where: {
      requiresSignature: true
    }
  });

  console.log(`📋 ${templates.length} template(s) avec signature trouvé(s)\n`);

  for (const template of templates) {
    const variables = template.variables as string[];

    if (!variables || variables.length === 0) {
      console.log(`⚠️  "${template.name}" n'a pas de variables, skip.`);
      continue;
    }

    console.log(`✏️  Configuration de "${template.name}"...`);
    console.log(`   Variables existantes: ${variables.join(', ')}`);

    // Créer les editableFields basés sur les variables existantes
    const editableFields = variables.map(varName => ({
      name: varName,
      label: formatLabel(varName),
      type: guessFieldType(varName),
      required: true, // Toutes les variables sont requises par défaut
      placeholder: `Entrez ${formatLabel(varName).toLowerCase()}`,
      defaultValue: ''
    }));

    // Mettre à jour le template
    await prisma.documentTemplate.update({
      where: { id: template.id },
      data: {
        editableFields: editableFields
      }
    });

    console.log(`✅ Configuré avec ${editableFields.length} champ(s):`);
    editableFields.forEach(field => {
      console.log(`   - ${field.label} (${field.type})`);
    });
    console.log('');
  }

  console.log('🎉 Configuration terminée!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
