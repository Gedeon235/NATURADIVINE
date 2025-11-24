// scripts/testEmailService.ts
import { verifySMTPConfig, sendWelcomeEmail, sendOrderConfirmation } from '../utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const testEmailService = async () => {
  console.log('🧪 Test du service email...\n');

  // 1. Test de la configuration SMTP
  console.log('1. Vérification de la configuration SMTP...');
  const smtpValid = await verifySMTPConfig();
  if (!smtpValid) {
    console.log('❌ Configuration SMTP invalide');
    console.log('💡 Vérifiez vos variables d\'environnement SMTP_*');
    process.exit(1);
  }
  console.log('✅ Configuration SMTP valide\n');

  // 2. Vérifier que SMTP_USER est défini
  const testEmail = process.env.SMTP_USER;
  if (!testEmail) {
    console.log('❌ SMTP_USER non défini dans les variables d\'environnement');
    console.log('💡 Ajoutez SMTP_USER=votre-email@gmail.com dans votre fichier .env');
    process.exit(1);
  }

  // 3. Test d'envoi d'email de bienvenue
  console.log('2. Test d\'envoi d\'email de bienvenue...');
  const testUser = {
    name: 'Test User',
    email: testEmail
  };

  try {
    const welcomeEmailSent = await sendWelcomeEmail(testUser);
    if (welcomeEmailSent) {
      console.log('✅ Email de bienvenue envoyé avec succès!');
    } else {
      console.log('❌ Échec de l\'envoi de l\'email de bienvenue');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', error);
  }

  // 4. Test d'envoi d'email de confirmation de commande
  console.log('\n3. Test d\'envoi d\'email de confirmation de commande...');
  const testOrder = {
    _id: 'TEST_ORDER_123',
    orderNumber: 'CMD-TEST-001',
    totalAmount: 25000,
    items: [
      { product: { name: 'Huile d\'Argan Bio' }, quantity: 2, price: 12500 }
    ],
    paymentMethod: 'cash'
  };

  try {
    const orderEmailSent = await sendOrderConfirmation(testOrder, testUser);
    if (orderEmailSent) {
      console.log('✅ Email de confirmation de commande envoyé avec succès!');
    } else {
      console.log('❌ Échec de l\'envoi de l\'email de confirmation de commande');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de commande:', error);
  }

  console.log(`\n📧 Vérifiez votre boîte de réception: ${testUser.email}`);
  console.log('🎉 Tests email terminés!');
};

testEmailService();