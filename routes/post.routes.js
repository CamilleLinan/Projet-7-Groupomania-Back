const router = require('express').Router();
const postCtrl = require('../controllers/post.controller');

// Import middleware
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth.middleware');

// Post
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;