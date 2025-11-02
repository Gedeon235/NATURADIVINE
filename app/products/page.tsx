
'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { id: 'all', name: 'Tous les produits' },
  { id: 'skincare', name: 'Soins du visage' },
  { id: 'bodycare', name: 'Soins du corps' },
  { id: 'haircare', name: 'Soins capillaires' },
  { id: 'makeup', name: 'Maquillage' }
];

const products = [
  // Soins du visage
  {
    id: 1,
    name: 'Sérum Vitamine C Bio',
    price: 8500,
    originalPrice: 10000,
    category: 'skincare',
    image: 'https://readdy.ai/api/search-image?query=organic%20vitamin%20c%20serum%20bottle%20with%20natural%20ingredients%2C%20minimalist%20clean%20white%20background%2C%20professional%20product%20photography%2C%20golden%20liquid%20visible%2C%20elegant%20glass%20dropper%20bottle%2C%20soft%20natural%20lighting%2C%20premium%20skincare%20aesthetic&width=400&height=400&seq=serum1&orientation=squarish',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    description: 'Sérum anti-âge concentré en vitamine C naturelle pour un teint éclatant'
  },
  {
    id: 2,
    name: 'Crème Hydratante Aloe Vera',
    price: 5500,
    category: 'skincare',
    image: 'https://readdy.ai/api/search-image?query=aloe%20vera%20moisturizer%20cream%20jar%20with%20fresh%20aloe%20plant%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20natural%20green%20tones%2C%20glass%20jar%20container%2C%20spa-like%20atmosphere%2C%20organic%20skincare%20branding&width=400&height=400&seq=cream1&orientation=squarish',
    rating: 4.9,
    reviews: 89,
    isNew: false,
    description: 'Crème hydratante naturelle à base d\'aloe vera bio pour tous types de peaux'
  },
  {
    id: 3,
    name: 'Masque Argile Verte Purifiante',
    price: 4200,
    category: 'skincare',
    image: 'https://readdy.ai/api/search-image?query=green%20clay%20mask%20powder%20in%20elegant%20glass%20jar%2C%20natural%20clay%20texture%2C%20minimalist%20white%20background%2C%20professional%20product%20photography%2C%20earth%20tones%2C%20organic%20skincare%20aesthetic%2C%20spa%20ambiance&width=400&height=400&seq=mask1&orientation=squarish',
    rating: 4.7,
    reviews: 156,
    isNew: false,
    description: 'Masque purifiant à l\'argile verte bio pour peaux mixtes à grasses'
  },
  {
    id: 4,
    name: 'Crème Anti-Rides Baobab',
    price: 9500,
    category: 'skincare',
    image: 'https://readdy.ai/api/search-image?query=baobab%20anti-aging%20cream%20jar%20with%20baobab%20fruit%20and%20tree%2C%20african%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20natural%20brown%20tones%2C%20premium%20skincare%20aesthetic%2C%20organic%20african%20beauty&width=400&height=400&seq=baobab1&orientation=squarish',
    rating: 4.6,
    reviews: 73,
    isNew: true,
    description: 'Crème anti-âge aux extraits de baobab du Sahel tchadien'
  },
  {
    id: 5,
    name: 'Gel Nettoyant Tamarin',
    price: 3800,
    category: 'skincare',
    image: 'https://readdy.ai/api/search-image?query=tamarind%20cleansing%20gel%20bottle%20with%20tamarind%20pods%2C%20natural%20african%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20brown%20amber%20tones%2C%20gentle%20skincare%20aesthetic&width=400&height=400&seq=tamarin1&orientation=squarish',
    rating: 4.5,
    reviews: 92,
    isNew: false,
    description: 'Gel nettoyant doux aux extraits de tamarin pour tous types de peaux'
  },
  {
    id: 6,
    name: 'Tonique Hibiscus Éclat',
    price: 4500,
    category: 'skincare',
    image: 'https://readdy.ai/api/search-image?query=hibiscus%20toner%20bottle%20with%20red%20hibiscus%20flowers%2C%20natural%20botanical%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20vibrant%20red%20accents%2C%20refreshing%20skincare%20aesthetic&width=400&height=400&seq=hibiscus1&orientation=squarish',
    rating: 4.7,
    reviews: 108,
    isNew: false,
    description: 'Tonique revitalisant à l\'hibiscus pour un teint lumineux'
  },

  // Soins du corps
  {
    id: 7,
    name: 'Beurre de Karité Pur Moundou',
    price: 6500,
    category: 'bodycare',
    image: 'https://readdy.ai/api/search-image?query=pure%20shea%20butter%20from%20Chad%20in%20traditional%20jar%2C%20shea%20nuts%20and%20shea%20tree%2C%20authentic%20african%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20creamy%20texture%2C%20natural%20skincare&width=400&height=400&seq=karite1&orientation=squarish',
    rating: 4.9,
    reviews: 203,
    isNew: false,
    description: 'Beurre de karité pur 100% naturel de Moundou, hydratation intense'
  },
  {
    id: 8,
    name: 'Huile Corporelle Moringa',
    price: 7200,
    category: 'bodycare',
    image: 'https://readdy.ai/api/search-image?query=moringa%20body%20oil%20bottle%20with%20moringa%20leaves%20and%20seeds%2C%20natural%20african%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20golden%20green%20oil%2C%20premium%20skincare%20aesthetic&width=400&height=400&seq=moringa1&orientation=squarish',
    rating: 4.8,
    reviews: 145,
    isNew: true,
    description: 'Huile nourrissante au moringa bio du Tchad, anti-oxydante'
  },
  {
    id: 9,
    name: 'Savon Noir Africain',
    price: 2800,
    category: 'bodycare',
    image: 'https://readdy.ai/api/search-image?query=african%20black%20soap%20bar%20with%20plantain%20and%20palm%20kernel%20oil%2C%20traditional%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20dark%20brown%20soap%2C%20natural%20skincare%20aesthetic&width=400&height=400&seq=savon1&orientation=squarish',
    rating: 4.6,
    reviews: 167,
    isNew: false,
    description: 'Savon noir traditionnel aux huiles de palme et plantain'
  },
  {
    id: 10,
    name: 'Gommage Corps Café Arabica',
    price: 4800,
    category: 'bodycare',
    image: 'https://readdy.ai/api/search-image?query=coffee%20body%20scrub%20with%20arabica%20coffee%20beans%20from%20Chad%2C%20natural%20brown%20texture%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20organic%20ingredients%2C%20spa%20treatment%20aesthetic&width=400&height=400&seq=cafe1&orientation=squarish',
    rating: 4.7,
    reviews: 81,
    isNew: false,
    description: 'Gommage exfoliant au café arabica tchadien pour une peau lisse'
  },
  {
    id: 11,
    name: 'Lait Corporel Sésame',
    price: 5200,
    category: 'bodycare',
    image: 'https://readdy.ai/api/search-image?query=sesame%20body%20lotion%20bottle%20with%20sesame%20seeds%2C%20natural%20african%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20golden%20tones%2C%20moisturizing%20skincare%20aesthetic&width=400&height=400&seq=sesame1&orientation=squarish',
    rating: 4.5,
    reviews: 94,
    isNew: false,
    description: 'Lait corporel nourrissant à l\'huile de sésame locale'
  },
  {
    id: 12,
    name: 'Baume Corps Cacao',
    price: 6800,
    category: 'bodycare',
    image: 'https://readdy.ai/api/search-image?query=cocoa%20body%20balm%20with%20cacao%20beans%20and%20cocoa%20butter%2C%20natural%20african%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20rich%20brown%20tones%2C%20luxurious%20skincare%20aesthetic&width=400&height=400&seq=cacao1&orientation=squarish',
    rating: 4.8,
    reviews: 112,
    isNew: true,
    description: 'Baume réparateur au beurre de cacao bio du Tchad'
  },

  // Soins capillaires
  {
    id: 13,
    name: 'Shampoing Solide Karité',
    price: 3500,
    category: 'haircare',
    image: 'https://readdy.ai/api/search-image?query=solid%20shampoo%20bar%20with%20shea%20butter%20ingredients%2C%20natural%20wooden%20background%2C%20professional%20product%20photography%2C%20organic%20round%20soap%20bar%2C%20minimal%20eco-friendly%20packaging%2C%20sustainable%20beauty%20concept&width=400&height=400&seq=shampoo1&orientation=squarish',
    rating: 4.5,
    reviews: 92,
    isNew: true,
    description: 'Shampoing solide enrichi au beurre de karité pour cheveux secs'
  },
  {
    id: 14,
    name: 'Après-Shampoing Argan',
    price: 4200,
    category: 'haircare',
    image: 'https://readdy.ai/api/search-image?query=argan%20oil%20conditioner%20bottle%20with%20argan%20nuts%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20golden%20amber%20liquid%2C%20premium%20hair%20care%20aesthetic%2C%20natural%20moroccan%20ingredients&width=400&height=400&seq=conditioner1&orientation=squarish',
    rating: 4.8,
    reviews: 105,
    isNew: false,
    description: 'Après-shampoing réparateur à l\'huile d\'argan bio'
  },
  {
    id: 15,
    name: 'Masque Capillaire Avocat',
    price: 5800,
    category: 'haircare',
    image: 'https://readdy.ai/api/search-image?query=avocado%20hair%20mask%20jar%20with%20fresh%20avocado%2C%20natural%20green%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20creamy%20texture%2C%20nourishing%20hair%20care%20aesthetic&width=400&height=400&seq=avocat1&orientation=squarish',
    rating: 4.7,
    reviews: 87,
    isNew: false,
    description: 'Masque nourrissant à l\'avocat pour cheveux abîmés'
  },
  {
    id: 16,
    name: 'Huile Capillaire Ricin',
    price: 4500,
    category: 'haircare',
    image: 'https://readdy.ai/api/search-image?query=castor%20oil%20hair%20treatment%20bottle%20with%20castor%20beans%2C%20natural%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20amber%20oil%2C%20hair%20growth%20treatment%20aesthetic&width=400&height=400&seq=ricin1&orientation=squarish',
    rating: 4.6,
    reviews: 134,
    isNew: false,
    description: 'Huile de ricin pure pour stimuler la croissance des cheveux'
  },
  {
    id: 17,
    name: 'Shampoing Liquide Henné',
    price: 3800,
    category: 'haircare',
    image: 'https://readdy.ai/api/search-image?query=henna%20shampoo%20bottle%20with%20henna%20leaves%2C%20natural%20red-brown%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20herbal%20hair%20care%20aesthetic%2C%20traditional%20ingredients&width=400&height=400&seq=henne1&orientation=squarish',
    rating: 4.4,
    reviews: 76,
    isNew: false,
    description: 'Shampoing au henné naturel pour cheveux colorés'
  },
  {
    id: 18,
    name: 'Spray Démêlant Hibiscus',
    price: 3200,
    category: 'haircare',
    image: 'https://readdy.ai/api/search-image?query=hibiscus%20detangling%20spray%20bottle%20with%20red%20hibiscus%20flowers%2C%20natural%20botanical%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20hair%20care%20treatment%20aesthetic&width=400&height=400&seq=hibiscus2&orientation=squarish',
    rating: 4.5,
    reviews: 98,
    isNew: true,
    description: 'Spray démêlant à l\'hibiscus pour cheveux fragiles'
  },

  // Maquillage
  {
    id: 19,
    name: 'Rouge à Lèvres Bio Rose',
    price: 3800,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=organic%20lipstick%20in%20rose%20color%2C%20elegant%20gold%20tube%20packaging%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20natural%20pink%20tones%2C%20luxury%20makeup%20aesthetic%2C%20premium%20cosmetics&width=400&height=400&seq=lipstick1&orientation=squarish',
    rating: 4.4,
    reviews: 67,
    isNew: false,
    description: 'Rouge à lèvres bio longue tenue aux pigments naturels'
  },
  {
    id: 20,
    name: 'Fond de Teint Karité',
    price: 6500,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=shea%20butter%20foundation%20bottle%20with%20natural%20coverage%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20various%20skin%20tone%20shades%2C%20natural%20makeup%20aesthetic%2C%20organic%20cosmetics&width=400&height=400&seq=fond1&orientation=squarish',
    rating: 4.6,
    reviews: 89,
    isNew: true,
    description: 'Fond de teint hydratant au beurre de karité, couvrance naturelle'
  },
  {
    id: 21,
    name: 'Mascara Cils Ricin',
    price: 4200,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=castor%20oil%20mascara%20tube%20with%20natural%20lash%20growth%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20black%20makeup%20aesthetic%2C%20natural%20cosmetics&width=400&height=400&seq=mascara1&orientation=squarish',
    rating: 4.5,
    reviews: 76,
    isNew: false,
    description: 'Mascara nourrissant à l\'huile de ricin pour des cils forts'
  },
  {
    id: 22,
    name: 'Poudre Compacte Argile',
    price: 5200,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=clay%20compact%20powder%20with%20natural%20minerals%2C%20elegant%20compact%20case%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20earth%20tones%2C%20natural%20makeup%20aesthetic&width=400&height=400&seq=poudre1&orientation=squarish',
    rating: 4.7,
    reviews: 93,
    isNew: false,
    description: 'Poudre compacte à l\'argile pour un fini mat naturel'
  },
  {
    id: 23,
    name: 'Gloss Lèvres Miel',
    price: 2800,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=honey%20lip%20gloss%20tube%20with%20natural%20honey%2C%20golden%20amber%20color%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20natural%20lip%20care%20aesthetic%2C%20organic%20cosmetics&width=400&height=400&seq=gloss1&orientation=squarish',
    rating: 4.3,
    reviews: 84,
    isNew: false,
    description: 'Gloss hydratant au miel naturel pour des lèvres douces'
  },
  {
    id: 24,
    name: 'Fard à Paupières Terre',
    price: 4500,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=earth%20tone%20eyeshadow%20palette%20with%20natural%20clay%20pigments%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20warm%20brown%20tones%2C%20natural%20makeup%20aesthetic%2C%20organic%20cosmetics&width=400&height=400&seq=fard1&orientation=squarish',
    rating: 4.4,
    reviews: 67,
    isNew: true,
    description: 'Palette de fards aux tons terreux, pigments naturels'
  },
  {
    id: 25,
    name: 'Crayon Yeux Khôl',
    price: 2200,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=natural%20kohl%20eyeliner%20pencil%20with%20traditional%20ingredients%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20black%20makeup%20aesthetic%2C%20natural%20cosmetics&width=400&height=400&seq=khol1&orientation=squarish',
    rating: 4.6,
    reviews: 112,
    isNew: false,
    description: 'Crayon khôl traditionnel pour un regard intense'
  },
  {
    id: 26,
    name: 'Blush Poudre Hibiscus',
    price: 3500,
    category: 'makeup',
    image: 'https://readdy.ai/api/search-image?query=hibiscus%20powder%20blush%20compact%20with%20red%20hibiscus%20flowers%2C%20natural%20pink%20tones%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20natural%20makeup%20aesthetic&width=400&height=400&seq=blush1&orientation=squarish',
    rating: 4.5,
    reviews: 78,
    isNew: false,
    description: 'Blush naturel à l\'hibiscus pour un teint rosé'
  }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Produits
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre gamme complète de produits cosmétiques naturels et bio, 
            élaborés avec les richesses du terroir tchadien à des prix abordables
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Catégories de Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                <i className="ri-user-smile-line text-emerald-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Soins du Visage</h3>
              <p className="text-sm text-gray-600">Sérums, crèmes, masques pour un teint éclatant</p>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                <i className="ri-body-scan-line text-emerald-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Soins du Corps</h3>
              <p className="text-sm text-gray-600">Huiles, gommages, laits corporels nourrissants</p>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                <i className="ri-scissors-cut-line text-emerald-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Soins Capillaires</h3>
              <p className="text-sm text-gray-600">Shampoings, après-shampoings, masques cheveux</p>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
                <i className="ri-palette-line text-emerald-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Maquillage</h3>
              <p className="text-sm text-gray-600">Rouges à lèvres, fonds de teint, mascaras bio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Trouvez les produits parfaits pour votre peau</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-4">
                <i className="ri-drop-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peau Normale</h3>
              <p className="text-sm text-gray-600">Équilibrée, ni trop grasse ni trop sèche</p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-full mx-auto mb-4">
                <i className="ri-sun-line text-amber-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peau Sèche</h3>
              <p className="text-sm text-gray-600">Manque d'hydratation, tiraillements</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
                <i className="ri-water-percent-line text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peau Grasse</h3>
              <p className="text-sm text-gray-600">Excès de sébum, brillances, pores dilatés</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full mx-auto mb-4">
                <i className="ri-contrast-drop-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peau Mixte</h3>
              <p className="text-sm text-gray-600">Zone T grasse, joues normales à sèches</p>
            </div>
            
            <div className="bg-pink-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-pink-100 rounded-full mx-auto mb-4">
                <i className="ri-heart-pulse-line text-pink-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peau Sensible</h3>
              <p className="text-sm text-gray-600">Réactive, rougeurs, irritations faciles</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full mx-auto mb-4">
                <i className="ri-time-line text-indigo-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peau Mature</h3>
              <p className="text-sm text-gray-600">Rides, perte de fermeté, taches pigmentaires</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Trier par:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-8"
            >
              <option value="name">Nom</option>
              <option value="price">Prix</option>
              <option value="rating">Note</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover object-top"
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Nouveau
                  </span>
                )}
                <button className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors cursor-pointer">
                  <i className="ri-heart-line text-gray-600"></i>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-yellow-400 text-sm`}></i>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600">{product.price.toLocaleString()} FCFA</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()} FCFA</span>
                    )}
                  </div>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
