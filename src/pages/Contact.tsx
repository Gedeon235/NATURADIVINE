import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  content: string;
}

interface SocialMedia {
  icon: string;
  title: string;
  content: string;
  link: string;
  color: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: 'ri-map-pin-line',
      title: 'Adresse',
      content: 'Gassi, Ndjamena, Tchad'
    },
    {
      icon: 'ri-phone-line',
      title: 'Téléphone',
      content: '+235 68 65 57 86 / 92 46 70 97'
    },
    {
      icon: 'ri-mail-line',
      title: 'Email',
      content: 'gpessem@gmail.com'
    },
    {
      icon: 'ri-time-line',
      title: 'Horaires',
      content: 'Lun-Ven: 9h-19h • Sam: 9h-17h'
    }
  ];

  const socialMedia: SocialMedia[] = [
    {
      icon: 'ri-facebook-fill',
      title: 'Facebook',
      content: 'NaturaDivineBeauté',
      link: 'https://facebook.com/naturadivinebte',
      color: 'bg-blue-600'
    },
    {
      icon: 'ri-tiktok-fill',
      title: 'TikTok',
      content: '@naturadivinebte',
      link: 'https://tiktok.com/@naturadivinebte',
      color: 'bg-black'
    },
    {
      icon: 'ri-whatsapp-fill',
      title: 'WhatsApp',
      content: '+235 68 65 57 86',
      link: 'https://wa.me/23568655786',
      color: 'bg-green-600'
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'Comment prendre rendez-vous?',
      answer: 'Vous pouvez prendre rendez-vous directement depuis notre page Services ou nous contacter par téléphone.'
    },
    {
      question: 'Vos produits sont-ils vraiment bio?',
      answer: 'Oui, tous nos produits sont certifiés bio et naturels. Nous sélectionnons rigoureusement nos fournisseurs.'
    },
    {
      question: 'Proposez-vous la livraison?',
      answer: 'Nous proposons la livraison gratuite à Ndjamena dès 25 000 FCFA d\'achat.'
    },
    {
      question: 'Puis-je annuler un rendez-vous?',
      answer: 'Oui, vous pouvez annuler votre rendez-vous jusqu\'à 24h avant la date prévue.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contactez-Nous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions et vous accompagner 
            dans votre parcours beauté
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <i className="ri-check-circle-line text-green-600 text-xl mr-3"></i>
                  <p className="text-green-700">Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              </div>
            )}

            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-8"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="info-produits">Informations produits</option>
                    <option value="reservation">Réservation service</option>
                    <option value="commande">Question sur ma commande</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Décrivez votre demande..."
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.message.length}/500 caractères
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || formData.message.length > 500}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-full mr-4">
                        <i className={`${info.icon} text-emerald-600 text-xl`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{info.title}</h3>
                        <p className="text-gray-600">{info.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="grid grid-cols-1 gap-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 flex items-center justify-center ${social.color} rounded-full mr-4`}>
                        <i className={`${social.icon} text-white text-lg`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{social.title}</h4>
                        <p className="text-gray-600 text-sm">{social.content}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trouvez-nous</h3>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31548.7!2d15.0444!3d12.1067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x111e0b4a91c8b9b3%3A0x2f9a4b0f5e5e5e5e!2sN%27Djamena%2C%20Chad!5e0!3m2!1sfr!2sfr!4v1635789456789!5m2!1sfr!2sfr"
                  width="100%" 
                  height="250" 
                  style={{ border: 0 }}
                  allowFullScreen 
                  loading="lazy"
                  title="Notre localisation"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Questions Fréquentes</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md">
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-8 md:p-12 text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Besoin d'aide pour choisir?</h2>
          <p className="text-gray-600 mb-6">
            Nos experts beauté sont à votre disposition pour vous conseiller personnellement.
          </p>
          <Link 
            to="/services" 
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

