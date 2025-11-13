const express = require('express');
const router = express.Router();
const serviceController = require('./service.controller');
const verifyToken = require('../../utils/services/verifyToken');

router.get('/search', serviceController.getBranchesByService);
router.get('/:branchId', verifyToken(), serviceController.getServicesByBranch);
router.get('/', verifyToken(), serviceController.getServicesByUser);
router.put('/:id', verifyToken(), serviceController.updateService);
router.delete('/:id', verifyToken(), serviceController.deleteService);
router.post('/create', verifyToken(), serviceController.createService);
module.exports = router;

