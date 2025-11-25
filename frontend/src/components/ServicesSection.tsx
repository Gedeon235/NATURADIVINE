import * as React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

interface Service {
  id: number;
  name: string;
  duration: string;
  price: string;
  image: string;
  description: string;
}

const ServicesSection: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      name: "Soin Visage Personnalisé",
      duration: "60 min",
      price: "42 500 FCFA",
      image: "https://readdy.ai/api/search-image?query=Professional%20facial%20treatment%20in%20luxury%20spa%2C%20beautician%20hands%20applying%20cream%20on%20client%20face%2C%20serene%20spa%20environment%2C%20natural%20lighting%2C%20premium%20beauty%20service%2C%20relaxing%20atmosphere%2C%20clean%20aesthetic&width=500&height=400&seq=service1&orientation=landscape",
      description: "Analyse de peau et soin adapté à vos besoins"
    },
    {
      id: 2,
      name: "Massage Relaxant",
      duration: "45 min",
      price: "35 000 FCFA",
      image: "https://readdy.ai/api/search-image?query=Relaxing%20spa%20massage%20therapy%20session%2C%20peaceful%20treatment%20room%2C%20natural%20oils%20and%20candles%2C%20professional%20wellness%20service%2C%20calming%20atmosphere%2C%20luxury%20spa%20interior%2C%20soft%20lighting&width=500&height=400&seq=service2&orientation=landscape",
      description: "Détente profonde et régénération"
    },
    
    {
      id: 3,
      name: "Conseil Beauté",
      duration: "30 min",
      price: "22 500 FCFA",
      image: "https://readdy.ai/api/search-image?query=Beauty%20consultation%20session%20with%20professional%20makeup%20artist%2C%20cosmetic%20products%20display%2C%20personalized%20beauty%20advice%2C%20elegant%20salon%20interior%2C%20natural%20makeup%20demonstration%2C%20professional%20beauty%20service&width=500&height=400&seq=service3&orientation=landscape",
      description: "Conseils personnalisés pour votre routine beauté"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Profitez de nos services de beauté personnalisés dans un environnement relaxant et professionnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-64">
                <ImageWithFallback
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <span className="text-sm text-gray-500">{service.duration}</span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-emerald-600">{service.price}</span>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services" className="bg-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
            Découvrir tous nos services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

