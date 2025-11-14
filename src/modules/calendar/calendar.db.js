const { createConnection } = require('../../utils/database/dbconnection');
const { DateTime } = require("luxon");

exports.createEvent = async (id_employee, event) => {
    const conn = await createConnection();
    try {
        const [result] = await conn.execute(
            `INSERT INTO booked_events 
             (id_employee, id_branch, id_client, title, start, end, type, recurrence, google_event_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_employee,
                event.id_branch,
                event.id_client,
                event.title,
                event.start,
                event.end,
                event.type || 'client',
                event.recurrence ? JSON.stringify(event.recurrence) : null,
                event.google_event_id
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


// Inserts default calendar configuration for an employee
exports.createDefaultCalendarForEmployee = async (id_employee) => {
    // Default values for a brand-new business
    const DEFAULT_CONFIG = {
        slot_duration_minutes: 30,
        buffer_between_bookings_minutes: 15,
        booking_window_days: 30,
        min_booking_duration_slots: 1,
        max_booking_duration_slots: 4
    };

    const conn = await createConnection();
    // Insert into calendar_config
    await conn.query(
        `
      INSERT INTO calendar_config 
      (id_employee, slot_duration_minutes, buffer_between_bookings_minutes,
       booking_window_days, min_booking_duration_slots, max_booking_duration_slots)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        [
            id_employee,
            DEFAULT_CONFIG.slot_duration_minutes,
            DEFAULT_CONFIG.buffer_between_bookings_minutes,
            DEFAULT_CONFIG.booking_window_days,
            DEFAULT_CONFIG.min_booking_duration_slots,
            DEFAULT_CONFIG.max_booking_duration_slots
        ]
    );

    // Insert default working hours (Mon–Fri, 09:00–17:00)
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const WORKING_HOURS = JSON.stringify({ available: ["09:00-17:00"] });

    for (const day of DAYS) {
        await conn.query(
            `
        INSERT INTO working_hours (id_employee, day_of_week, time_ranges)
        VALUES (?, ?, ?)
      `,
            [id_employee, day, WORKING_HOURS]
        );
    }

    return { success: true };
};

exports.getMyCalendarEmpDB = async (id_employee) => {
    const conn = await createConnection();
    try {
        // Employee data
        const [employeeRows] = await conn.execute(
            `
            SELECT 
                be.id AS id_book_event,
                be.title AS event_name,
                CONCAT(cu.name, ' ', cu.last_name) AS client_name,
                b.location AS branch_location,
                CONCAT(eu.name, ' ', eu.last_name) AS employee_name,
                be.start AS start_datetime,
                be.end AS end_datetime,
                TIMESTAMPDIFF(MINUTE, be.start, be.end) AS duration_minutes,
                s.price AS service_price
            FROM booked_events be
            LEFT JOIN User cu ON cu.id_user = be.id_client
            LEFT JOIN Employee e ON e.id_employee = be.id_employee
            LEFT JOIN User eu ON eu.id_user = e.id_user
            LEFT JOIN Branch b ON b.id_branch = be.id_branch
            LEFT JOIN Service s 
                ON s.name = be.title 
                AND s.id_branch = be.id_branch
            WHERE cu.id_user = ?;
            `,
            [id_employee]
        );
        if (!employeeRows.length) throw new Error("Employee not found");
        const employee = employeeRows[0];


        return {
            employeeRows
        };
    } finally {
        await conn.end();
    }
};

exports.getMyCalendarCliDB = async (id_client) => {
    const conn = await createConnection();
    try {
        // Employee data
        const [clientRows] = await conn.execute(
            `
            SELECT 
                be.id AS id_book_event,
                be.title AS event_name,
                CONCAT(cu.name, ' ', cu.last_name) AS client_name,
                b.location AS branch_location,
                CONCAT(eu.name, ' ', eu.last_name) AS employee_name,
                be.start AS start_datetime,
                be.end AS end_datetime,
                TIMESTAMPDIFF(MINUTE, be.start, be.end) AS duration_minutes,
                s.price AS service_price
            FROM booked_events be
            LEFT JOIN User cu ON cu.id_user = be.id_client
            LEFT JOIN Employee e ON e.id_employee = be.id_employee
            LEFT JOIN User eu ON eu.id_user = e.id_user
            LEFT JOIN Branch b ON b.id_branch = be.id_branch
            LEFT JOIN Service s 
                ON s.name = be.title
                AND s.id_branch = be.id_branch
            WHERE be.id_client = ?;
            `,
            [id_client]
        );
        if (!clientRows.length) throw new Error("Client not found");
        const employee = clientRows[0];


        return {
            clientRows
        };
    } finally {
        await conn.end();
    }
};