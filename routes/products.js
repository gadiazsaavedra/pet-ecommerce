const express = require('express');
const router = express.Router();
const { getProducts, getProductsByCategory, getCategories } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/category/:category', getProductsByCategory);

module.exports = router;