// utils/emailService.ts
import * as nodemailer from 'nodemailer';

// Configuration du transporteur SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Vérification de la configuration SMTP
export const verifySMTPConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Configuration SMTP valide');
    return true;
  } catch (error) {
    console.error('❌ Erreur configuration SMTP:', error);
    return false;
  }
};

// Templates d'emails
export const emailTemplates = {
  // Email de bienvenue
  welcome: (user: { name: string; email: string }) => ({
    subject: `Bienvenue chez ${process.env.APP_NAME || 'Natura Divine Beauté'} !`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50, #8BC34A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .features { margin: 20px 0; }
          .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
          .feature-item:before { content: "✅"; position: absolute; left: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue chez ${process.env.APP_NAME || 'Natura Divine Beauté'}</h1>
            <p>Votre beauté naturelle commence ici</p>
          </div>
          <div class="content">
            <h2>Bonjour ${user.name} !</h2>
            <p>Merci de vous être inscrit(e) sur <strong>${process.env.APP_NAME || 'Natura Divine Beauté'}</strong>.</p>
            <p>Nous sommes ravis de vous compter parmi nos clients et nous nous engageons à vous offrir les meilleurs produits naturels et services de beauté.</p>
            
            <div class="features">
              <h3>🎁 Ce qui vous attend :</h3>
              <div class="feature-item">Produits cosmétiques 100% naturels</div>
              <div class="feature-item">Réservation en ligne de vos soins beauté</div>
              <div class="feature-item">Conseils personnalisés par nos experts</div>
              <div class="feature-item">Offres exclusives pour les membres</div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/boutique" class="button">Découvrir nos produits</a>
            </div>

            <p>Pour toute question, n'hésitez pas à nous contacter à <a href="mailto:${process.env.CONTACT_EMAIL || 'contact@naturadivinebeaute.com'}">${process.env.CONTACT_EMAIL || 'contact@naturadivinebeaute.com'}</a>.</p>
            
            <p>Bien chaleureusement,<br>L'équipe ${process.env.APP_NAME || 'Natura Divine Beauté'}</p>
          </div>
          <div class="footer">
            <p>${process.env.APP_NAME || 'Natura Divine Beauté'} - Votre institut de beauté naturelle</p>
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Natura Divine Beauté'}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Confirmation de commande
  orderConfirmation: (order: any, user: any) => ({
    subject: `Confirmation de commande #${order.orderNumber || order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50, #8BC34A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd; }
          .product-item { border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
          .product-name { flex: 2; }
          .product-quantity { flex: 1; text-align: center; }
          .product-price { flex: 1; text-align: right; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #4CAF50; }
          .button { background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Commande Confirmée !</h1>
            <p>Merci pour votre achat chez ${process.env.APP_NAME || 'Natura Divine Beauté'}</p>
          </div>
          <div class="content">
            <h2>Bonjour ${user.name},</h2>
            <p>Votre commande <strong>#${order.orderNumber || order._id}</strong> a bien été reçue et est en cours de traitement.</p>

            <div class="order-details">
              <h3 style="margin-top: 0;">📦 Détails de la commande</h3>
              
              ${order.items && order.items.map((item: any) => `
                <div class="product-item">
                  <div class="product-name"><strong>${item.product?.name || 'Produit'}</strong></div>
                  <div class="product-quantity">Quantité: ${item.quantity}</div>
                  <div class="product-price">${(item.price || 0).toLocaleString('fr-FR')} FCFA</div>
                </div>
              `).join('')}

              <div class="total">
                Total: ${(order.totalAmount || 0).toLocaleString('fr-FR')} FCFA
              </div>
            </div>

            <h3>🚚 Livraison</h3>
            <p>Nous vous contacterons dans les plus brefs délais pour convenir de la livraison.</p>
            
            <p><strong>Mode de paiement :</strong> ${order.paymentMethod === 'cash' ? 'Paiement à la livraison' : (order.paymentMethod || 'Non spécifié')}</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/mon-compte/commandes/${order._id}" class="button">Voir ma commande</a>
            </div>

            <p>Pour suivre votre commande ou pour toute question, contactez-nous à <a href="mailto:${process.env.CONTACT_EMAIL || 'contact@naturadivinebeaute.com'}">${process.env.CONTACT_EMAIL || 'contact@naturadivinebeaute.com'}</a>.</p>
            
            <p>Merci pour votre confiance,<br>L'équipe ${process.env.APP_NAME || 'Natura Divine Beauté'}</p>
          </div>
          <div class="footer">
            <p>${process.env.APP_NAME || 'Natura Divine Beauté'} - Votre institut de beauté naturelle</p>
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Natura Divine Beauté'}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Confirmation de rendez-vous
  appointmentConfirmation: (appointment: any, client: any, service: any, beautician: any) => ({
    subject: `Confirmation de rendez-vous - ${service?.name || 'Soin beauté'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFC107, #FF9800); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd; }
          .detail-row { display: flex; margin: 10px 0; }
          .detail-label { flex: 1; font-weight: bold; }
          .detail-value { flex: 2; }
          .button { background: #FFC107; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .info-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Rendez-vous Confirmé !</h1>
            <p>Nous avons hâte de vous accueillir</p>
          </div>
          <div class="content">
            <h2>Bonjour ${client?.name || 'Client'},</h2>
            <p>Votre rendez-vous pour <strong>${service?.name || 'Soin beauté'}</strong> a été confirmé avec succès.</p>

            <div class="appointment-details">
              <h3 style="margin-top: 0;">📅 Détails du rendez-vous</h3>
              
              <div class="detail-row">
                <div class="detail-label">Service :</div>
                <div class="detail-value">${service?.name || 'Non spécifié'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Date :</div>
                <div class="detail-value">${appointment.date ? new Date(appointment.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Non spécifiée'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Heure :</div>
                <div class="detail-value">${appointment.timeSlot || 'Non spécifiée'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Durée :</div>
                <div class="detail-value">${service?.duration || appointment.duration || 'Non spécifiée'} minutes</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Esthéticienne :</div>
                <div class="detail-value">${beautician?.name || 'Non assignée'}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Prix :</div>
                <div class="detail-value">${(service?.price || appointment.price || 0).toLocaleString('fr-FR')} FCFA</div>
              </div>
            </div>

            <div class="info-box">
              <h4>💡 Informations importantes</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Veuillez arriver 10 minutes avant l'heure du rendez-vous</li>
                <li>Prévenez-nous au moins 24h à l'avance en cas d'annulation</li>
                <li>Apportez votre confirmation de rendez-vous</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/mon-compte/rendez-vous/${appointment._id}" class="button">Voir mon rendez-vous</a>
            </div>

            <p>Pour modifier ou annuler votre rendez-vous, contactez-nous au <strong>${process.env.CONTACT_PHONE || '+235 XX XX XX XX'}</strong> ou par email à <a href="mailto:${process.env.CONTACT_EMAIL || 'contact@naturadivinebeaute.com'}">${process.env.CONTACT_EMAIL || 'contact@naturadivinebeaute.com'}</a>.</p>
            
            <p>À très bientôt,<br>L'équipe ${process.env.APP_NAME || 'Natura Divine Beauté'}</p>
          </div>
          <div class="footer">
            <p>${process.env.APP_NAME || 'Natura Divine Beauté'} - Votre institut de beauté naturelle</p>
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Natura Divine Beauté'}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Mot de passe oublié
  passwordReset: (user: any, resetToken: string) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2196F3, #03A9F4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .token-link { word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Réinitialisation de mot de passe</h1>
          </div>
          <div class="content">
            <h2>Bonjour ${user.name},</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte ${process.env.APP_NAME || 'Natura Divine Beauté'}.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reinitialiser-mot-de-passe?token=${resetToken}" class="button">Réinitialiser mon mot de passe</a>
            </div>

            <div class="warning">
              <p><strong>⚠️ Important :</strong></p>
              <p>Ce lien expirera dans 1 heure.</p>
              <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            </div>

            <p>Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :</p>
            <div class="token-link">
              ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reinitialiser-mot-de-passe?token=${resetToken}
            </div>
            
            <p>L'équipe ${process.env.APP_NAME || 'Natura Divine Beauté'}</p>
          </div>
          <div class="footer">
            <p>${process.env.APP_NAME || 'Natura Divine Beauté'} - Votre institut de beauté naturelle</p>
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Natura Divine Beauté'}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Fonction principale d'envoi d'email
export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  // En mode développement, on peut logger au lieu d'envoyer des emails
  if (process.env.NODE_ENV === 'development' && process.env.DISABLE_EMAILS === 'true') {
    console.log('📧 Email simulé (désactivé en développement):', {
      to,
      subject,
      html: html.substring(0, 200) + '...'
    });
    return true;
  }

  try {
    const transporter = createTransporter();

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${process.env.APP_NAME || 'Natura Divine Beauté'}" <${process.env.SMTP_FROM || 'noreply@naturadivinebeaute.com'}>`,
      to,
      subject,
      html,
      // Text alternative pour les clients email qui ne supportent pas HTML
      text: html.replace(/<[^>]*>/g, '')
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${to} - Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email à', to, ':', error);
    return false;
  }
};

// Fonctions spécifiques pour différents types d'emails
export const sendWelcomeEmail = async (user: { name: string; email: string }): Promise<boolean> => {
  const template = emailTemplates.welcome(user);
  return await sendEmail(user.email, template.subject, template.html);
};

export const sendOrderConfirmation = async (order: any, user: any): Promise<boolean> => {
  const template = emailTemplates.orderConfirmation(order, user);
  return await sendEmail(user.email, template.subject, template.html);
};

export const sendAppointmentConfirmation = async (
  appointment: any, 
  client: any, 
  service: any, 
  beautician: any
): Promise<boolean> => {
  const template = emailTemplates.appointmentConfirmation(appointment, client, service, beautician);
  return await sendEmail(client.email, template.subject, template.html);
};

export const sendPasswordResetEmail = async (user: any, resetToken: string): Promise<boolean> => {
  const template = emailTemplates.passwordReset(user, resetToken);
  return await sendEmail(user.email, template.subject, template.html);
};

// Notification admin pour nouvelles commandes
export const notifyAdminNewOrder = async (order: any, user: any): Promise<boolean> => {
  if (!process.env.ADMIN_EMAIL) {
    console.log('❌ ADMIN_EMAIL non configuré - notification admin ignorée');
    return false;
  }

  const subject = `Nouvelle commande #${order.orderNumber || order._id} - ${process.env.APP_NAME || 'Natura Divine Beauté'}`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Nouvelle commande reçue</h2>
      <p><strong>Client:</strong> ${user.name} (${user.email})</p>
      <p><strong>Commande:</strong> #${order.orderNumber || order._id}</p>
      <p><strong>Montant:</strong> ${(order.totalAmount || 0).toLocaleString('fr-FR')} FCFA</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
      <br>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/commandes/${order._id}">Voir la commande dans l'admin</a>
    </div>
  `;

  return await sendEmail(process.env.ADMIN_EMAIL, subject, html);
};