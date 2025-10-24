const { EventEmitter } = require('events');

const bus = new EventEmitter();
const stack = []; // LIFO
const MAX_STACK = 1000;

function escapeStr(str = '') {
  return String(str).replace(/[<>&"'`]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;', '`': '&#96;'
  }[c]));
}

function sanitizeNotification(n) {
  return {
  type: escapeStr(n.type || 'appointment_request'),
  title: escapeStr(n.title || 'New appointment request'),
    message: escapeStr(n.message || ''),
    payload: {
      id_client: Number(n.payload?.id_client) || null,
      id_branch: Number(n.payload?.id_branch) || null,
      id_employee: n.payload?.id_employee != null ? Number(n.payload.id_employee) : null,
      id_service: Number(n.payload?.id_service) || null,
      appointment_date: escapeStr(n.payload?.appointment_date || ''),
      appointment_time: escapeStr(n.payload?.appointment_time || ''),
    },
    created_at: new Date().toISOString(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

function count() { return stack.length; }
function all() { return [...stack].reverse(); }
function peek() { return stack[stack.length - 1] || null; }

function push(notification) {
  const clean = sanitizeNotification(notification);
  stack.push(clean);
  if (stack.length > MAX_STACK) stack.shift();
  bus.emit('new-notification', clean, count());
  return clean;
}

function pop() {
  const item = stack.pop() || null;
  if (item) bus.emit('pop-notification', item, count());
  return item;
}

function clear() { stack.length = 0; bus.emit('cleared'); }

module.exports = { bus, push, pop, peek, all, count, clear };
