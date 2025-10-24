const express = require('express');
const router = express.Router();
const branchController = require('./branch.controller');
const verifyToken = require('../../utils/services/verifyToken');


// GET /branches (get branches by user in sesion) | /branches?businessId= (get branches by business)
router.get('/', verifyToken(), branchController.getBranches);

// GET /branches/all (list all branches)
router.get('/all', verifyToken(), branchController.getAllBranches);

// GET /branches/:id (get branch by id)
router.get('/:id', verifyToken(), branchController.getBranchById);

// POST /branches (create branch)
router.post('/', verifyToken(), branchController.createBranch);

// PUT /branches/:id (update branch)
router.put('/:id', verifyToken(), branchController.updateBranch);

// DELETE /branches/:id (delete branch)
router.delete('/:id', verifyToken(), branchController.deleteBranch);

module.exports = router;
