const { createConnection } = require('../../utils/database/dbconnection');

// Get gifts/points record for a user (stored in ClientPoints table)
exports.getGiftsByUser = async (id_user) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id_client_points, id_user, total_points, redeemed_points, last_update FROM ClientPoints WHERE id_user = ? LIMIT 1',
      [id_user]
    );
    return rows[0] || null;
  } finally {
    await conn.end();
  }
};

// Upsert placeholder - not used now, but handy later
exports.createOrUpdateGifts = async ({ id_user, total_points = 0, redeemed_points = 0 }) => {
  const conn = await createConnection();
  try {
    const [existing] = await conn.execute('SELECT id_client_points FROM ClientPoints WHERE id_user = ? LIMIT 1', [id_user]);
    if (existing.length > 0) {
      const id = existing[0].id_client_points;
      await conn.execute(
        'UPDATE ClientPoints SET total_points = ?, redeemed_points = ?, last_update = NOW() WHERE id_client_points = ?',
        [total_points, redeemed_points, id]
      );
      return { updated: true };
    }
    const [result] = await conn.execute(
      'INSERT INTO ClientPoints (id_user, total_points, redeemed_points, last_update) VALUES (?, ?, ?, NOW())',
      [id_user, total_points, redeemed_points]
    );
    return { insertId: result.insertId };
  } finally {
    await conn.end();
  }
};

// List active gifts available for a given role
exports.listGiftsByRole = async (roleId) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id_gift, name, description, for_role, min_points, min_rating, reward_type, is_active
       FROM Gifts WHERE for_role = ? AND is_active = 1`,
      [roleId]
    );
    return rows;
  } finally {
    await conn.end();
  }
};

// List gifts (User_Gift) related to a user, with gift details and redeemed flag
exports.listUserGifts = async (id_user) => {
  const conn = await createConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT ug.id_user_gift, ug.id_user, ug.id_gift, ug.gift_date, ug.redeemed,
              g.name AS gift_name, g.description AS gift_description, g.for_role, g.min_points, g.is_active
       FROM User_Gift ug
       LEFT JOIN Gifts g ON ug.id_gift = g.id_gift
       WHERE ug.id_user = ?`,
      [id_user]
    );
    return rows;
  } finally {
    await conn.end();
  }
};
