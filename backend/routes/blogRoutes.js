const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Standard CRUD
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogByIdOrSlug);

module.exports = router;
