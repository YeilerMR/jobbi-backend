const express = require('express');
const router = express.Router();
const notifications = require('./notifications.service');
const verifyToken = require('../../utils/services/verifyToken');
const { createConnection } = require('../../utils/database/dbconnection');

async function existsActive(table, idField, idValue, stateField) {
  const conn = await createConnection();
  try {
    let sql = `SELECT 1 FROM ${table} WHERE ${idField} = ?`;
    const params = [idValue];
    if (stateField) {
      sql += ` AND ${stateField} = 1`;
    }
    const [rows] = await conn.execute(sql, params);
    return rows.length > 0;
  } finally {
    await conn.end();
  }
}

async function validateIds({ id_client, id_branch, id_service, id_employee = null }) {
  const errors = [];
  // User must exist and be active
  if (!(await existsActive('User', 'id_user', id_client, 'state_user'))) {
    errors.push(`id_client no existe o no está activo: ${id_client}`);
  }
  // Branch must exist and be active
  if (!(await existsActive('Branch', 'id_branch', id_branch, 'state_branch'))) {
    errors.push(`id_branch no existe o no está activo: ${id_branch}`);
  }
  // Service must exist and be active and belong to the branch
  {
    const conn = await createConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT 1 FROM Service WHERE id_service = ? AND id_branch = ? AND state_service = 1`,
        [id_service, id_branch]
      );
      if (rows.length === 0) {
        errors.push(`id_service no existe/activo o no pertenece a la branch ${id_branch}: ${id_service}`);
      }
    } finally {
      await conn.end();
    }
  }
  // If employee provided, must exist and belong to branch
  if (id_employee != null) {
    const conn = await createConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT 1 FROM Employee WHERE id_employee = ? AND id_branch = ?`,
        [id_employee, id_branch]
      );
      if (rows.length === 0) {
        errors.push(`id_employee no existe o no pertenece a la branch ${id_branch}: ${id_employee}`);
      }
    } finally {
      await conn.end();
    }
  }
  return errors;
}

// Enqueue appointment request (admin or business only)
router.post('/appointment-request', verifyToken(), (req, res) => {
  try {
    // Allow admin (id_rol=1) or business (id_rol=2); adjust to your model
    if (!req.user || (req.user.id_rol !== 1 && req.user.id_rol !== 2)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const {
      id_client, id_branch, id_employee = null, id_service,
      appointment_date, appointment_time
    } = req.body || {};

    const errors = [];
    if (!id_client) errors.push('id_client is required');
    if (!id_branch) errors.push('id_branch is required');
    if (!id_service) errors.push('id_service is required');
    if (!appointment_date) errors.push('appointment_date is required (YYYY-MM-DD)');
    if (!appointment_time) errors.push('appointment_time is required (HH:MM:SS)');

    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    // Validación fuerte contra la base de datos
    validateIds({ id_client, id_branch, id_service, id_employee }).then((dbErrors) => {
      if (dbErrors.length) {
        return res.status(404).json({ success: false, message: 'Invalid IDs', errors: dbErrors });
      }
      const notif = notifications.push({
        type: 'appointment_request',
        title: 'New appointment request',
        message: `Client ${id_client} requested an appointment`,
        payload: { id_client, id_branch, id_employee, id_service, appointment_date, appointment_time }
      });
      return res.status(201).json({ success: true, message: 'Notification enqueued', data: notif, pending: notifications.count() });
    }).catch((err) => {
      console.error('DB validation error:', err);
      return res.status(500).json({ success: false, message: 'Error validating IDs' });
    });
  } catch (err) {
    console.error('POST /notifications/appointment-request error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Query pending notifications (useful if a UI does not use sockets)
router.get('/pending', verifyToken(), (_req, res) => {
  // Only admin can view all; businesses could view own (adjust if ownership exists)
  if (!_req.user || _req.user.id_rol !== 1) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  return res.json({ success: true, total: notifications.count(), items: notifications.all() });
});

module.exports = router;
