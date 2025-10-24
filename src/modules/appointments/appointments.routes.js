const express = require('express');
const router = express.Router();
const verifyToken = require('../../utils/services/verifyToken');
const controller = require('./appointments.controller');

// Create appointment
router.post('/', verifyToken(), controller.createAppointment);

// List appointments (filters: client, branch, employee, date, status)
router.get('/', verifyToken(), controller.listAppointments);

// Get appointment by ID
router.get('/:id', verifyToken(), controller.getAppointmentById);

// Update status (pending → confirmed/rejected/rescheduled/cancelled)
router.patch('/:id/status', verifyToken(), controller.updateStatus);

// Reschedule appointment (updates date/time and marks rescheduled)
router.put('/:id', verifyToken(), controller.rescheduleAppointment);

// Cancel appointment
router.delete('/:id', verifyToken(), controller.cancelAppointment);

module.exports = router;
