const { createConnection } = require('../../utils/database/dbconnection');

async function getAllSpecialtys() {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute('SELECT id_specialty, name FROM Specialty');
    return rows;
  } finally {
    await conn.end();
  }
}

module.exports = { getAllSpecialtys };
