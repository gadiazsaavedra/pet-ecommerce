const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { category, petType, search, page = 1, limit = 20 } = req.query;
    
    let filter = { isActive: true };
    
    if (category) filter.category = category;
    if (petType) filter.petType = petType;
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { petType } = req.query;
    
    let filter = { category, isActive: true };
    if (petType) filter.petType = petType;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    const petTypes = await Product.distinct('petType', { isActive: true });
    
    res.json({ categories, petTypes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getCategories
};