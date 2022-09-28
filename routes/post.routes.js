const router = require('express').Router();
const postCtrl = require('../controllers/post.controller');

// Import middleware
const multer = require('../middlewares/multer-config');

// Post
router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getOnePost);
router.post('/', multer, postCtrl.createPost);
router.put('/:id', multer, postCtrl.updatePost);
router.delete('/:id', postCtrl.deletePost);

module.exports = router;