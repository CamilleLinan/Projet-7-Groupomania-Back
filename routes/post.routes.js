const router = require('express').Router();
const postCtrl = require('../controllers/post.controller');

// Import middleware
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth.middleware');

// Post
router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

// Like
router.post('/:id/like', auth, postCtrl.likePost);

module.exports = router;