'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    skinType: '',
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const skinTypes = [
    { value: 'normale', label: 'Peau normale' },
    { value: 'seche', label: 'Peau sèche' },
    { value: 'grasse', label: 'Peau grasse' },
    { value: 'mixte', label: 'Peau mixte' },
    { value: 'sensible', label: 'Peau sensible' },
    { value: 'mature', label: 'Peau mature' },
    { value: 'acneique', label: 'Peau acnéique' }
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
       ? (e.target as HTMLInputElement).checked 
      : value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulation de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      skinType: '',
      acceptTerms: false
    });
    setSubmitted(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-emerald-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isLogin ? 'Connexion réussie !' : 'Compte créé avec succès !'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isLogin 
                ? 'Vous êtes maintenant connecté à votre compte NaturaDivineBeauté.' 
                : 'Bienvenue chez NaturaDivineBeauté ! Votre compte a été créé avec succès.'}
            </p>
            <Link 
              href="/" 
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium cursor-pointer whitespace-nowrap"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <div className="text-center">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-4 bg-amber-800 rounded-full mb-1"></div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-3 bg-amber-800 rounded-full transform rotate-12"></div>
                      <div className="w-2 h-3 bg-amber-800 rounded-full transform -rotate-12"></div>
                      <div className="w-2 h-3 bg-amber-800 rounded-full transform rotate-12"></div>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-amber-800" style={{ fontFamily: 'Pacifico, serif', fontSize: '8px' }}>
                  NaturaDivine<br />Beauté
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Accédez à votre espace personnel' 
                : 'Rejoignez notre communauté beauté'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
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
                  placeholder="Votre nom complet"
                />
              </div>
            )}

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
                placeholder="votre@email.com"
              />
            </div>

            {!isLogin && (
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
                  placeholder="+235 XX XX XX XX"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de peau
                </label>
                <select
                  id="skinType"
                  name="skinType"
                  value={formData.skinType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-8"
                >
                  <option value="">Sélectionnez votre type de peau</option>
                  {skinTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                  className="mt-1 mr-3 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    politique de confidentialité
                  </Link>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || (!isLogin && !formData.acceptTerms)}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
            >
              {isSubmitting 
                ? (isLogin ? 'Connexion...' : 'Création du compte...') 
                : (isLogin ? 'Se connecter' : 'Créer mon compte')
              }
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 cursor-pointer">
                Mot de passe oublié ?
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              <button
                type="button"
                onClick={switchMode}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Pourquoi créer un compte ?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Suivi de vos commandes et rendez-vous</li>
              <li>• Offres personnalisées et promotions exclusives</li>
              <li>• Historique de vos achats et recommandations</li>
              <li>• Accès prioritaire aux nouveautés</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}