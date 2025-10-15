const express = require("express");
const router = express.Router();
const calendarController = require("./calendar.controller");
const verifyToken = require("../../utils/services/verifyToken");

router.get('/events', verifyToken(), calendarController.getEvents);
router.post('/events', verifyToken(), calendarController.createEvent);
router.put('/events/:id', verifyToken(), calendarController.updateEvent);
router.delete('/events/:id', verifyToken(), calendarController.deleteEvent);

module.exports = router;