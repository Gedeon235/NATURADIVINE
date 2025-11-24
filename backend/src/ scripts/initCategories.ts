// scripts/initCategories.ts
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const initialCategories = [
  // Catégories principales
  {
    name: 'Soins Capillaires',
    description: 'Produits naturels pour cheveux - Shampoings, après-shampoings, huiles et soins revitalisants',
    order: 1,
    featured: true,
    metaTitle: 'Soins Capillaires Naturels | Natura Divine Beauté',
    metaDescription: 'Découvrez nos soins capillaires 100% naturels pour cheveux. Shampoings bio, après-shampoings, huiles végétales et soins revitalisants.',
    subcategories: [
      {
        name: 'Shampoings',
        description: 'Shampoings naturels et bio pour tous types de cheveux',
        order: 1,
        metaTitle: 'Shampoings Naturels | Soins Capillaires',
        metaDescription: 'Shampoings 100% naturels pour cheveux normaux, secs, gras ou abîmés. Formulés avec des ingrédients bio et végétaux.'
      },
      {
        name: 'After-shampoings',
        description: 'After-shampoings et masques nourrissants',
        order: 2,
        metaTitle: 'After-shampoings Naturels | Soins Capillaires',
        metaDescription: 'After-shampoings et masques capillaires naturels pour démêler, nourrir et revitaliser vos cheveux.'
      },
      {
        name: 'Huiles Capillaires',
        description: 'Huiles végétales pour cheveux - Argan, Ricin, Coco',
        order: 3,
        featured: true,
        metaTitle: 'Huiles Capillaires Naturelles | Soins Cheveux',
        metaDescription: 'Huiles capillaires 100% pures : Argan, Ricin, Coco, Avocat. Pour nourrir, fortifier et faire briller vos cheveux.'
      },
      {
        name: 'Soins Revitalisants',
        description: 'Masques, sérums et soins intensifs',
        order: 4,
        metaTitle: 'Soins Revitalisants Cheveux | Traitements Naturels',
        metaDescription: 'Soins revitalisants et traitements intensifs pour cheveux abîmés. Masques, sérums et lotions naturelles.'
      }
    ]
  },
  {
    name: 'Soins du Corps',
    description: 'Produits naturels pour le corps - Crèmes, laits, gommages et huiles nourrissantes',
    order: 2,
    featured: true,
    metaTitle: 'Soins du Corps Naturels | Natura Divine Beauté',
    metaDescription: 'Soins corporels 100% naturels : crèmes hydratantes, laits corporels, gommages et huiles pour une peau douce et nourrie.',
    subcategories: [
      {
        name: 'Crèmes Hydratantes',
        description: 'Crèmes et laits pour le corps',
        order: 1,
        featured: true,
        metaTitle: 'Crèmes Hydratantes Corps | Soins Naturels',
        metaDescription: 'Crèmes et laits hydratants pour le corps. Formulés avec des beurres végétaux et huiles naturelles.'
      },
      {
        name: 'Gommages Corporels',
        description: 'Exfoliants naturels pour une peau douce',
        order: 2,
        metaTitle: 'Gommages Corporels Naturels | Exfoliants',
        metaDescription: 'Gommages et exfoliants corporels naturels. Éliminez les cellules mortes pour une peau douce et revitalisée.'
      },
      {
        name: 'Huiles pour le Corps',
        description: 'Huiles nourrissantes et massages',
        order: 3,
        metaTitle: 'Huiles Corps | Soins Nourrissants Naturels',
        metaDescription: 'Huiles corporelles naturelles pour nourrir, hydrater et parfumer votre peau. Parfaites pour les massages.'
      },
      {
        name: 'Beurres Végétaux',
        description: 'Beurre de karité, cacao, mangue',
        order: 4,
        metaTitle: 'Beurres Végétaux Naturels | Soins Corps',
        metaDescription: 'Beurres végétaux 100% naturels : Karité, Cacao, Mangue. Très nourrissants pour les peaux sèches.'
      }
    ]
  },
  {
    name: 'Huiles Essentielles',
    description: 'Huiles essentielles pures et synergies - Bien-être et aromathérapie',
    order: 3,
    featured: true,
    metaTitle: 'Huiles Essentielles Pures | Natura Divine Beauté',
    metaDescription: 'Huiles essentielles 100% pures et naturelles. Pour le bien-être, la relaxation et les soins beauté. Certifiées bio.',
    subcategories: [
      {
        name: 'Huiles Simples',
        description: 'Huiles essentielles individuelles',
        order: 1,
        metaTitle: 'Huiles Essentielles Simples | Aromathérapie',
        metaDescription: 'Huiles essentielles pures : Lavande, Tea Tree, Menthe, Eucalyptus. Pour diffusion, massage et soins.'
      },
      {
        name: 'Synergies',
        description: 'Mélanges d\'huiles essentielles',
        order: 2,
        featured: true,
        metaTitle: 'Synergies d\'Huiles Essentielles | Mélanges',
        metaDescription: 'Synergies et mélanges d\'huiles essentielles pour des bienfaits spécifiques : relaxation, énergie, respiration.'
      },
      {
        name: 'Roll-On',
        description: 'Huiles essentielles en application roll-on',
        order: 3,
        metaTitle: 'Huiles Essentielles Roll-On | Application Facile',
        metaDescription: 'Huiles essentielles en flacon roll-on pour une application facile et précise. Parfait pour les voyages.'
      }
    ]
  },
  {
    name: 'Soins Visage',
    description: 'Soins naturels pour le visage - Nettoyage, hydratation, anti-âge',
    order: 4,
    featured: false,
    metaTitle: 'Soins du Visage Naturels | Beauté Naturelle',
    metaDescription: 'Soins visage 100% naturels : nettoyants, hydratants, sérums et soins anti-âge. Pour une peau radieuse et saine.',
    subcategories: [
      {
        name: 'Nettoyants Visage',
        description: 'Gels, huiles et lotons nettoyants',
        order: 1,
        metaTitle: 'Nettoyants Visage Naturels | Soins Peau',
        metaDescription: 'Nettoyants visage naturels : gels, huiles démaquillantes et lotons. Pour une peau propre et purifiée.'
      },
      {
        name: 'Crèmes Visage',
        description: 'Hydratants et soins quotidiens',
        order: 2,
        metaTitle: 'Crèmes Visage Naturelles | Hydratation',
        metaDescription: 'Crèmes hydratantes pour le visage. Adaptées à tous types de peau : sèche, grasse, mixte ou sensible.'
      },
      {
        name: 'Sérums & Soins',
        description: 'Soins ciblés et traitements',
        order: 3,
        metaTitle: 'Sérums Visage | Soins Ciblés Naturels',
        metaDescription: 'Sérums et soins ciblés pour le visage. Anti-âge, éclat, hydratation intensive et soins spécifiques.'
      }
    ]
  }
];

const initCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Vérifier si des catégories existent déjà
    const existingCategories = await Category.countDocuments();
    
    if (existingCategories === 0) {
      console.log('Creating initial categories...');

      for (const mainCategory of initialCategories) {
        // Créer la catégorie principale
        const parentCat = await Category.create({
          name: mainCategory.name,
          description: mainCategory.description,
          order: mainCategory.order,
          featured: mainCategory.featured,
          metaTitle: mainCategory.metaTitle,
          metaDescription: mainCategory.metaDescription
        });

        console.log(`✅ Created main category: ${mainCategory.name}`);

        // Créer les sous-catégories
        for (const subcat of mainCategory.subcategories) {
          await Category.create({
            name: subcat.name,
            description: subcat.description,
            order: subcat.order,
            featured: subcat.featured || false,
            metaTitle: subcat.metaTitle,
            metaDescription: subcat.metaDescription,
            parentCategory: parentCat._id
          });
          console.log(`  └── Created subcategory: ${subcat.name}`);
        }
      }

      console.log('🎉 Initial categories created successfully!');
    } else {
      console.log('Categories already exist, skipping initialization.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error initializing categories:', error);
    process.exit(1);
  }
};

initCategories();