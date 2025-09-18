const { Request, TYPES } = require('tedious');
const { createConnection } = require('../../utils/database/dbconnection');

async function loginUser(email, password, callback) {
  try {
    const connection = await createConnection();

    const [rows, fields] = await connection.execute(
      'SELECT * FROM USERS WHERE email = ? AND password = ?',
      [email, password]
    );

    await connection.end();

    if (rows.length === 0) {
      return callback(null, null); // No user found
    }

    return callback(null, rows[0]);

  } catch (err) {
    console.error('❌ Login error:', err.message);
    return callback(err);
  }
}

module.exports = { loginUser };


// SQL Server | El método anterior por aquello

// function loginUser(email, password, callback) {
//   const connection = createConnection();

//   connection.on('connect', (err) => {
//     if (err) {
//       console.error('Connection error:', err);
//       connection.close();
//       return callback(err);
//     }

//     const query = `SELECT * FROM [dbo].[USERS] WHERE email = @email AND password = @password`;
//     const request = new Request(query, (err, rowCount) => {
//       if (err) {
//         console.error('SQL error during login:', err);
//         connection.close();
//         return callback(err);
//       }
//     });

//     const rows = [];
//     request.on('row', (columns) => {
//       const row = {};
//       columns.forEach(col => {
//         row[col.metadata.colName] = col.value;
//       });
//       rows.push(row);
//     });

//     request.on('requestCompleted', () => {
//       if (rows.length === 0) {
//         connection.close();
//         return callback(null, null);
//       }

//       connection.close();
//       return callback(null, rows[0]);
//     });

//     request.addParameter('email', TYPES.NVarChar, email);
//     request.addParameter('password', TYPES.NVarChar, password);

//     connection.execSql(request);
//   });

//   connection.on('error', (err) => {
//     console.error('Connection error event:', err);
//     connection.close();
//     callback(err);
//   });

//   connection.connect();
// }