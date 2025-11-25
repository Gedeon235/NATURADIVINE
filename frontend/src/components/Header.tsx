import { useState, FormEvent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchClick = (term: string) => {
    setSearchQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size={60} className="shadow-md" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer">Accueil</Link>
            <Link to="/products" className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer">Produits</Link>
            <Link to="/services" className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer">Services</Link>
            <Link to="/about" className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer">À propos</Link>
            <Link to="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer">Contact</Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher produits, services..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 cursor-pointer"
                      >
                        <i className="ri-search-line"></i>
                      </button>
                    </div>
                  </form>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Recherches populaires :</p>
                    <div className="flex flex-wrap gap-2">
                      {['Sérum vitamine C', 'Massage', 'Crème hydratante', 'Soin visage'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearchClick(term)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer">
              <i className="ri-shopping-bag-line text-xl"></i>
            </Link>
            <Link to="/login" className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer">
              <i className="ri-user-line text-xl"></i>
            </Link>
          </div>
          <button
            className="md:hidden w-6 h-6 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 cursor-pointer"
              >
                <i className="ri-search-line"></i>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 cursor-pointer">Accueil</Link>
            <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 cursor-pointer">Produits</Link>
            <Link to="/services" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 cursor-pointer">Services</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 cursor-pointer">À propos</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-emerald-600 cursor-pointer">Contact</Link>
            <div className="flex items-center space-x-4 px-3 py-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-700 hover:text-emerald-600 cursor-pointer"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
              <Link to="/cart" className="text-gray-700 hover:text-emerald-600 cursor-pointer">
                <i className="ri-shopping-bag-line text-xl"></i>
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-emerald-600 cursor-pointer">
                <i className="ri-user-line text-xl"></i>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

