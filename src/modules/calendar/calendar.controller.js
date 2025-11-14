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

exports.getMyEvents = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const userRol = req.user.id_rol;

        const data = await calendarService.getMyEvents(userRol == 2 ? userId : null, userRol == 3 ? userId : null);

        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const payload = req.body;
        const id_client = req.user.id_user;

        if (!id_client)
            return res.status(400).json({ success: false, message: "Invalid client token" });

        const required = ["id_branch", "id_employee", "id_service", "appointment_date", "appointment_time"];
        for (const field of required) {
            if (!payload[field]) {
                return res.status(400).json({ success: false, message: `${field} is required` });
            }
        }

        // Build event
        const event = await calendarService.buildEventFromReducedPayload(payload, id_client);

        // Check availability
        const availabilityCheck = await calendarService.checkAvailability(
            payload.id_employee,
            event.start,
            event.end
        );

        if (!availabilityCheck.available) {
            return res.status(409).json({
                success: false,
                message: "Time slot unavailable",
                conflictingEvent: availabilityCheck.conflict
            });
        }

        // Google auth
        const auth = await authorize();

        // Create Google + DB
        const googleEvent = await calendarService.createEvent(
            auth,
            payload.id_employee,
            payload.id_branch,
            id_client,
            event
        );

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: googleEvent
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
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
