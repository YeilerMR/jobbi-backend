const express = require('express');
const router = express.Router();
const businessController = require('./business.controller');
const verifyToken = require('../../utils/services/verifyToken');

// Rutas públicas (sin autenticación) para búsqueda
router.get('/search', businessController.searchBusinesses);
router.get('/:id/details', businessController.getBusinessDetails);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken(), businessController.createBusiness);
router.get('/', verifyToken(), businessController.listBusinesses);
router.get('/:id', verifyToken(), businessController.getBusinessById);
router.put('/:id', verifyToken(), businessController.updateBusiness);
router.delete('/:id', verifyToken(), businessController.deleteBusiness);

module.exports = router;
