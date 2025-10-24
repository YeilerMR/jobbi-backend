const { createConnection } = require('../../utils/database/dbconnection');

// Search users by name (case-insensitive, partial match)
exports.searchUsersByName = async (name) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id_user, name, last_name, email, phone, id_rol
       FROM User
       WHERE name LIKE ? OR last_name LIKE ?
       ORDER BY name ASC
       LIMIT 20`,
      [`%${name}%`, `%${name}%`]
    );
    return rows;
  } finally {
    await conn.end();
  }
};
