const { createConnection } = require('../../utils/database/dbconnection');

// Status mapping in DB (int)
// 0=pending, 1=confirmed, 2=rejected, 3=rescheduled, 4=cancelled
const STATUS = { pending: 0, confirmed: 1, rejected: 2, rescheduled: 3, cancelled: 4 };

async function ensureUserActive(id_user) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_user FROM `User` WHERE id_user = ? AND state_user = 1 LIMIT 1',
      [id_user]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

async function ensureBranchActive(id_branch) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_branch FROM `Branch` WHERE id_branch = ? AND state_branch = 1 LIMIT 1',
      [id_branch]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

async function ensureServiceActiveInBranch(id_service, id_branch) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_service FROM `Service` WHERE id_service = ? AND id_branch = ? AND state_service = 1 LIMIT 1',
      [id_service, id_branch]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

async function ensureEmployeeInBranch(id_employee, id_branch) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_employee FROM `Employee` WHERE id_employee = ? AND id_branch = ? LIMIT 1',
      [id_employee, id_branch]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

async function existsEmployeeConflict(id_employee, appointment_date, appointment_time, excludeId = null) {
  if (!id_employee) return false;
  const conn = await createConnection();
  try {
    let sql =
      'SELECT 1 FROM `BookAppointment` WHERE id_employee = ? AND appointment_date = ? AND appointment_time = ? AND state_appointment IN (0,1,3)';
    const args = [id_employee, appointment_date, appointment_time];
    if (excludeId) {
      sql += ' AND id_book_appointment <> ?';
      args.push(excludeId);
    }
    sql += ' LIMIT 1';
    const [rows] = await conn.execute(sql, args);
    return rows.length > 0;
  } finally {
    await conn.end();
  }
}

async function createAppointment(a) {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute(
      'INSERT INTO `BookAppointment` (id_client, id_branch, id_employee, id_service, appointment_date, appointment_time, state_appointment) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [a.id_client, a.id_branch, a.id_employee, a.id_service, a.appointment_date, a.appointment_time, STATUS.pending]
    );
    return { insertId: result.insertId };
  } finally {
    await conn.end();
  }
}

async function listAppointments(filters) {
  const conn = await createConnection();
  try {
    const where = [];
    const args = [];
    if (filters.id_client) { where.push('id_client = ?'); args.push(filters.id_client); }
    if (filters.id_branch) { where.push('id_branch = ?'); args.push(filters.id_branch); }
    if (filters.id_employee) { where.push('id_employee = ?'); args.push(filters.id_employee); }
    if (filters.date) { where.push('appointment_date = ?'); args.push(filters.date); }
    if (typeof filters.state_appointment === 'number') { where.push('state_appointment = ?'); args.push(filters.state_appointment); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const limit = Number(filters.limit) || 50;
    const offset = Number(filters.offset) || 0;

    const [rows] = await conn.execute(
      `SELECT id_book_appointment, id_client, id_branch, id_employee, id_service, appointment_date, appointment_time, state_appointment
       FROM \`BookAppointment\` ${whereSql}
       ORDER BY appointment_date DESC, appointment_time DESC
       LIMIT ? OFFSET ?`,
      [...args, limit, offset]
    );

    const [[countRow]] = await conn.execute(
      `SELECT COUNT(*) AS total FROM \`BookAppointment\` ${whereSql}`,
      args
    );

    return { rows, total: Number(countRow.total) };
  } finally {
    await conn.end();
  }
}

async function getAppointmentById(id) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_book_appointment, id_client, id_branch, id_employee, id_service, appointment_date, appointment_time, state_appointment FROM `BookAppointment` WHERE id_book_appointment = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

async function updateAppointmentStatus(id, state_code) {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute(
      'UPDATE `BookAppointment` SET state_appointment = ? WHERE id_book_appointment = ?',
      [state_code, id]
    );
    return { affectedRows: result.affectedRows, state_appointment: state_code };
  } finally {
    await conn.end();
  }
}

async function rescheduleAppointment(id, appointment_date, appointment_time) {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute(
      "UPDATE `BookAppointment` SET appointment_date = ?, appointment_time = ?, state_appointment = ? WHERE id_book_appointment = ?",
      [appointment_date, appointment_time, STATUS.rescheduled, id]
    );
    return { affectedRows: result.affectedRows, appointment_date, appointment_time, state_appointment: STATUS.rescheduled };
  } finally {
    await conn.end();
  }
}

module.exports = {
  STATUS,
  ensureUserActive,
  ensureBranchActive,
  ensureServiceActiveInBranch,
  ensureEmployeeInBranch,
  existsEmployeeConflict,
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
};
