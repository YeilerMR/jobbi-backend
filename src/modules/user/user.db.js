const { createConnection } = require('../../utils/database/dbconnection');

async function getUserById(userId) {
  const connection = await createConnection();
  const [rows] = await connection.execute(
    `SELECT id_rol, email FROM User WHERE id_user = ?`,
    [userId]
  );
  await connection.end();
  return rows[0];
}

async function updateUserRole(userId, newRoleId) {
  const connection = await createConnection();
  await connection.execute(
    `UPDATE User SET id_rol = ? WHERE id_user = ?`,
    [newRoleId, userId]
  );
  await connection.end();
}

module.exports = { getUserById, updateUserRole };
