const express = require('express');
const router = express.Router();
const controller = require('./employees.controller');
const { verifyAdmin } = require('../../utils/services/verifyToken');
const verifyToken = require('../../utils/services/verifyToken');

// List by business and branch (must come before /:id to avoid conflicts)
// These endpoints accept all roles (admin=1, client=2, employee=3)
router.get('/business/:id_business', verifyToken(), controller.listEmployeesByBusiness);
router.get('/branch/:id_branch', verifyToken(), controller.listEmployeesByBranch);

// CRUD endpoints
router.post('/', verifyAdmin(), controller.createEmployee);
router.get('/', verifyAdmin(), controller.listEmployees);
router.get('/:id', verifyAdmin(), controller.getEmployeeById);
router.put('/:id', verifyAdmin(), controller.updateEmployee);
router.delete('/:id', verifyAdmin(), controller.deleteEmployee);

// Associate employee to branch
router.post('/:id/branch', verifyAdmin(), controller.associateToBranch);

// Availability and schedule
router.get('/:id/availability', verifyAdmin(), controller.getAvailability);
router.get('/:id/schedule', verifyAdmin(), controller.getSchedule);

module.exports = router;
