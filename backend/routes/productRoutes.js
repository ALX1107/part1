// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.post('/', protect, requireAdmin, createProduct); // opcional

module.exports = router;
