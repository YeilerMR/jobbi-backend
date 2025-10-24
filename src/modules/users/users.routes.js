const express = require('express');
const router = express.Router();
const controller = require('./users.controller');
const verifyToken = require('../../utils/services/verifyToken');

// Search users by name (all roles can use)
router.get('/search', verifyToken(), controller.searchUsersByName);

module.exports = router;
