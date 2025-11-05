// controllers/calendar.controller.js
const { authorize } = require("../../utils/services/googleAuth");
const calendarService = require("./calendar.service"); // Handles both Google + DB logic

/**
 * ----------------------------------------------------------------------
 * GOOGLE CALENDAR + LOCAL DB SYNCHRONIZED CONTROLLERS
 * ----------------------------------------------------------------------
 */

exports.getEvents = async (req, res) => {
    try {
        const { id_employee } = req.params;
        const auth = await authorize();
        const events = await calendarService.getEvents(auth, id_employee);
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { id_employee } = req.params;
        const eventData = req.body;
        const auth = await authorize();

        // 1️⃣ Create in Google Calendar
        const googleEvent = await calendarService.createGoogleEvent(auth, eventData);

        // 2️⃣ Store reference in MariaDB (link with employee)
        if (id_employee) {
            await calendarService.createEventInDB(id_employee, {
                ...eventData,
                google_event_id: googleEvent.id,
            });
        }

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: googleEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id_employee, id } = req.params;
        const eventData = req.body;
        const auth = await authorize();

        // 1️⃣ Update in Google Calendar
        const updatedGoogleEvent = await calendarService.updateGoogleEvent(
            auth,
            id,
            eventData
        );

        // 2️⃣ Update in DB (if employee provided)
        if (id_employee) {
            await calendarService.updateEventInDB(id_employee, id, eventData);
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedGoogleEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id_employee, id } = req.params;
        const auth = await authorize();

        // 1️⃣ Delete from Google Calendar
        await calendarService.deleteGoogleEvent(auth, id);

        // 2️⃣ Delete from DB if it exists there
        if (id_employee) {
            await calendarService.deleteEventFromDB(id_employee, id);
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * ----------------------------------------------------------------------
 * ADDITIONAL LOCAL DATA MANAGEMENT (employee availability, config, etc.)
 * ----------------------------------------------------------------------
 */

exports.getCalendarDB = async (req, res) => {
    try {
        const { id_employee } = req.params;
        const calendar = await calendarService.getCalendar(id_employee);

        res.status(200).json({
            success: true,
            message: "Calendar retrieved successfully",
            data: calendar,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getDailyAvailability = async (req, res) => {
    try {
        const { id_employee, date } = req.params;
        const result = await calendarService.getDailyAvailability(id_employee, date);

        res.status(200).json({
            success: true,
            message: "Availability generated successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
