const express = require('express');
const router = express.Router();
const branchController = require('./branch.controller');
const verifyToken = require('../../utils/services/verifyToken');

// GET /branches (just an example protected route)
router.get('/', verifyToken(), branchController.getBranchesByBusiness);

module.exports = router;
