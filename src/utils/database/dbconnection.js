const { Connection } = require('tedious');
const { encrypt, trustServerCertificate } = require('../../config/config');

function createConnection() {
  const config = {
    server: `${process.env.DB_SERVER}`,
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
    },
    options: {
      encrypt: true,
      database: process.env.DB_DATABASE,
      trustServerCertificate: true,
      port: 1433
    }
  };
  
  const connection = new Connection(config);
  return connection;
}

module.exports = { createConnection };
