const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories');

// Routes
router.get('/', getCategories); // Get all categories
router.get('/:key', getCategoryById); // Get a single category by id

router.post('/', addCategory); // Add a new category

router.put('/:key', updateCategory); // Update an existing category

router.delete('/:key', deleteCategory); // Delete a category

module.exports = router;
