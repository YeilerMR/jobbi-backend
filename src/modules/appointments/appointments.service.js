const {
  STATUS,
  ensureUserActive,
  ensureBranchActive,
  ensureServiceActiveInBranch,
  ensureEmployeeInBranch,
  existsEmployeeConflict,
  createAppointment: dbCreate,
  listAppointments: dbList,
  getAppointmentById: dbGetById,
  updateAppointmentStatus: dbUpdateStatus,
  rescheduleAppointment: dbReschedule,
} = require('./appointments.db');

const notifications = require('../notifications/notifications.service');
const { Appointment, statusToString } = require('./appointments.model');

const ALLOWED_STATUSES = Object.keys(STATUS); // ['pending','confirmed','rejected','rescheduled','cancelled']

function isValidDate(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d); }
function isValidTime(t) { return /^\d{2}:\d{2}(:\d{2})?$/.test(t); }

exports.createAppointment = async (payload, userFromToken) => {
  const errors = [];
  const id_client = Number(payload.id_client || userFromToken?.id_user || 0) || null;
  const id_branch = Number(payload.id_branch || 0) || null;
  const id_service = Number(payload.id_service || 0) || null;
  const id_employee = Number(payload.id_employee || 0) || null;
  let appointment_date = payload.appointment_date || '';
  let appointment_time = payload.appointment_time || '';

  if (!id_client) errors.push('id_client is required');
  if (!id_branch) errors.push('id_branch is required');
  if (!id_service) errors.push('id_service is required');
  if (!appointment_date) errors.push('appointment_date is required (YYYY-MM-DD)');
  if (!appointment_time) errors.push('appointment_time is required (HH:MM[:SS])');
  if (!id_employee) errors.push('id_employee is required');

  if (appointment_date && !isValidDate(appointment_date)) errors.push('appointment_date must be YYYY-MM-DD');
  if (appointment_time && !isValidTime(appointment_time)) errors.push('appointment_time must be HH:MM[:SS]');
  if (appointment_time && appointment_time.length === 5) appointment_time += ':00';

  if (errors.length) throw { status: 400, message: 'Validation failed', errors };

  const user = await ensureUserActive(id_client);
  if (!user) throw { status: 404, message: 'Invalid IDs', errors: [`id_client not found/active: ${id_client}`] };

  const branch = await ensureBranchActive(id_branch);
  if (!branch) throw { status: 404, message: 'Invalid IDs', errors: [`id_branch not found/active: ${id_branch}`] };

  const service = await ensureServiceActiveInBranch(id_service, id_branch);
  if (!service) throw { status: 404, message: 'Invalid IDs', errors: [`id_service not found/active in branch ${id_branch}: ${id_service}`] };

  // Employee must belong to branch and be free at that time
  const employee = await ensureEmployeeInBranch(id_employee, id_branch);
  if (!employee) throw { status: 404, message: 'Invalid IDs', errors: [`id_employee not found in branch ${id_branch}: ${id_employee}`] };

  const conflict = await existsEmployeeConflict(id_employee, appointment_date, appointment_time);
  if (conflict) throw { status: 409, message: 'Time conflict', errors: ['Employee already has an appointment at that time'] };

  const inserted = await dbCreate({ id_client, id_branch, id_employee, id_service, appointment_date, appointment_time });

  // Load and return full Appointment object
  const created = await dbGetById(inserted.insertId);
  const createdObj = new Appointment(created);

  try {
    notifications.push({
      type: 'appointment_request',
      title: 'New appointment request',
      message: `Client ${id_client} requested an appointment`,
      payload: { id_client, id_branch, id_service, appointment_date, appointment_time }
    });
  } catch (e) { /* ignore notification failures */ }

  return { insertId: inserted.insertId, appointment: { ...createdObj, status_text: statusToString(createdObj.state_appointment) } };
};

exports.listAppointments = async (filters) => {
  const parsed = {
    id_client: filters.id_client ? Number(filters.id_client) : undefined,
    id_branch: filters.id_branch ? Number(filters.id_branch) : undefined,
    id_employee: filters.id_employee ? Number(filters.id_employee) : undefined,
    date: filters.date || undefined,
    state_appointment: typeof filters.status === 'string' && STATUS[filters.status] !== undefined ? STATUS[filters.status] : (typeof filters.status === 'number' ? filters.status : undefined),
    limit: filters.limit ? Math.min(Number(filters.limit), 100) : 50,
    offset: filters.offset ? Number(filters.offset) : 0,
  };
  const result = await dbList(parsed);
  const mapped = result.rows.map(r => {
    const a = new Appointment(r);
    return { ...a, status_text: statusToString(a.state_appointment) };
  });
  return { rows: mapped, total: result.total };
};

exports.getAppointmentById = async (id) => {
  if (!id) throw { status: 400, message: 'id is required' };
  const row = await dbGetById(id);
  if (!row) throw { status: 404, message: 'Appointment not found' };
  const a = new Appointment(row);
  return { ...a, status_text: statusToString(a.state_appointment) };
};

exports.updateStatus = async (id, status) => {
  if (!id) throw { status: 400, message: 'id is required' };
  if (!status) throw { status: 400, message: 'status is required' };
  const normalized = String(status).toLowerCase();
  if (!ALLOWED_STATUSES.includes(normalized)) throw { status: 400, message: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` };

  const state_code = STATUS[normalized];
  const existing = await dbGetById(id);
  if (!existing) throw { status: 404, message: 'Appointment not found' };

  await dbUpdateStatus(id, state_code);
  const updated = await dbGetById(id);
  const obj = new Appointment(updated);
  return { appointment: { ...obj, status_text: statusToString(obj.state_appointment) } };
};

exports.rescheduleAppointment = async (id, appointment_date, appointment_time) => {
  const errors = [];
  if (!id) errors.push('id is required');
  if (!appointment_date) errors.push('appointment_date is required (YYYY-MM-DD)');
  if (!appointment_time) errors.push('appointment_time is required (HH:MM[:SS])');
  if (appointment_date && !isValidDate(appointment_date)) errors.push('appointment_date must be YYYY-MM-DD');
  if (appointment_time && !isValidTime(appointment_time)) errors.push('appointment_time must be HH:MM[:SS]');
  if (appointment_time && appointment_time.length === 5) appointment_time += ':00';
  if (errors.length) throw { status: 400, message: 'Validation failed', errors };

  const existing = await dbGetById(id);
  if (!existing) throw { status: 404, message: 'Appointment not found' };

  if (existing.id_employee) {
    const conflict = await existsEmployeeConflict(existing.id_employee, appointment_date, appointment_time, id);
    if (conflict) throw { status: 409, message: 'Time conflict', errors: ['Employee already has an appointment at that time'] };
  }

  await dbReschedule(id, appointment_date, appointment_time);
  const updated = await dbGetById(id);
  const obj = new Appointment(updated);
  return { appointment: { ...obj, status_text: statusToString(obj.state_appointment) } };
};

exports.cancelAppointment = async (id) => {
  if (!id) throw { status: 400, message: 'id is required' };
  const existing = await dbGetById(id);
  if (!existing) throw { status: 404, message: 'Appointment not found' };
  await dbUpdateStatus(id, STATUS.cancelled);
  const updated = await dbGetById(id);
  const obj = new Appointment(updated);
  return { appointment: { ...obj, status_text: statusToString(obj.state_appointment) } };
};
