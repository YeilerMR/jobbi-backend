const { createConnection } = require('../../utils/database/dbconnection');


exports.getCalendarDB = async (id_employee) => {
    const conn = await createConnection();
    try {
        // Employee basic data
        const [employeeRows] = await conn.execute(
            'SELECT id_employee, id_branch, id_user, availability FROM Employee WHERE id_employee = ?',
            [id_employee]
        );
        if (!employeeRows.length) throw new Error('Employee not found');
        const employee = employeeRows[0];

        // Config
        const [configRows] = await conn.execute(
            'SELECT slot_duration_minutes, buffer_between_bookings_minutes, booking_window_days, min_booking_duration_slots, max_booking_duration_slots FROM calendar_config WHERE id_employee = ?',
            [id_employee]
        );
        const config = configRows[0] || {};

        // Working hours
        const [whRows] = await conn.execute(
            'SELECT day_of_week, time_ranges FROM working_hours WHERE id_employee = ?',
            [id_employee]
        );
        const workingHours = whRows.reduce((acc, wh) => {
            acc[wh.day_of_week] = JSON.parse(wh.time_ranges);
            return acc;
        }, {});

        // Exceptions
        const [exceptionsRows] = await conn.execute(
            'SELECT date, type, note FROM exceptions WHERE id_employee = ?',
            [id_employee]
        );

        // Booked events
        const [bookedEventsRows] = await conn.execute(
            'SELECT * FROM booked_events WHERE id_employee = ?',
            [id_employee]
        );

        return {
            employee,
            config,
            workingHours,
            exceptions: exceptionsRows,
            bookedEvents: bookedEventsRows
        };
    } finally {
        await conn.end();
    }
};

exports.createEventDB = async (id_employee, event) => {
    const conn = await createConnection();
    try {
        await conn.execute(
            `INSERT INTO booked_events (id_employee, title, start, end, type, recurrence) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                id_employee,
                event.title,
                event.start,
                event.end,
                event.type || 'other',
                event.recurrence ? JSON.stringify(event.recurrence) : null
            ]
        );
    } finally {
        await conn.end();
    }
};

exports.updateEventDB = async (id_employee, id, event) => {
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

exports.deleteEventDB = async (id_employee, id) => {
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

  const slotDuration = calendar.config.slot_duration_minutes || 30;
  const buffer = calendar.config.buffer_between_bookings_minutes || 15;

  const dayOfWeek = new Date(date).getDay(); // 0=Sunday, 1=Monday...
  const workingHours = calendar.workingHours[dayOfWeek] || [];

  const slots = [];

  workingHours.forEach(range => {
    const [startTime, endTime] = range.split('-');
    let current = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    while (current < end) {
      const slotEnd = new Date(current.getTime() + slotDuration * 60000);

      let status = 'available';
      const bookedEvent = calendar.bookedEvents.find(ev =>
        new Date(ev.start) < slotEnd && new Date(ev.end) > current
      );
      if (bookedEvent) status = 'booked';

      slots.push({
        start: current.toISOString(),
        end: slotEnd.toISOString(),
        status,
        eventId: bookedEvent ? bookedEvent.id_event : null
      });

      current = new Date(slotEnd.getTime() + buffer * 60000);
    }
  });

  return { date, generatedAt: new Date().toISOString(), slots };
};
