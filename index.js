const config = require('./src/config/config'); // Load environment variables
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import and use routes from the auth module
const authRoutes = require('./src/modules/auth/auth.routes');
const businessRoutes = require('./src/modules/business/business.routes');
const serviceRoutes = require('./src/modules/service/service.routes');
const branchRoutes = require('./src/modules/branch/branch.routes');
const specialtysRoutes = require('./src/modules/specialtys/specialtys.routes');
const invitationRoutes = require('./src/modules/invitation/invitation.routes');
const notificationsRoutes = require('./src/modules/notifications/notifications.routes');


// --------------------------------------
// ----------- AUTH ROUTES --------------
// --------------------------------------
app.use('/auth', authRoutes);

// --------------------------------------
// ----------- BUSINESS ROUTES ----------
// --------------------------------------
app.use('/business', businessRoutes);

// --------------------------------------
// ----------- SERVICES ROUTES ----------
// --------------------------------------
app.use('/services', serviceRoutes);

// --------------------------------------
// ----------- BRANCH ROUTES ------------
// --------------------------------------
app.use('/branches', branchRoutes);

// ------------------------------
// ---- SPECIALTYS ROUTES -------
// ------------------------------
app.use('/specialtys', specialtysRoutes);

// --------------------------------------
// ----------- INVITATIONS ROUTES -------
// --------------------------------------
app.use('/invitations', invitationRoutes);
// ------------------------------
// ---- NOTIFICATIONS ROUTES ----
// ------------------------------
app.use('/notifications', notificationsRoutes);

app.get('/', (req, res) => {
  res.send('Jobbi desde Express!');
});

// Crear HTTP server para integrar Socket.IO
const http = require('http');
const server = http.createServer(app);

// Inicializar gateway de notificaciones (Socket.IO)
const { init } = require('./src/modules/notifications/notifications.gateway');
init(server);

server.listen(config.bknd_port, () => {
  console.log(`Server listening at http://localhost:${config.bknd_port}`);
});
