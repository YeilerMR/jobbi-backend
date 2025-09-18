const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// POST /auth/login
router.post('/login', authController.login);

// GET /auth/profile (just an example protected route)
router.get('/profile', authController.getProfile);

module.exports = router;
