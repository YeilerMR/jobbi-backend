const { createConnection } = require('../../utils/database/dbconnection');

async function insertBusiness(business) {
  const connection = await createConnection();

  const [result] = await connection.execute(
    `INSERT INTO Business (id_user_admin, name, location, phone, email, state_business)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      business.id_user_admin,
      business.name,
      business.location,
      business.phone,
      business.email,
      business.state_business
    ]
  );

  // Assuming result.insertId or similar
  const id_business = result.insertId || null;

  // Fetch the inserted business
  const [rows] = await connection.execute(
    `SELECT * FROM Business WHERE id_business = ?`,
    [id_business]
  );

  await connection.end();

  return rows[0];
}

async function insertBranch(branch) {
  const connection = await createConnection();

  const [result] = await connection.execute(
    `INSERT INTO Branch (id_business, name, location, phone, email, state_branch)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      branch.id_business,
      branch.name,
      branch.location,
      branch.phone,
      branch.email,
      branch.state_branch
    ]
  );

  const id_branch = result.insertId || null;

  const [rows] = await connection.execute(
    `SELECT * FROM Branch WHERE id_branch = ?`,
    [id_branch]
  );

  await connection.end();

  return rows[0];
}

async function findBusinessesByUser(userId) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Business WHERE id_user_admin = ?`,// AND state_business = 1
    [userId]
  );

  await connection.end();

  return rows;
}

async function findBusinessById(businessId) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Business WHERE id_business = ?`,//AND state_business = 1
    [businessId]
  );

  await connection.end();
  //console.log(rows[0]);
  
  return rows[0];
}

async function findBranchById(id_branch) {
  const connection = await createConnection();

  const [rows] = await connection.execute(
    `SELECT * FROM Branch WHERE id_branch = ?`,
    [id_branch]
  );

  await connection.end();

  return rows[0]; // Return the branch if found, else undefined
}

async function updateBusinessById(businessId, updateData) {
  const connection = await createConnection();

  // Build SET dynamically, only for allowed fields
  const allowedFields = ['name', 'location', 'phone', 'email', 'state_business'];
  const setClauses = [];
  const params = [];

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(updateData[key]);
    }
  }

  if (setClauses.length === 0) {
    await connection.end();
    return null;
  }

  params.push(businessId);

  await connection.execute(
    `UPDATE Business SET ${setClauses.join(', ')} WHERE id_business = ?`,
    params
  );

  // Return updated business
  const [rows] = await connection.execute(
    `SELECT * FROM Business WHERE id_business = ?`,
    [businessId]
  );

  await connection.end();

  return rows[0];
}

async function softDeleteBusinessById(businessId) {
  const connection = await createConnection();

  await connection.execute(
    `UPDATE Business SET state_business = 0 WHERE id_business = ?`,
    [businessId]
  );

  await connection.end();
}

async function softDeleteBranchesByBusinessId(businessId) {
  const connection = await createConnection();

  await connection.execute(
    `UPDATE Branch SET state_branch = 0 WHERE id_business = ?`,
    [businessId]
  );

  await connection.end();
}

module.exports = {
  insertBusiness,
  insertBranch,
  findBusinessesByUser,
  findBusinessById,
  updateBusinessById,
  softDeleteBusinessById,
  softDeleteBranchesByBusinessId,
  findBranchById
};
