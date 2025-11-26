// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://votre-backend.onrender.com";

export const api = {
  // Exemple pour les produits
  async getProduits() {
    const response = await fetch(`${API_BASE_URL}/api/produits`);
    return response.json();
  },

  async createProduit(produitData: any) {
    const response = await fetch(`${API_BASE_URL}/api/produits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produitData),
    });
    return response.json();
  },

  // Méthode générique pour les appels API
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};