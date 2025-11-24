const getProducts = async (req, res) => {
  try {
    const products = [
      {
        _id: '1',
        name: 'Crème hydratante Naturelle',
        price: 29.99,
        category: 'Soin visage',
        image: '/images/creme-hydratante.jpg',
        stock: 50,
        rating: 4.5
      },
      {
        _id: '2',
        name: 'Sérum Anti-Âge', 
        price: 49.99,
        category: 'Soin visage',
        image: '/images/serum-anti-age.jpg',
        stock: 30,
        rating: 4.8
      }
    ];

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = {
      _id: req.params.id,
      name: 'Crème hydratante Naturelle',
      price: 29.99,
      category: 'Soin visage',
      description: 'Crème hydratante profonde aux ingrédients naturels'
    };

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Produit mis à jour',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};