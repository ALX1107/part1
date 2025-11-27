// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getAccessLogsPdf } = require('../controllers/reportController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.get('/access-logs/pdf', protect, requireAdmin, getAccessLogsPdf);

module.exports = router;
