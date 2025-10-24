const service = require('./appointments.service');

exports.createAppointment = async (req, res) => {
  try {
    const result = await service.createAppointment(req.body || {}, req.user || null);
    return res.status(201).json({ success: true, message: 'Appointment created', data: result });
  } catch (err) {
    const status = err?.status || 500;
    return res.status(status).json({ success: false, message: err?.message || 'Server error', errors: err?.errors });
  }
};

exports.listAppointments = async (req, res) => {
  try {
    const data = await service.listAppointments(req.query || {});
    return res.json({ success: true, ...data });
  } catch (err) {
    const status = err?.status || 500;
    return res.status(status).json({ success: false, message: err?.message || 'Server error' });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await service.getAppointmentById(id);
    return res.json({ success: true, data });
  } catch (err) {
    const status = err?.status || 500;
    return res.status(status).json({ success: false, message: err?.message || 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    const data = await service.updateStatus(id, status);
    return res.json({ success: true, message: 'Status updated', data });
  } catch (err) {
    const status = err?.status || 500;
    return res.status(status).json({ success: false, message: err?.message || 'Server error', errors: err?.errors });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { appointment_date, appointment_time } = req.body || {};
    const data = await service.rescheduleAppointment(id, appointment_date, appointment_time);
    return res.json({ success: true, message: 'Appointment rescheduled', data });
  } catch (err) {
    const status = err?.status || 500;
    return res.status(status).json({ success: false, message: err?.message || 'Server error', errors: err?.errors });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await service.cancelAppointment(id);
    return res.json({ success: true, message: 'Appointment cancelled', data });
  } catch (err) {
    const status = err?.status || 500;
    return res.status(status).json({ success: false, message: err?.message || 'Server error' });
  }
};
