const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/register
router.post('/register', authController.register);

// GET /auth/profile (just an example protected route)
router.get('/profile', authController.getProfile);

module.exports = router;
