import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initialisation des templates HTML...');

  // Lire le template devis-moderne
  const devisTemplatePath = path.join(process.cwd(), 'templates', 'documents', 'devis-moderne.html');
  const devisHtmlContent = await fs.readFile(devisTemplatePath, 'utf-8');

  // Créer ou mettre à jour le template devis-moderne
  const devisTemplate = await prisma.documentTemplate.upsert({
    where: { slug: 'devis-moderne' },
    update: {
      name: 'Devis Moderne',
      description: 'Template de devis moderne et professionnel avec design épuré',
      type: 'DEVIS',
      category: 'commercial',
      format: 'html',
      htmlContent: devisHtmlContent,
      variables: [
        // Agence
        'nom_agence', 'adresse_agence', 'code_postal_agence', 'ville_agence',
        'telephone_agence', 'email_agence', 'siret_agence',
        // Document
        'numero_devis', 'date_devis', 'date_validite', 'objet_devis',
        // Client
        'nom_client', 'adresse_client', 'code_postal_client', 'ville_client',
        'telephone_client', 'email_client',
        // Lignes de prestations (array)
        'lignes',
        // Totaux
        'sous_total_ht', 'tva_pourcentage', 'tva_montant', 'total_ttc',
        'remise_montant', 'remise_pourcentage',
        // Conditions
        'conditions_reglement', 'mode_reglement', 'acompte_montant',
        'acompte_pourcentage', 'delai_livraison', 'validite_jours'
      ],
      fieldMapping: {
        // Auto-remplissage depuis AgencySettings
        nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true },
        adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true },
        telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true },
        email_agence: { source: 'agency', field: 'email_agence', autoFill: true },
        siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true },

        // Auto-remplissage depuis Contact
        nom_client: { source: 'contact', field: 'name', autoFill: true },
        adresse_client: { source: 'contact', field: 'adresse_client', autoFill: true },
        code_postal_client: { source: 'contact', field: 'code_postal', autoFill: true },
        ville_client: { source: 'contact', field: 'ville', autoFill: true },
        telephone_client: { source: 'contact', field: 'phone', autoFill: true },
        email_client: { source: 'contact', field: 'email', autoFill: true }
      },
      isActive: true,
      isDefault: true,
      requiresSignature: false
    },
    create: {
      name: 'Devis Moderne',
      slug: 'devis-moderne',
      description: 'Template de devis moderne et professionnel avec design épuré',
      type: 'DEVIS',
      category: 'commercial',
      format: 'html',
      htmlContent: devisHtmlContent,
      variables: [
        // Agence
        'nom_agence', 'adresse_agence', 'code_postal_agence', 'ville_agence',
        'telephone_agence', 'email_agence', 'siret_agence',
        // Document
        'numero_devis', 'date_devis', 'date_validite', 'objet_devis',
        // Client
        'nom_client', 'adresse_client', 'code_postal_client', 'ville_client',
        'telephone_client', 'email_client',
        // Lignes de prestations (array)
        'lignes',
        // Totaux
        'sous_total_ht', 'tva_pourcentage', 'tva_montant', 'total_ttc',
        'remise_montant', 'remise_pourcentage',
        // Conditions
        'conditions_reglement', 'mode_reglement', 'acompte_montant',
        'acompte_pourcentage', 'delai_livraison', 'validite_jours'
      ],
      fieldMapping: {
        // Auto-remplissage depuis AgencySettings
        nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true },
        adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true },
        telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true },
        email_agence: { source: 'agency', field: 'email_agence', autoFill: true },
        siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true },

        // Auto-remplissage depuis Contact
        nom_client: { source: 'contact', field: 'name', autoFill: true },
        adresse_client: { source: 'contact', field: 'adresse_client', autoFill: true },
        code_postal_client: { source: 'contact', field: 'code_postal', autoFill: true },
        ville_client: { source: 'contact', field: 'ville', autoFill: true },
        telephone_client: { source: 'contact', field: 'phone', autoFill: true },
        email_client: { source: 'contact', field: 'email', autoFill: true }
      },
      isActive: true,
      isDefault: true,
      requiresSignature: false
    }
  });

  console.log('✅ Template devis-moderne créé/mis à jour:', devisTemplate.id);

  // ========================================
  // TEMPLATE FACTURE PROFESSIONNELLE
  // ========================================
  console.log('\n📄 Initialisation du template Facture...');

  const factureTemplatePath = path.join(process.cwd(), 'templates', 'documents', 'facture-professionnelle.html');
  const factureHtmlContent = await fs.readFile(factureTemplatePath, 'utf-8');

  const factureTemplate = await prisma.documentTemplate.upsert({
    where: { slug: 'facture-professionnelle' },
    update: {
      name: 'Facture Professionnelle',
      description: 'Template de facture professionnelle avec design moderne',
      type: 'FACTURE',
      category: 'commercial',
      format: 'html',
      htmlContent: factureHtmlContent,
      variables: [
        // Agence
        'nom_agence', 'adresse_agence', 'code_postal_agence', 'ville_agence',
        'telephone_agence', 'email_agence', 'siret_agence', 'tva_agence',
        // Document
        'numero_facture', 'date_facture', 'date_echeance', 'statut_paiement',
        // Client
        'nom_client', 'adresse_client', 'code_postal_client', 'ville_client',
        'telephone_client', 'email_client',
        // Lignes de prestations (array)
        'lignes',
        // Totaux
        'sous_total_ht', 'tva_pourcentage', 'tva_montant', 'total_ttc',
        'remise_montant', 'remise_pourcentage',
        // Paiement
        'conditions_reglement', 'mode_reglement', 'iban'
      ],
      fieldMapping: {
        // Auto-remplissage depuis AgencySettings
        nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true },
        adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true },
        code_postal_agence: { source: 'agency', field: 'code_postal_agence', autoFill: true },
        ville_agence: { source: 'agency', field: 'ville_agence', autoFill: true },
        telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true },
        email_agence: { source: 'agency', field: 'email_agence', autoFill: true },
        siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true },
        iban: { source: 'agency', field: 'iban', autoFill: true },

        // Auto-remplissage depuis Contact
        nom_client: { source: 'contact', field: 'name', autoFill: true },
        adresse_client: { source: 'contact', field: 'adresse_client', autoFill: true },
        code_postal_client: { source: 'contact', field: 'code_postal', autoFill: true },
        ville_client: { source: 'contact', field: 'ville', autoFill: true },
        telephone_client: { source: 'contact', field: 'phone', autoFill: true },
        email_client: { source: 'contact', field: 'email', autoFill: true }
      },
      isActive: true,
      isDefault: true,
      requiresSignature: false
    },
    create: {
      name: 'Facture Professionnelle',
      slug: 'facture-professionnelle',
      description: 'Template de facture professionnelle avec design moderne',
      type: 'FACTURE',
      category: 'commercial',
      format: 'html',
      htmlContent: factureHtmlContent,
      variables: [
        // Agence
        'nom_agence', 'adresse_agence', 'code_postal_agence', 'ville_agence',
        'telephone_agence', 'email_agence', 'siret_agence', 'tva_agence',
        // Document
        'numero_facture', 'date_facture', 'date_echeance', 'statut_paiement',
        // Client
        'nom_client', 'adresse_client', 'code_postal_client', 'ville_client',
        'telephone_client', 'email_client',
        // Lignes de prestations (array)
        'lignes',
        // Totaux
        'sous_total_ht', 'tva_pourcentage', 'tva_montant', 'total_ttc',
        'remise_montant', 'remise_pourcentage',
        // Paiement
        'conditions_reglement', 'mode_reglement', 'iban'
      ],
      fieldMapping: {
        // Auto-remplissage depuis AgencySettings
        nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true },
        adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true },
        code_postal_agence: { source: 'agency', field: 'code_postal_agence', autoFill: true },
        ville_agence: { source: 'agency', field: 'ville_agence', autoFill: true },
        telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true },
        email_agence: { source: 'agency', field: 'email_agence', autoFill: true },
        siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true },
        iban: { source: 'agency', field: 'iban', autoFill: true },

        // Auto-remplissage depuis Contact
        nom_client: { source: 'contact', field: 'name', autoFill: true },
        adresse_client: { source: 'contact', field: 'adresse_client', autoFill: true },
        code_postal_client: { source: 'contact', field: 'code_postal', autoFill: true },
        ville_client: { source: 'contact', field: 'ville', autoFill: true },
        telephone_client: { source: 'contact', field: 'phone', autoFill: true },
        email_client: { source: 'contact', field: 'email', autoFill: true }
      },
      isActive: true,
      isDefault: true,
      requiresSignature: false
    }
  });

  console.log('✅ Template facture-professionnelle créé/mis à jour:', factureTemplate.id);

  // ========================================
  // TEMPLATE CONTRAT MANNEQUINAT
  // ========================================
  console.log('\n📄 Initialisation du template Contrat...');

  const contratTemplatePath = path.join(process.cwd(), 'templates', 'documents', 'contrat-mannequinat.html');
  const contratHtmlContent = await fs.readFile(contratTemplatePath, 'utf-8');

  const contratTemplate = await prisma.documentTemplate.upsert({
    where: { slug: 'contrat-mannequinat' },
    update: {
      name: 'Contrat de Mannequinat',
      description: 'Contrat de mannequinat professionnel avec articles légaux',
      type: 'CONTRAT',
      category: 'juridique',
      format: 'html',
      htmlContent: contratHtmlContent,
      variables: [
        // Agence
        'nom_agence', 'adresse_agence', 'code_postal_agence', 'ville_agence',
        'telephone_agence', 'email_agence', 'siret_agence',
        'representant_nom', 'representant_qualite',
        // Document
        'numero_contrat', 'date_contrat', 'objet_contrat',
        'date_debut', 'date_fin', 'preavis',
        // Mannequin
        'nom_mannequin', 'adresse_mannequin', 'code_postal_mannequin', 'ville_mannequin',
        'telephone_mannequin', 'email_mannequin', 'date_naissance',
        // Conditions
        'tarif_shooting', 'tarif_defile', 'commission_agence',
        'exclusivite',
        // Signature
        'ville_signature', 'date_signature'
      ],
      fieldMapping: {
        // Auto-remplissage depuis AgencySettings
        nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true },
        adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true },
        code_postal_agence: { source: 'agency', field: 'code_postal_agence', autoFill: true },
        ville_agence: { source: 'agency', field: 'ville_agence', autoFill: true },
        telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true },
        email_agence: { source: 'agency', field: 'email_agence', autoFill: true },
        siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true },

        // Auto-remplissage depuis Contact (mannequin)
        nom_mannequin: { source: 'contact', field: 'name', autoFill: true },
        adresse_mannequin: { source: 'contact', field: 'adresse_client', autoFill: true },
        code_postal_mannequin: { source: 'contact', field: 'code_postal', autoFill: true },
        ville_mannequin: { source: 'contact', field: 'ville', autoFill: true },
        telephone_mannequin: { source: 'contact', field: 'phone', autoFill: true },
        email_mannequin: { source: 'contact', field: 'email', autoFill: true }
      },
      isActive: true,
      isDefault: true,
      requiresSignature: true
    },
    create: {
      name: 'Contrat de Mannequinat',
      slug: 'contrat-mannequinat',
      description: 'Contrat de mannequinat professionnel avec articles légaux',
      type: 'CONTRAT',
      category: 'juridique',
      format: 'html',
      htmlContent: contratHtmlContent,
      variables: [
        // Agence
        'nom_agence', 'adresse_agence', 'code_postal_agence', 'ville_agence',
        'telephone_agence', 'email_agence', 'siret_agence',
        'representant_nom', 'representant_qualite',
        // Document
        'numero_contrat', 'date_contrat', 'objet_contrat',
        'date_debut', 'date_fin', 'preavis',
        // Mannequin
        'nom_mannequin', 'adresse_mannequin', 'code_postal_mannequin', 'ville_mannequin',
        'telephone_mannequin', 'email_mannequin', 'date_naissance',
        // Conditions
        'tarif_shooting', 'tarif_defile', 'commission_agence',
        'exclusivite',
        // Signature
        'ville_signature', 'date_signature'
      ],
      fieldMapping: {
        // Auto-remplissage depuis AgencySettings
        nom_agence: { source: 'agency', field: 'nom_agence', autoFill: true },
        adresse_agence: { source: 'agency', field: 'adresse_agence', autoFill: true },
        code_postal_agence: { source: 'agency', field: 'code_postal_agence', autoFill: true },
        ville_agence: { source: 'agency', field: 'ville_agence', autoFill: true },
        telephone_agence: { source: 'agency', field: 'telephone_agence', autoFill: true },
        email_agence: { source: 'agency', field: 'email_agence', autoFill: true },
        siret_agence: { source: 'agency', field: 'siret_agence', autoFill: true },

        // Auto-remplissage depuis Contact (mannequin)
        nom_mannequin: { source: 'contact', field: 'name', autoFill: true },
        adresse_mannequin: { source: 'contact', field: 'adresse_client', autoFill: true },
        code_postal_mannequin: { source: 'contact', field: 'code_postal', autoFill: true },
        ville_mannequin: { source: 'contact', field: 'ville', autoFill: true },
        telephone_mannequin: { source: 'contact', field: 'phone', autoFill: true },
        email_mannequin: { source: 'contact', field: 'email', autoFill: true }
      },
      isActive: true,
      isDefault: true,
      requiresSignature: true
    }
  });

  console.log('✅ Template contrat-mannequinat créé/mis à jour:', contratTemplate.id);

  console.log('\n📊 Résumé:');
  console.log('\n1. DEVIS:');
  console.log('   - Template:', devisTemplate.name);
  console.log('   - Slug:', devisTemplate.slug);
  console.log('   - Format:', devisTemplate.format);
  console.log('   - Type:', devisTemplate.type);
  console.log('   - Variables:', (devisTemplate.variables as string[]).length);
  console.log('   - Default:', devisTemplate.isDefault ? 'Oui' : 'Non');

  console.log('\n2. FACTURE:');
  console.log('   - Template:', factureTemplate.name);
  console.log('   - Slug:', factureTemplate.slug);
  console.log('   - Format:', factureTemplate.format);
  console.log('   - Type:', factureTemplate.type);
  console.log('   - Variables:', (factureTemplate.variables as string[]).length);
  console.log('   - Default:', factureTemplate.isDefault ? 'Oui' : 'Non');

  console.log('\n3. CONTRAT:');
  console.log('   - Template:', contratTemplate.name);
  console.log('   - Slug:', contratTemplate.slug);
  console.log('   - Format:', contratTemplate.format);
  console.log('   - Type:', contratTemplate.type);
  console.log('   - Variables:', (contratTemplate.variables as string[]).length);
  console.log('   - Default:', contratTemplate.isDefault ? 'Oui' : 'Non');
  console.log('   - Signature requise:', contratTemplate.requiresSignature ? 'Oui' : 'Non');

  console.log('\n✨ Les 3 templates HTML ont été initialisés avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
