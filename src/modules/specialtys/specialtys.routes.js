const express = require('express');
const router = express.Router();
const specialtysController = require('./specialtys.controller');

// GET /specialtys - List all specialties
router.get('/', specialtysController.getAllSpecialtys);

module.exports = router;
