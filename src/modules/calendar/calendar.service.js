// services/calendar.service.js
const { google } = require('googleapis');
const db = require('./calendar.db');
const { DateTime } = require('luxon');

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

exports.createGoogleEvent = async (auth, data) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
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

    const res = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    });

    return res.data;
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

exports.createEventInDB = async (id_employee, event) => {
    if (!event?.start || !event?.end) throw new Error('Event start/end required');
    return await db.createEvent(id_employee, event);
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

// Create event in both Google and DB
exports.createEvent = async (auth, id_employee, id_branch, id_client, eventData) => {
    // 1️⃣ Create Google Calendar event
    const googleEvent = await this.createGoogleEvent(auth, eventData);

    // 2️⃣ Store in DB
    if (id_employee) {
        await this.createEventInDB(id_employee, {
            ...eventData,
            google_event_id: googleEvent.id,
            id_client,
            id_branch
        });
    }

    return googleEvent;
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
