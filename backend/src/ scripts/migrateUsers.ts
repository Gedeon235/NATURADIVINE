// scripts/migrateUsers.ts
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Mettre à jour tous les utilisateurs existants pour ajouter les préférences par défaut
    const result = await User.updateMany(
      { 
        $or: [
          { preferences: { $exists: false } },
          { lastLogin: { $exists: false } }
        ]
      },
      {
        $set: {
          preferences: {
            newsletter: true,
            notifications: true
          }
        }
      }
    );

    console.log(`✅ Migration réussie : ${result.modifiedCount} utilisateurs mis à jour`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
};

migrateUsers();