// scripts/createTestData.ts
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Appointment from '../models/Appointment.js';

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Vérifier s'il y a déjà des données
    const orderCount = await Order.countDocuments();
    
    if (orderCount === 0) {
      console.log('Création de données de test...');
      
      // Créer quelques commandes de test avec différents statuts
      const testOrders = [
        {
          orderNumber: 'CMD-001',
          totalAmount: 25000,
          status: 'completed',
          items: [
            { product: new mongoose.Types.ObjectId(), quantity: 2, price: 12500 }
          ]
        },
        {
          orderNumber: 'CMD-002', 
          totalAmount: 18000,
          status: 'pending',
          items: [
            { product: new mongoose.Types.ObjectId(), quantity: 1, price: 18000 }
          ]
        }
      ];
      
      await Order.insertMany(testOrders);
      console.log('Données de test créées avec succès');
    } else {
      console.log('Des données existent déjà, skip...');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Erreur création données test:', error);
  }
};

createTestData();