class Appointment {
  constructor({
    id_book_appointment,
    id_client,
    id_branch,
    id_employee = null,
    id_service,
    appointment_date,
    appointment_time,
    state_appointment
  }) {
    this.id_book_appointment = id_book_appointment;
    this.id_client = id_client;
    this.id_branch = id_branch;
    this.id_employee = id_employee;
    this.id_service = id_service;
    this.appointment_date = appointment_date;
    this.appointment_time = appointment_time;
    this.state_appointment = state_appointment; // numeric code (0..4)
  }
}

// Optional helper to map numeric state to readable string
const STATUS_MAP = {
  0: 'pending',
  1: 'confirmed',
  2: 'rejected',
  3: 'rescheduled',
  4: 'cancelled',
};

function statusToString(state_appointment) {
  return STATUS_MAP[state_appointment] ?? 'unknown';
}

module.exports = { Appointment, statusToString, STATUS_MAP };
