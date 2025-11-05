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

        // Validate required fields
        const requiredFields = ['title', 'start', 'end'];
        for (const field of requiredFields) {
            if (!eventData[field]) {
                return res.status(400).json({ success: false, message: `${field} is required` });
            }
        }

        // Extract IDs
        const id_client = eventData.client?.id_client || null;
        const id_branch = eventData.branch?.id_branch || null;

        if (!id_client || !id_branch) {
            return res.status(400).json({
                success: false,
                message: "Both id_client and id_branch are required in the request body."
            });
        }

        // Check availability
        const availabilityCheck = await calendarService.checkAvailability(
            id_employee,
            eventData.start,
            eventData.end
        );
        if (!availabilityCheck.available) {
            return res.status(409).json({
                success: false,
                message: 'The selected time slot is already booked or unavailable',
                conflictingEvent: availabilityCheck.conflict
            });
        }

        // Google Calendar Auth
        const auth = await authorize();

        // Create event in both Google Calendar and DB
        const googleEvent = await calendarService.createEvent(
            auth,
            id_employee,
            id_branch,
            id_client,
            eventData
        );

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
        console.error("Error generating availability:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to generate availability",
        });
    }
};
