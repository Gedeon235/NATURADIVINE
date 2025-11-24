import * as nodemailer from 'nodemailer';

// Configuration du transporteur email (exemple avec Gmail)
const createTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Template d'email de bienvenue
export const sendWelcomeEmail = async (email: string, unsubscribeToken: string) => {
  try {
    const transporter = createTransport();
    
    const unsubscribeLink = `${process.env.CLIENT_URL}/newsletter/unsubscribe/${unsubscribeToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bienvenue à la newsletter Natura Divine Beauté',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b7355;">Bienvenue !</h1>
          <p>Merci de vous être inscrit à la newsletter de Natura Divine Beauté.</p>
          <p>Vous recevrez désormais nos dernières nouvelles, offres spéciales et conseils beauté.</p>
          <p>Si vous souhaitez vous désinscrire à tout moment, <a href="${unsubscribeLink}">cliquez ici</a>.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Natura Divine Beauté<br>
            Votre institut de beauté naturel et bio
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de bienvenue envoyé à: ${email}`);
  } catch (error) {
    console.error('Erreur envoi email bienvenue:', error);
  }
};

// Template d'email de newsletter
export const sendNewsletter = async (subscribers: any[], subject: string, content: string) => {
  try {
    const transporter = createTransport();
    
    for (const subscriber of subscribers) {
      const unsubscribeLink = `${process.env.CLIENT_URL}/newsletter/unsubscribe/${subscriber.token}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            ${content}
            <hr>
            <p style="color: #666; font-size: 12px;">
              <a href="${unsubscribeLink}">Se désinscrire</a> | 
              Natura Divine Beauté - Votre institut de beauté naturel et bio
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      // Mettre à jour la date du dernier envoi
      subscriber.lastSentAt = new Date();
      await subscriber.save();
    }
    
    console.log(`Newsletter envoyée à ${subscribers.length} abonnés`);
  } catch (error) {
    console.error('Erreur envoi newsletter:', error);
  }
};

// Template d'email de confirmation de commande
export const sendOrderConfirmation = async (email: string, order: any) => {
  try {
    const transporter = createTransport();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirmation de commande #${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b7355;">Merci pour votre commande !</h1>
          <p>Votre commande <strong>#${order.orderNumber}</strong> a été confirmée.</p>
          
          <h3>Détails de la commande :</h3>
          <ul>
            ${order.items.map((item: any) => `
              <li>${item.name} - ${item.quantity}x ${item.price} FCFA</li>
            `).join('')}
          </ul>
          
          <p><strong>Total : ${order.totalPrice} FCFA</strong></p>
          
          <h3>Adresse de livraison :</h3>
          <p>
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}<br>
            ${order.shippingAddress.phone}
          </p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">
            Natura Divine Beauté<br>
            Votre institut de beauté naturel et bio
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de confirmation de commande envoyé à: ${email}`);
  } catch (error) {
    console.error('Erreur envoi email confirmation commande:', error);
  }
};

// Template d'email de confirmation de rendez-vous
export const sendAppointmentConfirmation = async (email: string, appointment: any) => {
  try {
    const transporter = createTransport();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation de votre rendez-vous',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b7355;">Rendez-vous confirmé !</h1>
          <p>Votre rendez-vous chez Natura Divine Beauté a été confirmé.</p>
          
          <h3>Détails du rendez-vous :</h3>
          <ul>
            <li><strong>Service :</strong> ${appointment.service.name}</li>
            <li><strong>Date :</strong> ${new Date(appointment.date).toLocaleDateString('fr-FR')}</li>
            <li><strong>Heure :</strong> ${appointment.timeSlot}</li>
            <li><strong>Esthéticienne :</strong> ${appointment.beautician.name}</li>
            <li><strong>Prix :</strong> ${appointment.price} FCFA</li>
          </ul>
          
          <p>Nous avons hâte de vous accueillir !</p>
          
          <hr>
          <p style="color: #666; font-size: 12px;">
            Natura Divine Beauté<br>
            Votre institut de beauté naturel et bio
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de confirmation de rendez-vous envoyé à: ${email}`);
  } catch (error) {
    console.error('Erreur envoi email confirmation rendez-vous:', error);
  }
};