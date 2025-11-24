const getServices = async (req, res) => {
  try {
    const services = [
      {
        _id: '1',
        name: 'Soin du Visage Complet',
        duration: 60,
        price: 65,
        category: 'Soin visage'
      },
      {
        _id: '2', 
        name: 'Massage Relaxant',
        duration: 90,
        price: 85,
        category: 'Massage'
      }
    ];

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getService = async (req, res) => {
  try {
    const service = {
      _id: req.params.id,
      name: 'Soin du Visage Complet',
      duration: 60,
      price: 65,
      category: 'Soin visage'
    };

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createService = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: 'Service créé avec succès',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateService = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Service mis à jour',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteService = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Service supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getServiceBeauticians = async (req, res) => {
  try {
    const beauticians = [
      {
        _id: '1',
        name: 'Sophie Martin',
        specialty: 'Soins du visage'
      },
      {
        _id: '2',
        name: 'Laura Dubois',
        specialty: 'Massage'
      }
    ];

    res.status(200).json({
      success: true,
      data: beauticians
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceBeauticians
};