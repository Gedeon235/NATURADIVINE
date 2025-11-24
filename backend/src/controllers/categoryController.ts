// controllers/categoryController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Category, { ICategory } from '../models/Category.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Get all categories (with hierarchy and filters)
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      includeInactive, 
      hierarchy, 
      featured,
      parent 
    } = req.query;

    let categories;
    
    if (hierarchy === 'true') {
      // Retourner la hiérarchie complète
      const matchStage: any = { 
        isActive: includeInactive === 'true' ? { $in: [true, false] } : true 
      };

      if (featured === 'true') {
        matchStage.featured = true;
      }

      categories = await Category.aggregate([
        { $match: matchStage },
        {
          $graphLookup: {
            from: 'categories',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parentCategory',
            as: 'subcategories',
            maxDepth: 3
          }
        },
        { 
          $match: parent ? 
            { parentCategory: new mongoose.Types.ObjectId(parent as string) } : 
            { parentCategory: null } 
        },
        { 
          $sort: { order: 1, name: 1 } 
        },
        {
          $project: {
            name: 1,
            description: 1,
            image: 1,
            isActive: 1,
            order: 1,
            slug: 1,
            featured: 1,
            metaTitle: 1,
            metaDescription: 1,
            subcategories: {
              $map: {
                input: '$subcategories',
                as: 'sub',
                in: {
                  _id: '$$sub._id',
                  name: '$$sub.name',
                  description: '$$sub.description',
                  image: '$$sub.image',
                  isActive: '$$sub.isActive',
                  order: '$$sub.order',
                  slug: '$$sub.slug',
                  featured: '$$sub.featured',
                  parentCategory: '$$sub.parentCategory'
                }
              }
            }
          }
        }
      ]);
    } else {
      // Retourner une liste plate avec population du parent
      const query: any = {};
      
      if (includeInactive !== 'true') {
        query.isActive = true;
      }
      
      if (featured === 'true') {
        query.featured = true;
      }
      
      if (parent) {
        if (parent === 'null') {
          query.parentCategory = null;
        } else {
          query.parentCategory = parent;
        }
      }

      categories = await Category.find(query)
        .populate('parentCategory', 'name slug image')
        .sort({ order: 1, name: 1 })
        .populate({
          path: 'subcategories',
          match: { isActive: true },
          options: { sort: { order: 1, name: 1 } }
        });
    }

    // Compter les produits pour chaque catégorie
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category: any) => {
        const productCount = await Product.countDocuments({ 
          category: category._id,
          isPublished: true 
        });
        return {
          ...category,
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCounts.length,
      data: categoriesWithCounts
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
};

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:idOrSlug
// @access  Public
export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
   // Vérifier que idOrSlug est défini
    if (!idOrSlug) {
      res.status(400).json({
        success: false,
        message: 'ID ou slug de catégorie manquant'
      });
      return;
    }
    // Vérifier si c'est un ObjectId valide ou un slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    
    let category: ICategory | null;
    
    if (isObjectId) {
      category = await Category.findById(idOrSlug)
        .populate('parentCategory', 'name slug image')
        .populate({
          path: 'subcategories',
          match: { isActive: true },
          options: { sort: { order: 1, name: 1 } }
        });
    } else {
      category = await Category.findOne({ slug: idOrSlug })
        .populate('parentCategory', 'name slug image')
        .populate({
          path: 'subcategories',
          match: { isActive: true },
          options: { sort: { order: 1, name: 1 } }
        });
    }

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
      return;
    }

    // Récupérer les sous-catégories si elles existent
    const subcategories = await Category.find({ 
      parentCategory: category._id,
      isActive: true 
    }).sort({ order: 1, name: 1 });

    // Récupérer les produits de cette catégorie
    const products = await Product.find({ 
      category: category._id,
      isPublished: true 
    })
    .select('name image price stock')
    .limit(50)
    .sort({ createdAt: -1 });

    const productsCount = await Product.countDocuments({ 
      category: category._id,
      isPublished: true 
    });

    // Récupérer les catégories soeurs (même niveau)
    const siblingCategories = await Category.find({
      parentCategory: category.parentCategory,
      _id: { $ne: category._id },
      isActive: true
    })
    .select('name slug image')
    .sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
        products,
        productsCount,
        siblingCategories
      }
    });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie'
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      description, 
      image, 
      parentCategory, 
      order, 
      isActive,
      metaTitle,
      metaDescription,
      featured
    } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Le nom de la catégorie est obligatoire'
      });
      return;
    }

    // Vérifier si une catégorie avec le même nom existe déjà
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce nom existe déjà'
      });
      return;
    }

    // Vérifier si le parentCategory existe si fourni
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        res.status(400).json({
          success: false,
          message: 'La catégorie parente spécifiée n\'existe pas'
        });
        return;
      }
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim(),
      image,
      parentCategory: parentCategory || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      metaTitle,
      metaDescription,
      featured: featured || false
    });

    await category.populate('parentCategory', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: category
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce nom ou ce slug existe déjà'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie'
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      description, 
      image, 
      parentCategory, 
      order, 
      isActive,
      metaTitle,
      metaDescription,
      featured
    } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
      return;
    }

    // Empêcher une catégorie d'être son propre parent
    if (parentCategory && parentCategory === req.params.id) {
      res.status(400).json({
        success: false,
        message: 'Une catégorie ne peut pas être sa propre parente'
      });
      return;
    }

    // Vérifier si le parentCategory existe si fourni
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        res.status(400).json({
          success: false,
          message: 'La catégorie parente spécifiée n\'existe pas'
        });
        return;
      }
    }

    // Vérifier les conflits de nom si le nom est modifié
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        res.status(400).json({
          success: false,
          message: 'Une catégorie avec ce nom existe déjà'
        });
        return;
      }
    }

    // Mettre à jour les champs
    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim();
    if (image !== undefined) category.image = image;
    if (parentCategory !== undefined) category.parentCategory = parentCategory;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    if (metaTitle !== undefined) category.metaTitle = metaTitle;
    if (metaDescription !== undefined) category.metaDescription = metaDescription;
    if (featured !== undefined) category.featured = featured;

    await category.save();
    await category.populate('parentCategory', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: category
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce nom ou ce slug existe déjà'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
      return;
    }

    // Vérifier si la catégorie a des sous-catégories
    const subCategoriesCount = await Category.countDocuments({ 
      parentCategory: req.params.id 
    });

    if (subCategoriesCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une catégorie qui a des sous-catégories. Veuillez d\'abord supprimer ou déplacer les sous-catégories.'
      });
      return;
    }

    // Vérifier si la catégorie a des produits associés
    const productsCount = await Product.countDocuments({ 
      category: req.params.id 
    });

    if (productsCount > 0) {
      res.status(400).json({
        success: false,
        message: `Impossible de supprimer cette catégorie car ${productsCount} produit(s) y sont associés. Veuillez d\'abord déplacer ou supprimer ces produits.`
      });
      return;
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Catégorie supprimée avec succès',
      data: {}
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie'
    });
  }
};

