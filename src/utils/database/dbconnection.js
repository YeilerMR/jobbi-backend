// FOR MySQL Connection

const mysql = require('mysql2/promise'); // ✅ THIS is the correct import

async function createConnection() {
  return await mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    ssl: false,
  });
}

module.exports = { createConnection };


// // FOR SQL SERVER Connection
// const { Connection } = require('tedious');
// const { encrypt, trustServerCertificate } = require('../../config/config');
// function createConnection() {
//   const config = {
//     server: `${process.env.DB_SERVER}`,
//     authentication: {
//       type: 'default',
//       options: {
//         userName: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//       }
//     },
//     options: {
//       encrypt: true,
//       database: process.env.DB_DATABASE,
//       trustServerCertificate: true,
//       port: 1433
//     }
//   };
  
//   const connection = new Connection(config);
//   return connection;
// }