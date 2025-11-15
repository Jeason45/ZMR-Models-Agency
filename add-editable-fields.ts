import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addEditableFields() {
  console.log('📝 Ajout des champs éditables aux templates...\n');

  // Devis Moderne - Juste le nom pour confirmer l'identité
  const devisFields = [
    {
      name: 'nom_complet',
      label: 'Votre nom complet',
      type: 'text' as const,
      required: true,
      placeholder: 'Prénom NOM',
      position: { page: 1, x: 50, y: 150, width: 300, height: 40 }
    }
  ];

  // Contrat - Juste le nom pour confirmer l'identité
  const contratFields = [
    {
      name: 'nom_complet',
      label: 'Votre nom complet',
      type: 'text' as const,
      required: true,
      placeholder: 'Prénom NOM',
      position: { page: 1, x: 50, y: 150, width: 300, height: 40 }
    }
  ];

  try {
    // Mettre à jour le Devis Moderne
    const devisTemplate = await prisma.documentTemplate.findFirst({
      where: { slug: 'devis-moderne' }
    });

    if (devisTemplate) {
      await prisma.documentTemplate.update({
        where: { id: devisTemplate.id },
        data: {
          editableFields: devisFields as any
        }
      });
      console.log('✅ Champs éditables ajoutés au template "Devis Moderne"');
      console.log(`   → ${devisFields.length} champ configuré (nom uniquement)`);
    }

    // Mettre à jour le Contrat Mannequinat
    const contratTemplate = await prisma.documentTemplate.findFirst({
      where: { slug: 'contrat-mannequinat' }
    });

    if (contratTemplate) {
      await prisma.documentTemplate.update({
        where: { id: contratTemplate.id },
        data: {
          editableFields: contratFields as any
        }
      });
      console.log('✅ Champs éditables ajoutés au template "Contrat Mannequinat"');
      console.log(`   → ${contratFields.length} champ configuré (nom uniquement)`);
    }

    console.log('\n🎉 Champs éditables configurés avec succès !');
    console.log('\nLe processus de signature affichera maintenant :');
    console.log('  1️⃣  Confirmation du nom (pré-rempli)');
    console.log('  2️⃣  Signature électronique');
    console.log('  3️⃣  Validation finale');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addEditableFields();
