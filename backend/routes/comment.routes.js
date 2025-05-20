const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');

router.get('/post/:postId', commentController.getCommentsByPost);
router.post('/post/:postId', auth, commentController.createComment);
router.post('/reply/:commentId', auth, commentController.replyToComment);

module.exports = router;