// @desc    Get categories tree (for navigation)
// @route   GET /api/categories/tree
// @access  Public
export const getCategoriesTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $graphLookup: {
          from: 'categories',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentCategory',
          as: 'children',
          maxDepth: 2
        }
      },
      { $match: { parentCategory: null } },
      { $sort: { order: 1, name: 1 } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          image: 1,
          description: 1,
          featured: 1,
          productCount: { $size: '$products' },
          children: {
            $map: {
              input: '$children',
              as: 'child',
              in: {
                _id: '$$child._id',
                name: '$$child.name',
                slug: '$$child.slug',
                image: '$$child.image',
                description: '$$child.description',
                featured: '$$child.featured',
                parentCategory: '$$child.parentCategory',
                productCount: { $size: '$$child.products' }
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Error fetching categories tree:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'arborescence des catégories'
    });
  }
};

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
export const getFeaturedCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({
      isActive: true,
      featured: true,
      parentCategory: null // Seulement les catégories principales
    })
    .select('name slug image description')
    .sort({ order: 1, name: 1 })
    .limit(6);

    // Compter les produits pour chaque catégorie
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id,
          isPublished: true 
        });
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error: any) {
    console.error('Error fetching featured categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories en vedette'
    });
  }
};

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
export const reorderCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categories } = req.body; // Array of { id, order }

    if (!Array.isArray(categories)) {
      res.status(400).json({
        success: false,
        message: 'Le format des données est invalide'
      });
      return;
    }

    const bulkOperations = categories.map((cat: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: cat.id },
        update: { order: cat.order }
      }
    }));

    await Category.bulkWrite(bulkOperations);

    res.status(200).json({
      success: true,
      message: 'Ordre des catégories mis à jour avec succès'
    });
  } catch (error: any) {
    console.error('Error reordering categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du réordonnancement des catégories'
    });
  }
};