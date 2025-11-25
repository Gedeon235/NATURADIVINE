
'use client';

import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section 
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Elegant%20beauty%20spa%20environment%20with%20natural%20organic%20cosmetic%20products%2C%20soft%20lighting%2C%20minimal%20clean%20aesthetic%2C%20cream%20and%20gold%20tones%2C%20luxurious%20natural%20skincare%20bottles%20and%20jars%20arranged%20beautifully%2C%20serene%20atmosphere%20with%20plants%20and%20natural%20elements%2C%20professional%20beauty%20salon%20interior&width=1920&height=1080&seq=hero1&orientation=landscape')`
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Révélez votre beauté naturelle
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Découvrez notre collection exclusive de produits cosmétiques naturels et nos services de beauté personnalisés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
              Découvrir nos produits
            </Link>
            <Link to="/services" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap">
              Nos services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
