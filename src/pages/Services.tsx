import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  category: string;
  image: string;
  description: string;
  benefits: string[];
  popular: boolean;
}

const services: Service[] = [
  {
    id: 1,
    name: "Soin Visage Personnalisé",
    duration: "60 min",
    price: 42500,
    category: "visage",
    image: "https://readdy.ai/api/search-image?query=Professional%20facial%20treatment%20in%20luxury%20spa%2C%20beautician%20hands%20applying%20cream%20on%20client%20face%2C%20serene%20spa%20environment%2C%20natural%20lighting%2C%20premium%20beauty%20service%2C%20relaxing%20atmosphere%2C%20clean%20aesthetic&width=500&height=400&seq=service1&orientation=landscape",
    description: "Analyse de peau et soin adapté à vos besoins avec des produits naturels",
    benefits: ["Nettoyage en profondeur", "Hydratation intense", "Éclat du teint", "Relaxation"],
    popular: true
  },
  {
    id: 2,
    name: "Massage Relaxant",
    duration: "45 min",
    price: 35000,
    category: "corps",
    image: "https://readdy.ai/api/search-image?query=Relaxing%20spa%20massage%20therapy%20session%2C%20peaceful%20treatment%20room%2C%20natural%20oils%20and%20candles%2C%20professional%20wellness%20service%2C%20calming%20atmosphere%2C%20luxury%20spa%20interior%2C%20soft%20lighting&width=500&height=400&seq=service2&orientation=landscape",
    description: "Détente profonde et régénération avec huiles essentielles",
    benefits: ["Détente musculaire", "Réduction du stress", "Amélioration circulation", "Bien-être général"],
    popular: true
  },
  {
    id: 3,
    name: "Conseil Beauté",
    duration: "30 min",
    price: 22500,
    category: "conseil",
    image: "https://readdy.ai/api/search-image?query=Beauty%20consultation%20session%20with%20professional%20makeup%20artist%2C%20cosmetic%20products%20display%2C%20personalized%20beauty%20advice%2C%20elegant%20salon%20interior%2C%20natural%20makeup%20demonstration%2C%20professional%20beauty%20service&width=500&height=400&seq=service3&orientation=landscape",
    description: "Conseils personnalisés pour votre routine beauté",
    benefits: ["Analyse de peau", "Routine personnalisée", "Conseils produits", "Suivi personnalisé"],
    popular: false
  },
  {
    id: 4,
    name: "Soin Anti-Âge",
    duration: "75 min",
    price: 55000,
    category: "visage",
    image: "https://readdy.ai/api/search-image?query=Anti-aging%20facial%20treatment%20with%20premium%20serums%2C%20luxury%20spa%20environment%2C%20professional%20skincare%20service%2C%20rejuvenating%20treatment%2C%20natural%20lighting%2C%20serene%20atmosphere&width=500&height=400&seq=service4&orientation=landscape",
    description: "Traitement anti-âge avec produits naturels premium",
    benefits: ["Réduction rides", "Fermeté peau", "Éclat jeunesse", "Hydratation profonde"],
    popular: true
  },
  {
    id: 5,
    name: "Massage aux Pierres Chaudes",
    duration: "90 min",
    price: 65000,
    category: "corps",
    image: "https://readdy.ai/api/search-image?query=Hot%20stone%20massage%20therapy%20session%2C%20smooth%20heated%20stones%20on%20back%2C%20relaxing%20spa%20treatment%2C%20professional%20wellness%20service%2C%20calming%20atmosphere&width=500&height=400&seq=service5&orientation=landscape",
    description: "Massage thérapeutique aux pierres volcaniques chaudes",
    benefits: ["Détente profonde", "Soulagement douleurs", "Amélioration circulation", "Élimination toxines"],
    popular: false
  },
  {
    id: 6,
    name: "Coiffure et Styling",
    duration: "60 min",
    price: 28000,
    category: "coiffure",
    image: "https://readdy.ai/api/search-image?query=Professional%20hair%20styling%20session%2C%20hairstylist%20working%20on%20client%20hair%2C%20elegant%20salon%20interior%2C%20natural%20lighting%2C%20beauty%20salon%20service%2C%20professional%20hair%20care&width=500&height=400&seq=service6&orientation=landscape",
    description: "Coupe, brushing et styling professionnel",
    benefits: ["Coupe personnalisée", "Styling moderne", "Conseils entretien", "Produits naturels"],
    popular: false
  },
  {
    id: 7,
    name: "Manucure & Pédicure",
    duration: "75 min",
    price: 32000,
    category: "ongles",
    image: "https://readdy.ai/api/search-image?query=Professional%20manicure%20and%20pedicure%20service%2C%20nail%20art%20and%20care%2C%20elegant%20salon%20interior%2C%20natural%20nail%20polish%2C%20beauty%20treatment%2C%20relaxing%20atmosphere&width=500&height=400&seq=service7&orientation=landscape",
    description: "Soin complet des ongles mains et pieds",
    benefits: ["Soin des cuticules", "Vernis longue tenue", "Massage mains/pieds", "Relaxation"],
    popular: false
  },
  {
    id: 8,
    name: "Gommage Corps",
    duration: "45 min",
    price: 30000,
    category: "corps",
    image: "https://readdy.ai/api/search-image?query=Body%20scrub%20treatment%20with%20natural%20ingredients%2C%20exfoliating%20spa%20service%2C%20professional%20body%20care%2C%20luxury%20spa%20environment%2C%20smooth%20skin%20treatment&width=500&height=400&seq=service8&orientation=landscape",
    description: "Gommage exfoliant au sucre et huiles naturelles",
    benefits: ["Peau lisse", "Élimination cellules mortes", "Hydratation", "Teint uniforme"],
    popular: false
  }
];

const categories = [
  { id: 'all', name: 'Tous les services' },
  { id: 'visage', name: 'Soins du visage' },
  { id: 'corps', name: 'Soins du corps' },
  { id: 'coiffure', name: 'Coiffure' },
  { id: 'ongles', name: 'Manucure & Pédicure' },
  { id: 'conseil', name: 'Conseils beauté' }
];

interface BookingData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  message: string;
}

const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    message: ''
  });

  const filteredServices = services.filter(service =>
    selectedCategory === 'all' || service.category === selectedCategory
  );

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Réservation confirmée pour ${selectedService?.name}!`);
    setSelectedService(null);
    setBookingData({ name: '', phone: '', email: '', date: '', time: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services de beauté personnalisés 
            dans un environnement relaxant et professionnel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <ImageWithFallback
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-top"
                />
                {service.popular && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </span>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{service.duration}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Bénéfices:</h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <i className="ri-check-line text-emerald-600 mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-emerald-600">
                    {service.price.toLocaleString()} FCFA
                  </span>
                  <button 
                    onClick={() => setSelectedService(service)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun service trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>

      <Footer />

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Réserver {selectedService.name}</h3>
              <button 
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
                  <select
                    name="time"
                    value={bookingData.time}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
                <textarea 
                  name="message"
                  value={bookingData.message}
                  onChange={handleBookingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;

