const express = require('express');
const router = express.Router();

// Import middlewares
const password = require('../middlewares/password.middleware');

// Import controllers
const logCtrl = require('../controllers/log.controller');

// Log routes
router.post('/signup', password, logCtrl.signup);
router.post('/signin', logCtrl.signin);


module.exports = router;