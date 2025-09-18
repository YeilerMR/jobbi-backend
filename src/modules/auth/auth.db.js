const { Request, TYPES } = require('tedious');
const { createConnection } = require('../../utils/database/dbconnection');

function loginUser(username, password, callback) {
  const connection = createConnection();

  connection.on('connect', (err) => {
    if (err) {
      console.error('Connection error:', err);
      connection.close();
      return callback(err);
    }

    const query = `SELECT * FROM [dbo].[USERS] WHERE username = @username AND password = @password`;
    const request = new Request(query, (err, rowCount) => {
      if (err) {
        console.error('SQL error during login:', err);
        connection.close();
        return callback(err);
      }
    });

    const rows = [];
    request.on('row', (columns) => {
      const row = {};
      columns.forEach(col => {
        row[col.metadata.colName] = col.value;
      });
      rows.push(row);
    });

    request.on('requestCompleted', () => {
      if (rows.length === 0) {
        connection.close();
        return callback(null, null);
      }

      connection.close();
      return callback(null, rows[0]);
    });

    request.addParameter('username', TYPES.NVarChar, username);
    request.addParameter('password', TYPES.NVarChar, password);

    connection.execSql(request);
  });

  connection.on('error', (err) => {
    console.error('Connection error event:', err);
    connection.close();
    callback(err);
  });

  connection.connect();
}

module.exports = { loginUser };