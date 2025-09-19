const { createConnection } = require('../../utils/database/dbconnection');

/**
 * Compat login helper (callback style) kept for existing login flow.
 */
async function loginUser(email, password, callback) {
  try {
    const connection = await createConnection();

    // Fetch by email only; password will be compared in the service using bcrypt
    const [rows] = await connection.execute(
      `SELECT id_user, id_rol, name, last_name, email, phone, password, state_user
       FROM ` + '`User`' + `
       WHERE email = ? LIMIT 1`,
      [email]
    );

    await connection.end();

    if (rows.length === 0) return callback(null, null);
    return callback(null, rows[0]);
  } catch (err) {
    console.error('❌ Login error:', err.message || err);
    return callback(err);
  }
}

/**
 * Busca un usuario por email. Retorna objeto usuario o null.
 */
async function getUserByEmail(email) {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      `SELECT id_user, id_rol, name, last_name, email, phone, password, state_user
       FROM ` + '`User`' + `
       WHERE email = ? LIMIT 1`,
      [email]
    );
    await connection.end();
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.error('DB getUserByEmail error:', err);
    throw err;
  }
}

/**
 * Crea un nuevo usuario usando consultas parametrizadas.
 * userObj: { id_rol, name, last_name, email, phone, password, state_user }
 */
async function createUser(userObj) {
  try {
    const connection = await createConnection();
    const [result] = await connection.execute(
      `INSERT INTO ` + '`User`' + ` (id_rol, name, last_name, email, phone, password, state_user)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userObj.id_rol,
        userObj.name,
        userObj.last_name,
        userObj.email,
        userObj.phone,
        userObj.password,
        userObj.state_user
      ]
    );
    await connection.end();
    return { insertId: result.insertId };
  } catch (err) {
    console.error('DB createUser error:', err);
    throw err;
  }
}

module.exports = { loginUser, getUserByEmail, createUser };