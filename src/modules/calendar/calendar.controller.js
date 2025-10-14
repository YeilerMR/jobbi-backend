// controllers/calendar.controller.js
const { authorize } = require("../../utils/services/googleAuth");
const calendarService = require("./calendar.service");

exports.getEvents = async (req, res) => {
    try {
        const auth = await authorize();
        const events = await calendarService.listEvents(auth);

        if (!events.length) {
            return res.status(404).json({ success: false, message: 'No upcoming events found' });
        }

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const auth = await authorize();
        const eventData = req.body;

        const event = await calendarService.createEvent(auth, eventData);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const auth = await authorize();
        const eventId = req.params.id;
        const eventData = req.body;

        const updatedEvent = await calendarService.updateEvent(auth, eventId, eventData);
        res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const auth = await authorize();
        const eventId = req.params.id;

        await calendarService.deleteEvent(auth, eventId);
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
