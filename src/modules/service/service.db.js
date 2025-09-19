const { createConnection } = require('../../utils/database/dbconnection');

async function insertService(service) {
  const connection = await createConnection();

  const [result] = await connection.execute(
    `INSERT INTO Service (id_branch, id_specialty, name, description, price, duration, state_service)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      service.id_branch,
      service.id_specialty,
      service.name,
      service.description,
      service.price,
      service.duration,
      service.state_service
    ]
  );

  const id_service = result.insertId;

  const [rows] = await connection.execute(
    `SELECT * FROM Service WHERE id_service = ?`,
    [id_service]
  );

  await connection.end();

  return rows[0];
}

async function findServicesByBranchId(id_branch) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Service WHERE id_branch = ? AND state_service = 1`,
    [id_branch]
  );

  await connection.end();
  return rows;
}

async function updateServiceById(id_service, updatedData) {
  const connection = await createConnection();

  const { name, description, price, duration } = updatedData;

  await connection.execute(
    `UPDATE Service SET name = ?, description = ?, price = ?, duration = ? WHERE id_service = ? AND state_service = 1`,
    [name, description, price, duration, id_service]
  );

  await connection.end();
}

async function softDeleteServiceById(id_service) {
  const connection = await createConnection();

  await connection.execute(
    `UPDATE Service SET state_service = 0 WHERE id_service = ?`,
    [id_service]
  );

  await connection.end();
}

async function findServiceById(id_service) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Service WHERE id_service = ? AND state_service = 1`,
    [id_service]
  );

  await connection.end();
  return rows[0];
}

module.exports = {
  insertService,
  findServicesByBranchId,
  updateServiceById,
  softDeleteServiceById,
  findServiceById,
};
