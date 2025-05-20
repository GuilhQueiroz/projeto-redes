const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/me', auth, userController.getProfile);
router.put('/me', auth, upload.single('avatar'), userController.updateProfile);

module.exports = router;