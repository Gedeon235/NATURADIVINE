import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all blog posts (public)
// @route   GET /api/blog
// @access  Public
export const getBlogPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 9, 
      category, 
      tag, 
      featured, 
      search,
      sort = 'newest'
    } = req.query;

    // Construction de la requête
    let query: any = { isPublished: true };

    // Filtres
    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Recherche
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // Tri
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { publishedAt: -1 };
        break;
      case 'oldest':
        sortOption = { publishedAt: 1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'featured':
        sortOption = { isFeatured: -1, publishedAt: -1 };
        break;
      default:
        sortOption = { publishedAt: -1 };
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'name avatar')
      .select('-content') // Ne pas envoyer le contenu complet dans la liste
      .sort(sortOption)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await BlogPost.countDocuments(query);

    // Obtenir les catégories disponibles
    const categories = await BlogPost.distinct('category', { isPublished: true });

    // Obtenir les tags populaires
    const popularTags = await BlogPost.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        },
        filters: {
          categories,
          popularTags: popularTags.map(tag => ({
            name: tag._id,
            count: tag.count
          }))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:idOrSlug
// @access  Public
export const getBlogPost = async (req: Request, res: Response): Promise<void> => {
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
    
    let post;
    if (isObjectId) {
      post = await BlogPost.findOne({
        _id: idOrSlug,
        isPublished: true
      }).populate('author', 'name avatar bio');
    } else {
      post = await BlogPost.findOne({
        slug: idOrSlug,
        isPublished: true
      }).populate('author', 'name avatar bio');
    }

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Article de blog non trouvé'
      });
      return;
    }

    // Incrémenter le compteur de vues
await (post as any).incrementViews();

    // Articles similaires (même catégorie ou tags similaires)
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      isPublished: true,
      $or: [
        { category: post.category },
        { tags: { $in: post.tags } }
      ]
    })
    .populate('author', 'name avatar')
    .select('-content')
    .sort({ views: -1 })
    .limit(3);

    res.status(200).json({
      success: true,
      data: {
        post,
        relatedPosts
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create blog post (Admin)
// @route   POST /api/blog
// @access  Private/Admin
export const createBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      excerpt,
      content,
      image,
      images,
      tags,
      category,
      isPublished,
      isFeatured,
      metaTitle,
      metaDescription
    } = req.body;

    // Validation
    if (!title || !excerpt || !content || !image || !category) {
      res.status(400).json({
        success: false,
        message: 'Le titre, extrait, contenu, image et catégorie sont obligatoires'
      });
      return;
    }

    // Vérifier si un article avec le même titre existe déjà
    const existingPost = await BlogPost.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') } 
    });

    if (existingPost) {
      res.status(400).json({
        success: false,
        message: 'Un article avec ce titre existe déjà'
      });
      return;
    }

    const blogPost = await BlogPost.create({
      title,
      excerpt,
      content,
      image,
      images: images || [],
      tags: tags || [],
      category,
      author: req.user?._id,
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      metaTitle,
      metaDescription,
      ...(isPublished && { publishedAt: new Date() })
    });

    await blogPost.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: `Article de blog ${isPublished ? 'publié' : 'créé'} avec succès`,
      data: blogPost
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Un article avec ce slug existe déjà'
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      excerpt,
      content,
      image,
      images,
      tags,
      category,
      isPublished,
      isFeatured,
      metaTitle,
      metaDescription
    } = req.body;

    let blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      res.status(404).json({
        success: false,
        message: 'Article de blog non trouvé'
      });
      return;
    }

    // Si l'article passe de non publié à publié
    const wasPublished = blogPost.isPublished;
    if (!wasPublished && isPublished) {
      blogPost.publishedAt = new Date();
    }

    // Mettre à jour les champs
    if (title) blogPost.title = title;
    if (excerpt) blogPost.excerpt = excerpt;
    if (content) blogPost.content = content;
    if (image) blogPost.image = image;
    if (images) blogPost.images = images;
    if (tags) blogPost.tags = tags;
    if (category) blogPost.category = category;
    if (typeof isPublished !== 'undefined') blogPost.isPublished = isPublished;
    if (typeof isFeatured !== 'undefined') blogPost.isFeatured = isFeatured;
    if (metaTitle) blogPost.metaTitle = metaTitle;
    if (metaDescription) blogPost.metaDescription = metaDescription;

    await blogPost.save();
    await blogPost.populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Article de blog mis à jour avec succès',
      data: blogPost
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Un article avec ce slug existe déjà'
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      res.status(404).json({
        success: false,
        message: 'Article de blog non trouvé'
      });
      return;
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Article de blog supprimé avec succès',
      data: {}
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like blog post
// @route   PUT /api/blog/:id/like
// @access  Private
export const likeBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      res.status(404).json({
        success: false,
        message: 'Article de blog non trouvé'
      });
      return;
    }

await (blogPost as any).addLike(req.user!._id);

    res.status(200).json({
      success: true,
      message: 'Article liké',
      data: { likes: blogPost.likes }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comments
// @access  Private
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        message: 'Le contenu du commentaire est obligatoire'
      });
      return;
    }

    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      res.status(404).json({
        success: false,
        message: 'Article de blog non trouvé'
      });
      return;
    }

await (blogPost as any).addComment(req.user!._id, content);

    // Recharger l'article avec les commentaires approuvés
    const updatedPost = await BlogPost.findById(req.params.id)
      .populate('comments.user', 'name avatar')
      .select('comments');

    const approvedComments = updatedPost!.comments.filter(comment => comment.isApproved);

    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté et en attente de modération',
      data: { comments: approvedComments }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blog posts by author
// @route   GET /api/blog/author/:authorId
// @access  Public
export const getBlogPostsByAuthor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { authorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await BlogPost.find({
      author: authorId,
      isPublished: true
    })
    .populate('author', 'name avatar bio')
    .select('-content')
    .sort({ publishedAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

    const total = await BlogPost.countDocuments({
      author: authorId,
      isPublished: true
    });

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blog statistics (Admin)
// @route   GET /api/blog/admin/stats
// @access  Private/Admin
export const getBlogStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await BlogPost.aggregate([
      {
        $facet: {
          totalPosts: [
            { $count: 'count' }
          ],
          publishedPosts: [
            { $match: { isPublished: true } },
            { $count: 'count' }
          ],
          featuredPosts: [
            { $match: { isFeatured: true, isPublished: true } },
            { $count: 'count' }
          ],
          totalViews: [
            { $group: { _id: null, total: { $sum: '$views' } } }
          ],
          totalLikes: [
            { $group: { _id: null, total: { $sum: '$likes' } } }
          ],
          postsByCategory: [
            { $match: { isPublished: true } },
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
                totalViews: { $sum: '$views' }
              }
            },
            { $sort: { count: -1 } }
          ],
          popularPosts: [
            { $match: { isPublished: true } },
            { $sort: { views: -1 } },
            { $limit: 5 },
            {
              $project: {
                title: 1,
                views: 1,
                likes: 1,
                publishedAt: 1
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};