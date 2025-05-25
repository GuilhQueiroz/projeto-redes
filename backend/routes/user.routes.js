const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const postService = require('../services/postService');

router.get('/me', auth, userController.getProfile);
router.put('/me', auth, upload.single('avatar'), userController.updateProfile);

// GET /api/users/:id/posts
router.get('/:id/posts', async (req, res, next) => {
    try {
        const posts = await postService.getPostsByUser(req.params.id);
        res.json(posts);
    } catch (err) {
        next(err);
    }
});

module.exports = router;