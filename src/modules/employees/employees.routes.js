const express = require('express');
const router = express.Router();
const controller = require('./employees.controller');
const { verifyAdmin } = require('../../utils/services/verifyToken');
const verifyToken = require('../../utils/services/verifyToken');

// List by business and branch (must come before /:id to avoid conflicts)
// These endpoints accept all roles (admin=1, client=2, employee=3)
router.get('/business/:id_business', verifyToken(), controller.listEmployeesByBusiness);
router.get('/branch/:id_branch', verifyToken(), controller.listEmployeesByBranch);
// Get appointments for authenticated employee for a specific day (query param: date=YYYY-MM-DD)
// Allow both /appointments and /me/appointments so clients calling the more-explicit path
// don't accidentally match the '/:id' admin-protected route.
router.get('/appointments', verifyToken.verifyEmployee ? verifyToken.verifyEmployee() : verifyToken(), controller.getAppointmentsForDay);
router.get('/me/appointments', verifyToken.verifyEmployee ? verifyToken.verifyEmployee() : verifyToken(), controller.getAppointmentsForDay);

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
