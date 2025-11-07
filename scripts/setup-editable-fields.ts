import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Recherche des templates disponibles...\n');

  // Lister tous les templates
  const templates = await prisma.documentTemplate.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      requiresSignature: true,
      variables: true,
      editableFields: true
    },
    orderBy: { name: 'asc' }
  });

  if (templates.length === 0) {
    console.log('❌ Aucun template trouvé dans la base de données.');
    console.log('Veuillez d\'abord créer des templates.');
    return;
  }

  console.log(`📋 ${templates.length} template(s) trouvé(s):\n`);
  templates.forEach((t, index) => {
    console.log(`${index + 1}. ${t.name} (${t.type})`);
    console.log(`   ID: ${t.id}`);
    console.log(`   Signature requise: ${t.requiresSignature ? 'Oui' : 'Non'}`);
    console.log(`   Variables: ${JSON.stringify(t.variables)}`);
    console.log(`   EditableFields: ${t.editableFields ? 'Déjà configuré' : 'Non configuré'}`);
    console.log('');
  });

  // Exemple de configuration pour un contrat type
  const editableFieldsExample = [
    {
      name: 'nom_complet',
      label: 'Nom complet',
      type: 'text',
      required: true,
      placeholder: 'Ex: Jean Dupont',
      defaultValue: ''
    },
    {
      name: 'adresse',
      label: 'Adresse complète',
      type: 'text',
      required: true,
      placeholder: 'Ex: 123 rue de la Paix, 75001 Paris',
      defaultValue: ''
    },
    {
      name: 'telephone',
      label: 'Téléphone',
      type: 'text',
      required: true,
      placeholder: 'Ex: +33 6 12 34 56 78',
      defaultValue: ''
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Ex: email@example.com',
      defaultValue: ''
    },
    {
      name: 'date_naissance',
      label: 'Date de naissance',
      type: 'date',
      required: true,
      placeholder: '',
      defaultValue: ''
    },
    {
      name: 'numero_securite_sociale',
      label: 'Numéro de sécurité sociale',
      type: 'text',
      required: false,
      placeholder: 'Ex: 1 23 45 67 890 123 45',
      defaultValue: ''
    }
  ];

  console.log('🔧 Configuration des editableFields pour les templates...\n');

  // Mettre à jour chaque template qui nécessite une signature
  for (const template of templates) {
    if (template.requiresSignature && !template.editableFields) {
      console.log(`✏️  Configuration de "${template.name}"...`);

      await prisma.documentTemplate.update({
        where: { id: template.id },
        data: {
          editableFields: editableFieldsExample
        }
      });

      console.log(`✅ "${template.name}" configuré avec ${editableFieldsExample.length} champs éditables\n`);
    }
  }

  console.log('🎉 Configuration terminée!');
  console.log('\n📝 Les champs configurés sont:');
  editableFieldsExample.forEach((field, index) => {
    console.log(`   ${index + 1}. ${field.label} (${field.type})${field.required ? ' *' : ''}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
