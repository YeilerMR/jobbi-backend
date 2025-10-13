const express = require('express');
const router = express.Router();
const serviceController = require('./service.controller');
const verifyToken = require('../../utils/services/verifyToken');

// POST /services - Create a service (branch must belong to user)
router.post('/', verifyToken(), serviceController.createService);
router.get('/:branchId', verifyToken(), serviceController.getServicesByBranch);
router.put('/:id', verifyToken(), serviceController.updateService);
router.delete('/:id', verifyToken(), serviceController.deleteService);

module.exports = router;
