import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateLeadTypes() {
  console.log('🔄 Migration des types de leads...\n');

  // Récupérer tous les contacts sans type défini
  const contacts = await prisma.contact.findMany({
    where: {
      type: null
    }
  });

  console.log(`📊 ${contacts.length} leads sans type trouvés\n`);

  let updated = 0;

  for (const contact of contacts) {
    let detectedType: string | null = null;

    // Analyser le message pour détecter le type
    if (contact.message) {
      if (contact.message.includes('Type: Professionnel')) {
        detectedType = 'professional';
      } else if (contact.message.includes('Type: Mannequin')) {
        detectedType = 'model';
      }
    }

    if (detectedType) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: { type: detectedType }
      });

      console.log(`✅ ${contact.name} → ${detectedType === 'professional' ? 'Professionnel' : 'Mannequin'}`);
      updated++;
    } else {
      console.log(`⚠️  ${contact.name} → Type non détecté (message: ${contact.message?.substring(0, 50)}...)`);
    }
  }

  console.log(`\n✨ Migration terminée : ${updated}/${contacts.length} leads mis à jour`);

  await prisma.$disconnect();
}

migrateLeadTypes().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
