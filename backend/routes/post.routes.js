const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/authMiddleware');

router.get('/', postController.getAllPosts);
router.post('/posts/:id/vote', auth, postController.votePost);
router.get('/:id', postController.getPostById);
router.post('/', auth, postController.createPost);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;