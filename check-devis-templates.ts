import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const templates = await prisma.documentTemplate.findMany({
      where: {
        type: 'DEVIS',
        isActive: true
      }
    });

    console.log(`\n✅ Templates DEVIS trouvés: ${templates.length}\n`);

    if (templates.length === 0) {
      console.log('⚠️  Aucun template DEVIS trouvé. Création d\'un template par défaut...\n');

      const newTemplate = await prisma.documentTemplate.create({
        data: {
          name: 'Devis Moderne',
          slug: 'devis-moderne',
          type: 'DEVIS',
          category: 'commercial',
          description: 'Template moderne pour les devis',
          format: 'html',
          isDefault: true,
          isActive: true,
          htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .info { margin-bottom: 30px; }
    .items { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .items th, .items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .items th { background-color: #f4f4f4; }
    .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>DEVIS</h1>
    <p>N° {{numero_devis}}</p>
    <p>Date: {{date}}</p>
  </div>

  <div class="info">
    <h3>Client</h3>
    <p>{{nom_client}}</p>
    <p>{{email_client}}</p>
    <p>{{telephone_client}}</p>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantité</th>
        <th>Prix unitaire</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{items}}
    </tbody>
  </table>

  <div class="total">
    Total HT: {{montant_ht}} €<br>
    TVA ({{tva}}%): {{montant_tva}} €<br>
    <strong>Total TTC: {{montant_ttc}} €</strong>
  </div>
</body>
</html>
          `,
          variables: [
            'numero_devis',
            'date',
            'nom_client',
            'email_client',
            'telephone_client',
            'items',
            'montant_ht',
            'tva',
            'montant_tva',
            'montant_ttc'
          ]
        }
      });

      console.log(`✅ Template créé: ${newTemplate.name}\n`);
    } else {
      templates.forEach(t => {
        console.log(`  - ${t.name} (${t.format}) - Default: ${t.isDefault}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
