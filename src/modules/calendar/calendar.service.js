// services/calendar.service.js
const { google } = require('googleapis');

exports.listEvents = async(auth) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return res.data.items || [];
}

exports.createEvent = async(auth, data) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
        summary: data.summary,
        location: data.location,
        description: data.description,
        start: {
            dateTime: data.start,
            timeZone: 'America/Costa_Rica'
        },
        end: {
            dateTime: data.end,
            timeZone: 'America/Costa_Rica'
        },
        attendees: [
            { email: data.client.email },
            { email: data.business.email },
            { email: data.employee.email }
        ],
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 }
            ]
        }
    };

    const res = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    return res.data;
}

exports.updateEvent = async(auth, eventId, data) => {
    const calendar = google.calendar({ version: 'v3', auth });

    const updatedEvent = {
        summary: data.summary,
        location: data.location,
        description: data.description,
        start: {
            dateTime: data.start,
            timeZone: 'America/Costa_Rica'
        },
        end: {
            dateTime: data.end,
            timeZone: 'America/Costa_Rica'
        },
        attendees: [
            { email: data.client.email },
            { email: data.business.email },
            { email: data.employee.email }
        ],
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 }
            ]
        }
    };

    const res = await calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: updatedEvent
    });

    return res.data;
}

exports.deleteEvent = async(auth, eventId) => {
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({
        calendarId: 'primary',
        eventId
    });
}
