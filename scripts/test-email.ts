/**
 * Script de test pour vérifier la configuration SMTP
 *
 * Usage: npx tsx scripts/test-email.ts
 */

import { sendEmail, testEmailConnection } from '../lib/emailUtils';

async function main() {
  console.log('🚀 Test de configuration SMTP...\n');

  // Test 1: Vérifier la connexion SMTP
  console.log('📡 Test 1: Vérification de la connexion SMTP...');
  const connectionOk = await testEmailConnection();

  if (!connectionOk) {
    console.log('\n❌ ÉCHEC: Impossible de se connecter au serveur SMTP');
    console.log('\n📋 Vérifications à faire:');
    console.log('  1. SMTP_HOST est correct (smtp.gmail.com)');
    console.log('  2. SMTP_PORT est correct (587)');
    console.log('  3. SMTP_USER contient votre email Gmail');
    console.log('  4. SMTP_PASSWORD contient votre App Password Gmail (sans espaces)');
    console.log('\n💡 Pour obtenir un App Password Gmail:');
    console.log('  https://myaccount.google.com/apppasswords');
    process.exit(1);
  }

  console.log('✅ Connexion SMTP réussie!\n');

  // Test 2: Envoyer un email de test
  console.log('📧 Test 2: Envoi d\'un email de test...');

  const testRecipient = process.env.ADMIN_EMAIL || 'jlwebdesign33@gmail.com';

  try {
    const result = await sendEmail({
      to: testRecipient,
      subject: '✅ Test Email - ZMR Models Agency',
      htmlContent: `
        <h1>🎉 Configuration SMTP réussie !</h1>
        <p>Votre système d'envoi d'emails fonctionne correctement.</p>
        <p><strong>ZMR Models Agency</strong> peut maintenant envoyer des documents automatiquement.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Ceci est un email de test envoyé à ${new Date().toLocaleString('fr-FR')}
        </p>
      `,
      textContent: `
Configuration SMTP réussie !

Votre système d'envoi d'emails fonctionne correctement.
ZMR Models Agency peut maintenant envoyer des documents automatiquement.

---
Ceci est un email de test envoyé à ${new Date().toLocaleString('fr-FR')}
      `,
      type: 'custom',
      sentBy: 'System Test'
    });

    if (result.success) {
      console.log('✅ Email envoyé avec succès!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log(`   Mail Log ID: ${result.mailLogId}`);
      console.log(`\n📬 Vérifiez votre boîte mail: ${testRecipient}`);
      console.log('\n✨ Configuration SMTP opérationnelle!\n');
    } else {
      console.log('❌ ÉCHEC de l\'envoi:', result.error);
      console.log('\n📋 Détails de l\'erreur enregistrés dans la base de données');
      console.log(`   Mail Log ID: ${result.mailLogId}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error);
    process.exit(1);
  }

  console.log('\n🎯 Test terminé!');
  console.log('\nProchaines étapes:');
  console.log('  1. ✅ Vérifier que l\'email de test est arrivé');
  console.log('  2. ✅ Configurer les mêmes variables sur Vercel');
  console.log('  3. ✅ Redéployer sur Vercel');
  console.log('\n');

  process.exit(0);
}

// Exécuter le test
main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
