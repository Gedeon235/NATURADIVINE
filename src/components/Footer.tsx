import * as React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo size={80} className="shadow-md" />
            </div>
            <p className="text-gray-300 mb-4">
              Votre destination beauté pour des produits naturels et des services personnalisés de qualité premium.
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 flex items-center justify-center bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-sm"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer">
                <i className="ri-instagram-fill text-sm"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer">
                <i className="ri-youtube-fill text-sm"></i>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  Retours
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <i className="ri-map-pin-line text-emerald-400"></i>
                <span className="text-gray-300">Gassi, Ndjamena, Tchad</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-phone-line text-emerald-400"></i>
                <span className="text-gray-300">+235 68 65 57 86</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-mail-line text-emerald-400"></i>
                <span className="text-gray-300">gpessem@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 NaturaDivineBeauté. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

