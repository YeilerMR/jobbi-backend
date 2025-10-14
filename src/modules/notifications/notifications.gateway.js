const { Server } = require('socket.io');
const notifications = require('./notifications.service');

let io;

function init(server) {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.of('/admin-notifications').on('connection', (socket) => {
    const role = socket.handshake.auth?.role || socket.handshake.query?.role;
    if (String(role || '').toLowerCase() !== 'admin') {
      socket.emit('error', 'Unauthorized');
      return socket.disconnect(true);
    }

    // Send initial bootstrap state (current stack)
    socket.emit('bootstrap', { total: notifications.count(), items: notifications.all() });

    socket.on('pop', () => {
      const item = notifications.pop();
      socket.emit('popped', item);
      socket.broadcast.emit('popped', item);
      const c = notifications.count();
      socket.emit('count', c);
      socket.broadcast.emit('count', c);
    });
  });

  notifications.bus.on('new-notification', (n, total) => {
    io.of('/admin-notifications').emit('new', n);
    io.of('/admin-notifications').emit('count', total);
  });

  notifications.bus.on('pop-notification', (_n, total) => {
    io.of('/admin-notifications').emit('count', total);
  });

  notifications.bus.on('cleared', () => {
    io.of('/admin-notifications').emit('cleared');
    io.of('/admin-notifications').emit('count', 0);
  });

  return io;
}

module.exports = { init };
