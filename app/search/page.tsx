'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 1. Définition de l'interface pour un élément de résultat de recherche
interface SearchResult {
  id: number;
  type: 'product' | 'service'; // Utilisation d'un type littéral pour 'type'
  title: string;
  description: string;
  price: string;
  image: string;
  link: string;
}

// 2. Définition de l'interface pour un filtre
interface Filter {
  id: string;
  label: string;
  icon: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Typage des états useState
  const [searchQuery, setSearchQuery] = useState<string>(query);
  const [results, setResults] = useState<SearchResult[]>([]); // Correction: typage explicite
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Typage du tableau allResults
  const allResults: SearchResult[] = [
    {
      id: 1,
      type: 'product',
      title: 'Sérum Vitamine C Bio',
      description: 'Sérum anti-âge enrichi en vitamine C naturelle pour une peau éclatante',
      price: '28 000 FCFA',
      image: 'https://readdy.ai/api/search-image?query=natural%20vitamin%20c%20serum%20bottle%20with%20dropper%20on%20clean%20white%20background%2C%20organic%20skincare%20product%2C%20professional%20photography%2C%20soft%20lighting&width=300&height=300&seq=serum1&orientation=squarish',
      link: '/products'
    },
    {
      id: 2,
      type: 'product',
      title: 'Crème Hydratante Aloe Vera',
      description: 'Crème hydratante naturelle à base d\'aloe vera pour tous types de peau',
      price: '22 000 FCFA',
      image: 'https://readdy.ai/api/search-image?query=aloe%20vera%20moisturizer%20cream%20jar%20on%20white%20background%2C%20natural%20skincare%20product%2C%20green%20plant%20elements%2C%20clean%20minimalist%20style&width=300&height=300&seq=cream1&orientation=squarish',
      link: '/products'
    },
    {
      id: 3,
      type: 'service',
      title: 'Soin Visage Purifiant',
      description: 'Soin complet pour purifier et revitaliser votre peau',
      price: '35 000 FCFA',
      image: 'https://readdy.ai/api/search-image?query=spa%20facial%20treatment%2C%20woman%20receiving%20facial%20care%2C%20serene%20spa%20environment%2C%20soft%20lighting%2C%20professional%20beauty%20treatment&width=300&height=300&seq=facial1&orientation=squarish',
      link: '/services'
    },
    {
      id: 4,
      type: 'service',
      title: 'Massage Relaxant',
      description: 'Massage thérapeutique pour détendre corps et esprit',
      price: '40 000 FCFA',
      image: 'https://readdy.ai/api/search-image?query=relaxing%20spa%20massage%20therapy%2C%20peaceful%20spa%20room%2C%20natural%20elements%2C%20soft%20towels%2C%20calming%20atmosphere&width=300&height=300&seq=massage1&orientation=squarish',
      link: '/services'
    },
    {
      id: 5,
      type: 'product',
      title: 'Masque Argile Purifiante',
      description: 'Masque naturel à l\'argile verte pour purifier les pores',
      price: '18 000 FCFA',
      image: 'https://readdy.ai/api/search-image?query=clay%20mask%20jar%20with%20green%20clay%2C%20natural%20skincare%20product%2C%20spa%20setting%2C%20clean%20white%20background&width=300&height=300&seq=mask1&orientation=squarish',
      link: '/products'
    },
    {
      id: 6,
      type: 'service',
      title: 'Manucure & Pédicure',
      description: 'Soin complet des mains et des pieds avec vernis inclus',
      price: '35 000 FCFA',
      image: 'https://readdy.ai/api/search-image?query=manicure%20pedicure%20service%2C%20beautiful%20hands%20and%20feet%2C%20nail%20care%20tools%2C%20professional%20spa%20setting&width=300&height=300&seq=nails1&orientation=squarish',
      link: '/services'
    }
  ];

  // Typage du tableau filters
  const filters: Filter[] = [
    { id: 'all', label: 'Tout', icon: 'ri-search-line' },
    { id: 'product', label: 'Produits', icon: 'ri-shopping-bag-line' },
    { id: 'service', label: 'Services', icon: 'ri-hand-heart-line' }
  ];

  useEffect(() => {
    // Exécuter la recherche uniquement si un terme de recherche initial est présent ou si le filtre change
    if (query || activeFilter) {
      performSearch(query);
    }
  }, [query, activeFilter]); // Ajout de activeFilter aux dépendances pour réagir aux changements de filtre

  // Typage du paramètre searchTerm
  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);

    // Simulation de recherche
    await new Promise(resolve => setTimeout(resolve, 800));

    const filteredResults = allResults.filter(item => {
      // Utilisez searchQuery pour le filtre basé sur l'input actuel,
      // mais searchTerm pour le filtre initial basé sur l'URL
      const currentSearchTerm = searchQuery.toLowerCase();

      const matchesQuery = currentSearchTerm === '' ||
        item.title.toLowerCase().includes(currentSearchTerm) ||
        item.description.toLowerCase().includes(currentSearchTerm);

      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;

      return matchesQuery && matchesFilter;
    });

    setResults(filteredResults);
    setIsLoading(false);
  };

  // Typage du paramètre e (événement de formulaire)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Utiliser searchQuery qui est lié à l'input
    performSearch(searchQuery);
  };

  // Typage du paramètre e (événement de changement d'input)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Typage du paramètre filterId
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    // La recherche sera relancée par l'useEffect grâce à `activeFilter` dans ses dépendances
    // performSearch(searchQuery); // Cette ligne n'est plus strictement nécessaire ici grâce à useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Rechercher</h1>
            <p className="text-gray-600">Trouvez vos produits et services de beauté préférés</p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange} // Utilisation du nouveau gestionnaire
                placeholder="Rechercher des produits, services..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pl-12"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 cursor-pointer"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
            </div>
          </form>

          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {filters.map((filter: Filter) => ( // Typage de l'itération map
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <i className={`${filter.icon} mr-2`}></i>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Recherche en cours...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {results.length} résultat{results.length > 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-search-line text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Essayez avec d'autres mots-clés ou parcourez nos catégories
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/products"
                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Voir les produits
                  </Link>
                  <Link
                    href="/services"
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Voir les services
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item: SearchResult) => ( // Typage de l'itération map
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover object-top"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.type === 'product'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type === 'product' ? 'Produit' : 'Service'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-emerald-600">{item.price}</span>
                        <Link
                          href={item.link}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm cursor-pointer whitespace-nowrap"
                        >
                          {item.type === 'product' ? 'Voir le produit' : 'Réserver'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-emerald-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
          <p className="text-gray-600 mb-6">
            Contactez notre équipe d'experts beauté pour des conseils personnalisés
          </p>
          <Link
            href="/contact"
            className="bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}