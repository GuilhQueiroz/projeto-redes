const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const auth = require('../middlewares/authMiddleware');

router.post('/post/:postId', auth, interactionController.likePost);
router.post('/comment/:commentId', auth, interactionController.likeComment);

module.exports = router;