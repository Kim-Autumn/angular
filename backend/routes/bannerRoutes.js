const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// Specialized route: 3 banner mới nhất
router.get('/latest', bannerController.getLatestBanners);

// Standard CRUD
router.get('/', bannerController.getBanners);
router.get('/:id', bannerController.getBannerByIdOrSlug);

module.exports = router;
