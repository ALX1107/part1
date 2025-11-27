// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { getSalesByProduct, createSale } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/sales-by-product', getSalesByProduct);
router.post('/sales', protect, createSale);

module.exports = router;
