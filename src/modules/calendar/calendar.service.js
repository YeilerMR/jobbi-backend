// services/calendar.service.js
const { google } = require('googleapis');
const db = require('./calendar.db');
const { DateTime } = require('luxon');

const { getUserById } = require("../user/user.db");
const { getEmployeeById } = require("../employees/employees.db");
const { getBusinessByBranch } = require("../business/business.db");
const { findServiceById } = require("../service/service.db");
/* ============================================================
   GOOGLE CALENDAR METHODS
   ============================================================ */

exports.listGoogleEvents = async (auth) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return res.data.items || [];
};

exports.updateGoogleEvent = async (auth, eventId, data) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const updatedEvent = {
        summary: data.summary || data.title || 'Untitled Event',
        location: data.location || '',
        description: data.description || '',
        start: {
            dateTime: data.start,
            timeZone: data.timezone || 'America/Costa_Rica',
        },
        end: {
            dateTime: data.end,
            timeZone: data.timezone || 'America/Costa_Rica',
        },
        attendees: [
            data.client?.email ? { email: data.client.email } : null,
            data.business?.email ? { email: data.business.email } : null,
            data.employee?.email ? { email: data.employee.email } : null,
        ].filter(Boolean),
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
            ],
        },
    };

    const res = await calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: updatedEvent,
    });

    return res.data;
};

exports.deleteGoogleEvent = async (auth, eventId) => {
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({ calendarId: 'primary', eventId });
};

/* ============================================================
   DATABASE METHODS
   ============================================================ */

exports.getEventsFromDB = async (id_employee) => {
    if (!id_employee) throw new Error('Employee ID required');
    return await db.getEvents(id_employee);
};

exports.updateEventInDB = async (id_employee, id, event) => {
    if (!id) throw new Error('Event ID required');
    return await db.updateEvent(id_employee, id, event);
};

exports.deleteEventFromDB = async (id_employee, id) => {
    if (!id) throw new Error('Event ID required');
    return await db.deleteEvent(id_employee, id);
};

exports.getCalendar = async (id_employee) => {
    if (!id_employee) throw new Error('Employee ID required');
    return await db.getCalendar(id_employee);
};

exports.getDailyAvailability = async (id_employee, date) => {
    return await db.generateAvailability(id_employee, date);
};

// Check availability for a specific slot
exports.checkAvailability = async (id_employee, start, end) => {
    const availability = await db.generateAvailability(id_employee, start.split('T')[0]);

    const startDT = DateTime.fromISO(start);
    const endDT = DateTime.fromISO(end);

    // Find conflicting slot
    const conflict = availability.slots.find(slot => {
        const slotStart = DateTime.fromISO(slot.start);
        const slotEnd = DateTime.fromISO(slot.end);
        return !(endDT <= slotStart || startDT >= slotEnd) && slot.status !== 'available';
    });

    return { available: !conflict, conflict };
};

/* ============================================================
   UNIFIED LOGIC (GOOGLE + DB)
   ============================================================ */

// Return merged list of events (Google + Local)
exports.getEvents = async (auth, id_employee) => {
    const [googleEvents, dbEvents] = await Promise.all([
        this.listGoogleEvents(auth),
        id_employee ? this.getEventsFromDB(id_employee) : [],
    ]);

    return this.mergeEvents(googleEvents, dbEvents);
};

// Update event in both Google and DB
exports.updateEvent = async (auth, id_employee, eventId, eventData) => {
    const updatedGoogleEvent = await this.updateGoogleEvent(auth, eventId, eventData);

    if (id_employee) {
        await this.updateEventInDB(id_employee, eventId, eventData);
    }

    return updatedGoogleEvent;
};

// Delete event from both Google and DB
exports.deleteEvent = async (auth, id_employee, eventId) => {
    await this.deleteGoogleEvent(auth, eventId);
    if (id_employee) {
        await this.deleteEventFromDB(id_employee, eventId);
    }
};

// Merge both sources into one list
exports.mergeEvents = (googleEvents, dbEvents) => {
    const taggedGoogle = googleEvents.map(e => ({
        id: e.id,
        title: e.summary,
        start: e.start?.dateTime,
        end: e.end?.dateTime,
        source: 'google',
    }));

    const taggedLocal = dbEvents.map(e => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        source: 'local',
    }));

    return [...taggedGoogle, ...taggedLocal];
};


exports.getEmailsForEvent = async (id_client, id_employee, id_branch) => {
    const client = await getUserById(id_client);
    const employee = await getEmployeeById(id_employee);
    const business = await getBusinessByBranch(id_branch);

    return {
        clientEmail: client?.email || null,
        employeeEmail: employee?.email || null,
        businessEmail: business?.email || null
    };
};

// Create event in both Google and DB
exports.createEvent = async (auth, id_employee, id_branch, id_client, eventData) => {

    const emails = await this.getEmailsForEvent(id_client, id_employee, id_branch);

    const googleEvent = await this.createGoogleEvent(auth, {
        ...eventData,
        clientEmail: emails.clientEmail,
        employeeEmail: emails.employeeEmail,
        businessEmail: emails.businessEmail,
    });

    await this.createEventInDB(id_employee, {
        ...eventData,
        google_event_id: googleEvent.id,
        id_client,
        id_branch
    });

    return googleEvent;
};


exports.createEventInDB = async (id_employee, event) => {
    if (!event?.start || !event?.end) throw new Error('Event start/end required');
    return await db.createEvent(id_employee, event);
};

exports.createGoogleEvent = async (auth, data) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
        summary: data.title || "Service",
        description: data.description || "",
        location: data.location || "",
        start: {
            dateTime: data.start,
            timeZone: data.timezone || 'America/Costa_Rica',
        },
        end: {
            dateTime: data.end,
            timeZone: data.timezone || 'America/Costa_Rica',
        },
        attendees: [
            data.clientEmail ? { email: data.clientEmail } : null,
            data.employeeEmail ? { email: data.employeeEmail } : null,
            data.businessEmail ? { email: data.businessEmail } : null
        ].filter(Boolean)
    };

    const res = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    return res.data;
};


exports.buildEventFromReducedPayload = async (payload, id_client) => {
    const { appointment_date, appointment_time, id_service } = payload;

    const service = await findServiceById(id_service);
    if (!service) throw new Error("Service not found");

    // Start datetime
    const start = `${appointment_date}T${appointment_time}`;

    // End datetime (no UTC shift)
    const endDate = new Date(`${appointment_date}T${appointment_time}`);
    endDate.setMinutes(endDate.getMinutes() + service.duration);

    const end = `${appointment_date}T${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}:00`;

    return {
        title: service.name,
        description: service.description || "",
        location: "",
        start,
        end,
        id_service,
        id_client,
        id_employee: payload.id_employee,
        id_branch: payload.id_branch,
        type: "client",
        recurrence: null,
        timezone: "America/Costa_Rica"
    };
};

exports.getMyEvents = async (idClient = null, idEmployee = null) => {
    
    if(idClient) {
        return db.getMyCalendarCliDB(idClient);
    }

    if(idEmployee) {
        return db.getMyCalendarEmpDB(idEmployee);
    }
    return null;
};