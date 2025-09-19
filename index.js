const config = require('./src/config/config'); // Load environment variables
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import and use routes from the auth module
const authRoutes = require('./src/modules/auth/auth.routes');
const businessRoutes = require('./src/modules/business/business.routes');
const serviceRoutes = require('./src/modules/service/service.routes');


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

app.get('/', (req, res) => {
  res.send('Jobbi desde Express!');
});

app.listen(config.bknd_port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.bknd_port}`);
});
