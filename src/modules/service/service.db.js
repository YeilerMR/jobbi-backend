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
    `SELECT * FROM Service WHERE id_branch = ?`, //AND state_service = 1
    [id_branch]
  );

  await connection.end();
  return rows;
}

async function updateServiceById(id_service, updatedData) {
  const connection = await createConnection();

  const { id_branch, id_specialty, name, description, price, duration, state_service } = updatedData;

  await connection.execute(
    `UPDATE Service SET id_branch = ?, id_specialty = ? , name = ?, description = ?, price = ?, duration = ?, state_service = ? WHERE id_service = ?`,
    [id_branch, id_specialty, name, description, price, duration, state_service, id_service]
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

async function findServicesByUser(id_user) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT 
        s.id_service,
        s.id_branch,
        s.id_specialty,
        s.name,
        s.description,
        s.price,
        s.duration,
        s.state_service
    FROM Service s
    JOIN Branch b ON s.id_branch = b.id_branch
    JOIN Business bu ON b.id_business = bu.id_business
    JOIN User u ON bu.id_user_admin = u.id_user
    WHERE u.id_user = ?;
    `, [id_user]
  );

  await connection.end();
  return rows;
}

async function findBranchesByService(searchValue) {
  const connection = await createConnection();

  const [rows] = await connection.execute(`
      SELECT 
          b.id_branch,
          b.name,
          b.location,
          b.phone,
          s.name AS service_name,
          s.description,
          s.id_service,
          u.name AS user_name,
          cp.total_points,
          CASE WHEN EXISTS (
              SELECT 1 FROM User_Gift ug2 
              WHERE ug2.id_user = u.id_user 
                AND ug2.is_active = 1 
                AND ug2.redeemed = 1
          ) THEN 1 ELSE 0 END AS has_active_redeemed_gift
      FROM Service s
      INNER JOIN Branch b ON s.id_branch = b.id_branch AND b.state_branch = 1
      INNER JOIN Business bs ON b.id_business = bs.id_business AND bs.state_business = 1
      INNER JOIN User u ON u.id_user = bs.id_user_admin AND u.id_rol = 1
      LEFT JOIN ClientPoints cp ON cp.id_user = u.id_user
      WHERE s.state_service = 1
        AND LOWER(s.name) LIKE LOWER(CONCAT('%', ?, '%'))
      GROUP BY b.id_branch, b.name, b.location, b.phone, s.name, s.description, u.name, cp.total_points
      ORDER BY
          has_active_redeemed_gift DESC,
          cp.total_points DESC;
    `, [searchValue]);

  await connection.end();
  return rows;
}

module.exports = {
  insertService,
  findServicesByBranchId,
  updateServiceById,
  softDeleteServiceById,
  findServiceById,
  findServicesByUser,
  findBranchesByService
};

/**
 * 
 * id branch
 * nombre
 * dirección
 * numero de telefono
 */