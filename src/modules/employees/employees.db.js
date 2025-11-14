const { createConnection } = require('../../utils/database/dbconnection');

exports.createEmployee = async (employee) => {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute(
      'INSERT INTO Employee (id_branch, id_user, availability) VALUES (?, ?, ?)',
      [employee.id_branch, employee.id_user, employee.availability ?? 1]
    );

    return { id_employee: result.insertId };
  } finally {
    await conn.end();
  }
};


// List all employees (optional filter by branch)
exports.listEmployees = async (filters) => {
  const conn = await createConnection();
  try {
    const where = [];
    const args = [];
    if (filters.id_branch) { where.push('e.id_branch = ?'); args.push(filters.id_branch); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const limit = Number(filters.limit) || 50;
    const offset = Number(filters.offset) || 0;

    const [rows] = await conn.execute(
      `SELECT e.id_employee, e.id_branch, e.id_user, e.availability,
              u.name, u.last_name, u.email, u.phone,
              br.name AS branch_name
       FROM \`Employee\` e
       INNER JOIN \`User\` u ON e.id_user = u.id_user
       LEFT JOIN \`Branch\` br ON e.id_branch = br.id_branch
       ${whereSql} 
       LIMIT ? OFFSET ?`,
      [...args, limit, offset]
    );
    const [[countRow]] = await conn.execute(
      `SELECT COUNT(*) AS total FROM \`Employee\` e ${whereSql}`,
      args
    );
    return { rows, total: Number(countRow.total) };
  } finally {
    await conn.end();
  }
};

// List employees by business (all branches of user's businesses)
exports.listEmployeesByBusiness = async (id_user_admin) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT e.id_employee, e.id_branch, e.id_user, e.availability,
              u.name, u.last_name, u.email, u.phone,
              br.name AS branch_name
       FROM \`Employee\` e
       INNER JOIN \`User\` u ON e.id_user = u.id_user
       INNER JOIN \`Branch\` br ON e.id_branch = br.id_branch
       INNER JOIN \`Business\` b ON br.id_business = b.id_business
       WHERE b.id_user_admin = ? AND b.state_business = 1 AND br.state_branch = 1`,
      [id_user_admin]
    );
    return rows;
  } finally {
    await conn.end();
  }
};

// Get employee by ID
exports.getEmployeeById = async (id) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT e.id_employee, e.id_branch, e.id_user, e.availability,
              u.name, u.last_name, u.email, u.phone,
              br.name AS branch_name
       FROM \`Employee\` e
       INNER JOIN \`User\` u ON e.id_user = u.id_user
       LEFT JOIN \`Branch\` br ON e.id_branch = br.id_branch
       WHERE e.id_employee = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
};

// Get employee by user id
exports.getEmployeeByUserId = async (id_user) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT e.id_employee, e.id_branch, e.id_user, e.availability,
              u.name, u.last_name, u.email, u.phone,
              br.name AS branch_name
       FROM \`Employee\` e
       INNER JOIN \`User\` u ON e.id_user = u.id_user
       LEFT JOIN \`Branch\` br ON e.id_branch = br.id_branch
       WHERE e.id_user = ? LIMIT 1`,
      [id_user]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
};

// Update employee
exports.updateEmployee = async (id, employee) => {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute(
      'UPDATE `Employee` SET id_branch = ?, availability = ? WHERE id_employee = ?',
      [employee.id_branch, employee.availability, id]
    );
    return { affectedRows: result.affectedRows };
  } finally {
    await conn.end();
  }
};

// Delete employee (hard delete for now; can change to soft if needed)
exports.deleteEmployee = async (id) => {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute('DELETE FROM `Employee` WHERE id_employee = ?', [id]);
    return { affectedRows: result.affectedRows };
  } finally {
    await conn.end();
  }
};

// Associate employee to branch
exports.associateToBranch = async (id_employee, id_branch) => {
  const conn = await createConnection();
  try {
    const [result] = await conn.execute(
      'UPDATE `Employee` SET id_branch = ? WHERE id_employee = ?',
      [id_branch, id_employee]
    );
    return { affectedRows: result.affectedRows };
  } finally {
    await conn.end();
  }
};

// Get employee availability (for traffic light logic)
exports.getAvailability = async (id_employee) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT availability FROM `Employee` WHERE id_employee = ? LIMIT 1',
      [id_employee]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
};

// Get employee schedule (placeholder; assumes a Schedule table exists or returns mock)
exports.getSchedule = async (id_employee) => {
  const conn = await createConnection();
  try {
    // If you have a Schedule table:
    // const [rows] = await conn.execute('SELECT * FROM `Schedule` WHERE id_employee = ?', [id_employee]);
    // return rows;

    // Placeholder response if table doesn't exist:
    return { id_employee, schedule: [] };
  } finally {
    await conn.end();
  }
};

// Validate user exists and is active
exports.ensureUserActive = async (id_user) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_user FROM `User` WHERE id_user = ? AND state_user = 1 LIMIT 1',
      [id_user]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
};

// Validate branch exists and is active
exports.ensureBranchActive = async (id_branch) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_branch FROM `Branch` WHERE id_branch = ? AND state_branch = 1 LIMIT 1',
      [id_branch]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
};


// Check if employee already exists in branch
exports.existsEmployeeInBranch = async (id_user, id_branch) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_employee FROM `Employee` WHERE id_user = ? AND id_branch = ? LIMIT 1',
      [id_user, id_branch]
    );
    return rows.length > 0;
  } finally {
    await conn.end();
  }
};


