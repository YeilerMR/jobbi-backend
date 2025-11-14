const { createConnection } = require('../../utils/database/dbconnection');
const { DateTime } = require("luxon");

exports.createEvent = async (id_employee, event) => {
    const conn = await createConnection();
    try {
        const [result] = await conn.execute(
            `INSERT INTO booked_events 
             (id_employee, title, start, end, type, recurrence, google_event_id, id_client, id_branch)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_employee,
                event.title,
                event.start,
                event.end,
                event.type || 'other',
                event.recurrence ? JSON.stringify(event.recurrence) : null,
                event.google_event_id,
                event.id_client,
                event.id_branch
            ]
        );

        return { id: result.insertId, ...event };
    } finally {
        await conn.end();
    }
};

exports.updateEvent = async (id_employee, id, event) => {
    const conn = await createConnection();
    try {
        await conn.execute(
            `UPDATE booked_events SET title=?, start=?, end=?, type=?, recurrence=? WHERE id=? AND id_employee=?`,
            [
                event.title,
                event.start,
                event.end,
                event.type,
                event.recurrence ? JSON.stringify(event.recurrence) : null,
                id,
                id_employee
            ]
        );
    } finally {
        await conn.end();
    }
};

exports.deleteEvent = async (id_employee, id) => {
    const conn = await createConnection();
    try {
        await conn.execute(
            'DELETE FROM booked_events WHERE id=? AND id_employee=?',
            [id, id_employee]
        );
    } finally {
        await conn.end();
    }
};



exports.generateAvailability = async (id_employee, date) => {
    const calendar = await exports.getCalendarDB(id_employee);
    const { slot_duration_minutes: slotDuration = 30, buffer_between_bookings_minutes: buffer = 15 } = calendar.config;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[new Date(date).getDay()];

    // Check for exceptions
    // const isException = calendar.exceptions.some(e => e.date.toISOString().split("T")[0] === date);
    // if (isException) {
    //     return { date, slots: [], message: "Unavailable due to exception/holiday" };
    // }

    // Get working hours for the day
    const workingDay = calendar.workingHours[dayName];
    if (!workingDay || !workingDay.available?.length) {
        return { date, slots: [], message: "No working hours defined for this day" };
    }

    const availableRanges = workingDay.available || [];
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    // Filter booked events for the day
    const bookedEvents = calendar.bookedEvents.filter(ev => {
        const start = new Date(ev.start);
        return start >= dayStart && start <= dayEnd;
    });

    const slots = [];
    const tz = "America/Costa_Rica"; // adjust or fetch from employee if stored

    for (const range of availableRanges) {
        const [startTime, endTime] = range.split("-");
        let current = DateTime.fromISO(`${date}T${startTime}`, { zone: tz });
        const end = DateTime.fromISO(`${date}T${endTime}`, { zone: tz });

        while (current < end) {
            const slotEnd = current.plus({ minutes: slotDuration });

            const overlap = bookedEvents.find(ev => {
                const evStart = DateTime.fromISO(ev.start, { zone: tz });
                const evEnd = DateTime.fromISO(ev.end, { zone: tz });
                return evStart < slotEnd && evEnd > current;
            });

            const status = overlap ? "booked" : "available";

            slots.push({
                start: current.toISO(),
                end: slotEnd.toISO(),
                status,
                eventId: overlap ? overlap.id : null,
            });

            // Move to next slot respecting buffer and booking overlaps
            if (overlap) {
                current = DateTime.fromISO(overlap.end, { zone: tz }).plus({ minutes: buffer });
            } else {
                current = slotEnd.plus({ minutes: buffer });
            }
        }
    }

    return {
        employee: calendar.employee,
        config: calendar.config,
        date,
        // exceptions: calendar.exceptions,
        generatedAt: new Date().toISOString(),
        slots,
    };
};

exports.getCalendarDB = async (id_employee) => {
    const conn = await createConnection();
    try {
        // Employee data
        const [employeeRows] = await conn.execute(
            "SELECT id_employee, id_branch, id_user, availability FROM Employee WHERE id_employee = ?",
            [id_employee]
        );
        if (!employeeRows.length) throw new Error("Employee not found");
        const employee = employeeRows[0];

        // Config
        const [configRows] = await conn.execute(
            "SELECT slot_duration_minutes, buffer_between_bookings_minutes, booking_window_days, min_booking_duration_slots, max_booking_duration_slots FROM calendar_config WHERE id_employee = ?",
            [id_employee]
        );
        const config = configRows[0] || {};

        // Working hours
        const [whRows] = await conn.execute(
            "SELECT day_of_week, time_ranges FROM working_hours WHERE id_employee = ?",
            [id_employee]
        );
        const workingHours = whRows.reduce((acc, wh) => {
            acc[wh.day_of_week] = JSON.parse(wh.time_ranges);
            return acc;
        }, {});

        // Exceptions
        // const [exceptionsRows] = await conn.execute(
        //     "SELECT date, type, note FROM exceptions WHERE id_employee = ?",
        //     [id_employee]
        // );

        // Booked events
        const [bookedEventsRows] = await conn.execute(
            "SELECT * FROM booked_events WHERE id_employee = ?",
            [id_employee]
        );

        return {
            employee,
            config,
            workingHours,
            // exceptions: exceptionsRows,
            bookedEvents: bookedEventsRows,
        };
    } finally {
        await conn.end();
    }
};
