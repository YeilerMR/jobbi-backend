const express = require("express");
const router = express.Router();
const calendarController = require("./calendar.controller");
const verifyToken = require("../../utils/services/verifyToken");

/**
 * ----------------------------------------------------------------------
 * GOOGLE CALENDAR + DB SYNCHRONIZED ENDPOINTS
 * ----------------------------------------------------------------------
 */

router.get('/events', verifyToken(), calendarController.getMyEvents)

// Fetch all events for an employee (Google Calendar + DB merged)
router.get('/:id_employee/events', verifyToken(), calendarController.getEvents);

// Create a new event (Google Calendar + DB)
router.post('/:id_employee/events', verifyToken(), calendarController.createEvent);

// Update an event (Google Calendar + DB)
router.put('/:id_employee/events/:id', verifyToken(), calendarController.updateEvent);

// Delete an event (Google Calendar + DB)
router.delete('/:id_employee/events/:id', verifyToken(), calendarController.deleteEvent);

/**
 * ----------------------------------------------------------------------
 * ADDITIONAL LOCAL DATA MANAGEMENT
 * ----------------------------------------------------------------------
 */

// Retrieve full calendar info for an employee (working hours, exceptions, booked events)
router.get('/:id_employee/calendar', verifyToken(), calendarController.getCalendarDB);

// Get daily availability for an employee
router.get('/:id_employee/availability/:date', verifyToken(), calendarController.getDailyAvailability);

module.exports = router;
