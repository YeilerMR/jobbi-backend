const config = require('./src/config/config'); // Load environment variables
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Import and use routes from the auth module
const authRoutes = require('./src/modules/auth/auth.routes');



app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Jobbi desde Express!');
});

app.listen(config.bknd_port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.bknd_port}`);
});
