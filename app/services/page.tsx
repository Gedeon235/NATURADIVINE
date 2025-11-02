'use client';

import { useState } from 'react';


//  Interface pour typer un service
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
  // ... (tes services inchangés ici)
];

const categories = [
  { id: 'all', name: 'Tous les services' },
  { id: 'visage', name: 'Soins du visage' },
  { id: 'corps', name: 'Soins du corps' },
  { id: 'coiffure', name: 'Coiffure' },
  { id: 'ongles', name: 'Manucure & Pédicure' },
  { id: 'conseil', name: 'Conseils beauté' }
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Typage explicite
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = services.filter(service =>
    selectedCategory === 'all' || service.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... contenu inchangé ... */}

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Réserver {selectedService.name}</h3>
              <button 
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* ... champs formulaire inchangés ... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
                {/*  Corrigé : rows={3} au lieu de "3" */}
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setSelectedService(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Annuler
              </button>
              <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
