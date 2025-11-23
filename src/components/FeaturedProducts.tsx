import * as React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

const FeaturedProducts: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Sérum Vitamine C Éclat",
      price: "7 500 FCFA",
      image: "https://readdy.ai/api/search-image?query=Luxury%20vitamin%20C%20serum%20bottle%20with%20golden%20cap%2C%20elegant%20glass%20packaging%2C%20natural%20light%20background%2C%20premium%20cosmetic%20product%20photography%2C%20clean%20minimalist%20style%2C%20soft%20shadows%2C%20professional%20beauty%20product%20shot&width=400&height=400&seq=prod1&orientation=squarish",
      description: "Illumine et unifie le teint"
    },
    {
      id: 2,
      name: "Crème Hydratante Bio",
      price: "6 200 FCFA",
      image: "https://readdy.ai/api/search-image?query=Organic%20moisturizing%20cream%20jar%20with%20natural%20ingredients%2C%20eco-friendly%20packaging%2C%20green%20and%20white%20design%2C%20natural%20beauty%20products%2C%20soft%20lighting%2C%20minimalist%20background%2C%20premium%20skincare%20photography&width=400&height=400&seq=prod2&orientation=squarish",
      description: "Hydratation intense 24h"
    },
    {
      id: 3,
      name: "Masque Purifiant Argile",
      price: "4 800 FCFA",
      image: "https://readdy.ai/api/search-image?query=Clay%20purifying%20face%20mask%20tube%20with%20natural%20earth%20tones%2C%20spa-like%20presentation%2C%20organic%20skincare%20packaging%2C%20clean%20background%2C%20professional%20product%20photography%2C%20natural%20beauty%20elements&width=400&height=400&seq=prod3&orientation=squarish",
      description: "Nettoie en profondeur"
    },
    {
      id: 4,
      name: "Huile Essentielle Lavande",
      price: "4 000 FCFA",
      image: "https://readdy.ai/api/search-image?query=Essential%20lavender%20oil%20bottle%20with%20purple%20lavender%20flowers%2C%20natural%20aromatherapy%20product%2C%20glass%20dropper%20bottle%2C%20serene%20spa%20atmosphere%2C%20organic%20beauty%20products%2C%20soft%20natural%20lighting&width=400&height=400&seq=prod4&orientation=squarish",
      description: "Relaxation et bien-être"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Produits Phares
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits cosmétiques naturels, soigneusement choisis pour révéler votre beauté
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-emerald-600">{product.price}</span>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
            Voir tous nos produits
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

