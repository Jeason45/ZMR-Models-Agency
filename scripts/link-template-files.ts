import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Script pour lier les fichiers DOCX existants aux templates dans la DB
 */

async function main() {
  console.log('🔗 Liaison des fichiers DOCX aux templates...\n');

  // Récupérer tous les templates
  const templates = await prisma.documentTemplate.findMany();
  console.log(`📋 ${templates.length} template(s) trouvé(s)\n`);

  // Lister tous les fichiers DOCX dans storage/templates
  const templatesDir = path.join(process.cwd(), 'storage', 'templates');

  if (!fs.existsSync(templatesDir)) {
    console.error(`❌ Le dossier ${templatesDir} n'existe pas`);
    return;
  }

  const docxFiles = fs.readdirSync(templatesDir)
    .filter(file => file.endsWith('.docx'))
    .map(file => ({
      fileName: file,
      filePath: `storage/templates/${file}`,
      baseName: file.replace('.docx', '')
    }));

  console.log(`📄 ${docxFiles.length} fichier(s) DOCX trouvé(s):\n`);
  docxFiles.forEach(file => console.log(`   - ${file.fileName}`));
  console.log('');

  let linkedCount = 0;
  let skippedCount = 0;

  for (const template of templates) {
    // Chercher un fichier DOCX qui correspond au fileName du template
    let matchingFile = docxFiles.find(file =>
      file.fileName === template.fileName
    );

    // Si pas de match exact, essayer avec le slug
    if (!matchingFile) {
      matchingFile = docxFiles.find(file =>
        file.baseName.toLowerCase().replace(/_/g, '-') === template.slug.toLowerCase()
      );
    }

    // Si toujours pas de match, essayer avec le nom
    if (!matchingFile) {
      const templateNameNormalized = template.name
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '_');

      matchingFile = docxFiles.find(file =>
        file.baseName.toLowerCase().includes(templateNameNormalized) ||
        templateNameNormalized.includes(file.baseName.toLowerCase())
      );
    }

    if (matchingFile) {
      // Vérifier si le template a déjà un filePath valide
      if (template.filePath && template.filePath.trim() !== '' && template.filePath === matchingFile.filePath) {
        console.log(`⏭️  "${template.name}" → Déjà lié à ${matchingFile.fileName}`);
        skippedCount++;
      } else {
        // Mettre à jour le template
        await prisma.documentTemplate.update({
          where: { id: template.id },
          data: {
            fileName: matchingFile.fileName,
            filePath: matchingFile.filePath
          }
        });
        console.log(`✅ "${template.name}" → ${matchingFile.fileName}`);
        linkedCount++;
      }
    } else {
      console.log(`❌ "${template.name}" → Aucun fichier correspondant trouvé`);
      skippedCount++;
    }
  }

  console.log(`\n🎉 Liaison terminée!`);
  console.log(`   ${linkedCount} template(s) lié(s)`);
  console.log(`   ${skippedCount} template(s) ignoré(s) ou déjà liés`);

  console.log('\n✨ Tous les templates ont été traités!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
