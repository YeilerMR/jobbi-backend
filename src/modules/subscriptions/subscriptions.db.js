const { createConnection } = require('../../utils/database/dbconnection');

async function getAllPlans() {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_plans_subscription, name, description, price, duration, is_active FROM PlansSubscription WHERE is_active = 1'
    );
    return rows;
  } finally {
    await conn.end();
  }
}

async function getPlanCharacteristics(planId) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_characteristics FROM PlanCharacteristics WHERE id_plan = ?',
      [planId]
    );
    return rows.map((r) => r.id_characteristics);
  } finally {
    await conn.end();
  }
}

function limitsFromCharacteristics(characteristics) {
  // Default: no limits defined
  let maxBranches = null; // null means unlimited
  let maxEmployeesPerBranch = null;

  if (characteristics.includes(1)) maxBranches = 1;
  if (characteristics.includes(3)) maxBranches = 2;
  if (characteristics.includes(5)) maxBranches = null; // unlimited

  if (characteristics.includes(2)) maxEmployeesPerBranch = 5;
  if (characteristics.includes(4)) maxEmployeesPerBranch = 10;
  if (characteristics.includes(6)) maxEmployeesPerBranch = null; // unlimited

  return { maxBranches, maxEmployeesPerBranch };
}

async function getPlanLimits(planId) {
  const ch = await getPlanCharacteristics(planId);
  return limitsFromCharacteristics(ch);
}

async function getActiveSubscriptionWithPlan(userId) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT s.*, p.id_plans_subscription, p.name as plan_name, p.description as plan_description, p.price, p.duration
       FROM Subscriptions s
       JOIN PlansSubscription p ON s.id_plan = p.id_plans_subscription
       WHERE s.id_user = ? AND s.state_suscription = 1 AND CURDATE() BETWEEN s.start_date AND s.end_date
       ORDER BY s.end_date DESC
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

async function deactivateActiveSubscriptions(userId) {
  const conn = await createConnection();
  try {
    await conn.execute('UPDATE Subscriptions SET state_suscription = 0 WHERE id_user = ? AND state_suscription = 1', [userId]);
  } finally {
    await conn.end();
  }
}

async function createSubscription(userId, planId, startDate, endDate) {
  const conn = await createConnection();
  try {
    await conn.execute(
      'INSERT INTO Subscriptions (id_user, id_plan, start_date, end_date, state_suscription) VALUES (?, ?, ?, ?, 1)',
      [userId, planId, startDate, endDate]
    );
  } finally {
    await conn.end();
  }
}

async function getSubscriptionHistory(userId) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT s.*, p.name as plan_name
       FROM Subscriptions s
       JOIN PlansSubscription p ON s.id_plan = p.id_plans_subscription
       WHERE s.id_user = ?
       ORDER BY s.start_date DESC, s.id_suscriptions DESC`,
      [userId]
    );
    return rows;
  } finally {
    await conn.end();
  }
}

async function getPlanById(planId) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_plans_subscription, name, description, price, duration, is_active FROM PlansSubscription WHERE id_plans_subscription = ?',
      [planId]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

async function countBranchesForAdmin(userId) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT COUNT(b.id_branch) as total
       FROM Branch b
       INNER JOIN Business bus ON bus.id_business = b.id_business
       WHERE bus.id_user_admin = ?`,
      [userId]
    );
    return rows[0]?.total || 0;
  } finally {
    await conn.end();
  }
}

async function countEmployeesInBranch(branchId) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute('SELECT COUNT(*) as total FROM Employee WHERE id_branch = ?', [branchId]);
    return rows[0]?.total || 0;
  } finally {
    await conn.end();
  }
}

async function getBranchesForAdmin(userId) {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT b.id_branch
       FROM Branch b
       INNER JOIN Business bus ON bus.id_business = b.id_business
       WHERE bus.id_user_admin = ?`,
      [userId]
    );
    return rows.map((r) => r.id_branch);
  } finally {
    await conn.end();
  }
}

module.exports = {
  getAllPlans,
  getPlanCharacteristics,
  getPlanLimits,
  getPlanById,
  getActiveSubscriptionWithPlan,
  deactivateActiveSubscriptions,
  createSubscription,
  getSubscriptionHistory,
  countBranchesForAdmin,
  countEmployeesInBranch,
  getBranchesForAdmin,
  limitsFromCharacteristics,
};
