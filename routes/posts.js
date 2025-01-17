const express = require('express');
const router = express.Router();

// Import controller functions
const { getAllPosts, createPost, updatePost, deletePost, getPostsLength, getLocationPostsLength } = require('../controllers/posts');

// Route to get all posts
router.route('/').get(getAllPosts).post(createPost);

router.route('/length').get(getPostsLength);
router.route('/by-location-length').get(getLocationPostsLength);

// Route to update a specific post by ID
router.route('/:id').put(updatePost);

// Route to delete a specific post by ID
router.route('/:id').delete(deletePost);

module.exports = router;
