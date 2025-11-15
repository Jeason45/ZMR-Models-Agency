import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const templates = [
  {
    name: 'Devis Moderne',
    slug: 'devis-moderne',
    type: 'DEVIS',
    category: 'commercial',
    description: 'Devis moderne avec design professionnel généré en PDF via Puppeteer',
    format: 'html',
    htmlFile: 'templates/documents/devis-moderne.html',
    requiresSignature: true,
    isDefault: true,
    variables: [
      // Info agence
      'nom_agence',
      'adresse_agence',
      'ville_agence',
      'code_postal_agence',
      'telephone_agence',
      'email_agence',
      'siret_agence',
      'tva_agence',
      // Info devis
      'numero_devis',
      'date_devis',
      'date_validite',
      'validite_jours',
      'objet_devis',
      // Info client
      'nom_client',
      'adresse_client',
      'ville_client',
      'code_postal_client',
      'telephone_client',
      'email_client',
      // Lignes
      'lignes',
      'description',
      'quantite',
      'unite',
      'prix_unitaire',
      // Totaux
      'total_ht',
      'sous_total_ht',
      'tva_pourcentage',
      'tva_montant',
      'total_ttc',
      // Options
      'remise_pourcentage',
      'remise_montant',
      'acompte_pourcentage',
      'acompte_montant',
      // Conditions
      'conditions_reglement',
      'mode_reglement',
      'delai_livraison'
    ]
  },
  {
    name: 'Contrat Mannequinat Mode',
    slug: 'contrat-mannequinat',
    type: 'CONTRAT',
    category: 'talent',
    description: 'Contrat professionnel pour mannequins - Format moderne HTML',
    format: 'html',
    htmlFile: 'templates/documents/contrat-mannequinat.html',
    requiresSignature: true,
    isDefault: true,
    variables: [
      'numero_contrat',
      'date_contrat',
      'nom_talent',
      'prenom_talent',
      'date_naissance',
      'adresse_talent',
      'telephone_talent',
      'email_talent',
      'nom_client',
      'adresse_client',
      'date_debut',
      'date_fin',
      'tarif_journalier',
      'conditions_particulieres'
    ]
  },
  {
    name: 'Facture Professionnelle',
    slug: 'facture-professionnelle',
    type: 'FACTURE',
    category: 'commercial',
    description: 'Facture professionnelle moderne générée en PDF',
    format: 'html',
    htmlFile: 'templates/documents/facture-professionnelle.html',
    requiresSignature: false,
    isDefault: true,
    variables: [
      'numero_facture',
      'date_emission',
      'date_echeance',
      'nom_client',
      'adresse_client',
      'lignes_facture',
      'montant_ht',
      'montant_tva',
      'montant_ttc',
      'conditions_paiement',
      'iban',
      'bic'
    ]
  }
];

async function restoreTemplates() {
  try {
    console.log('🔄 Restauration des templates dans la base de données...\n');

    for (const template of templates) {
      // Lire le fichier HTML
      const htmlPath = path.join(process.cwd(), template.htmlFile);

      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  Fichier non trouvé: ${template.htmlFile}`);
        continue;
      }

      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

      // Vérifier si le template existe déjà
      const existing = await prisma.documentTemplate.findUnique({
        where: { slug: template.slug }
      });

      if (existing) {
        console.log(`✓ Template "${template.name}" existe déjà (ID: ${existing.id})`);
        continue;
      }

      // Créer le mapping automatique
      const { DocumentDataMapper } = await import('./lib/documentDataMapper');
      const fieldMapping = DocumentDataMapper.createDefaultMapping(
        template.variables,
        template.type,
        template.category
      );

      // Créer le template
      const created = await prisma.documentTemplate.create({
        data: {
          name: template.name,
          slug: template.slug,
          type: template.type,
          category: template.category,
          description: template.description,
          format: template.format,
          htmlContent: htmlContent,
          variables: template.variables,
          fieldMapping: fieldMapping as any,
          requiresSignature: template.requiresSignature,
          isActive: true,
          isDefault: template.isDefault
        }
      });

      console.log(`✅ Template "${template.name}" créé (ID: ${created.id})`);
    }

    console.log('\n✅ Restauration terminée !');

    // Vérifier le résultat
    const count = await prisma.documentTemplate.count();
    console.log(`\n📊 Total de templates dans la base: ${count}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreTemplates();
