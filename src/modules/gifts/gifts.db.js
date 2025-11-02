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

exports.createAssociationUserGift = async (userId, giftId) => {
  let connection;
  try {
    connection = await createConnection();

    const userPoints = await getPointsByUser(userId);

    const totalPoints = userPoints.total_points;
    const redeemedPoints = userPoints.redeemed_points;

    const giftPoints = await getPointsByGift(giftId);
    const pointsLeft = totalPoints - giftPoints;

    if (pointsLeft < 0) {
      throw new Error("You don't have enough points to redeem this reward. Don't give up!");
    }

    let totalRedeemedPoints = redeemedPoints + giftPoints;

    await updateUserPoints(userId, pointsLeft, totalRedeemedPoints);

    const [result] = await connection.execute(
      `
            INSERT INTO User_Gift (id_user, id_gift, gift_date, redeemed, is_active)
            VALUES (?, ?, NOW(), 1, 0)
            `,
      [userId, giftId]
    );

    const insertedId = result.insertId;

    const newGift = await getGiftUserByUserGift(insertedId);

    return newGift;

  } catch (error) {
    console.error("Error creating association user-gift:", error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}



async function updateUserPoints (userId, totalPoints, totalRedeemedPoints) {
  const connection = await createConnection();
  try {
    const [result] = await connection.execute(
      `
            UPDATE ClientPoints 
            SET total_points = ?, redeemed_points = ?, last_update = NOW() 
            WHERE id_user = ?
            `,
      [totalPoints, totalRedeemedPoints, userId]
    );

    return result.affectedRows > 0; // returns true if updated successfully
  } finally {
    await connection.end();
  }
}

async function getGiftUserByUserGift (idUserGift) {
  let connection;
  try {
    connection = await createConnection();

    const [rows] = await connection.execute(
      `
            SELECT 
                us.id_user_gift,
                us.id_user,
                us.id_gift,
                g.name AS gift_name,
                g.description,
                g.discount,
                g.for_role,
                g.min_points,
                g.reward_type,
                us.gift_date,
                us.redeemed,
                us.is_active
            FROM User_Gift us
            INNER JOIN Gifts g ON us.id_gift = g.id_gift
            WHERE us.id_user_gift = ?
            `,
      [idUserGift]
    );

    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching gift by user gift ID:", error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

async function getPointsByUser (userId) {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT total_points, redeemed_points FROM ClientPoints WHERE id_user = ?`,
      [userId]
    );

    if (!rows.length) throw new Error("User not found in ClientPoints");

    return rows[0];
  } finally {
    await connection.end();
  }
}

async function getPointsByGift (giftId) {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT min_points FROM Gifts WHERE id_gift = ?`,
      [giftId]
    );

    if (!rows.length) throw new Error("Gift not found");

    return rows[0].min_points;
  } finally {
    await connection.end();
  }
}

exports.updateUserGiftStatus = async (userId, giftId) => {
  let connection;
  try {
    connection = await createConnection();

    // Deactivate all other gifts for the user
    const [deactivateResult] = await connection.execute(
      `
                UPDATE User_Gift
                SET is_active = 0
                WHERE id_user = ? AND id_gift != ?
            `,
      [userId, giftId]
    );

    // Activate the selected gift
    const [activateResult] = await connection.execute(
      `
                UPDATE User_Gift
                SET is_active = 1
                WHERE id_user = ? AND id_gift = ?
            `,
      [userId, giftId]
    );

    // Return the update results
    return {
      deactivatedRows: deactivateResult.affectedRows,
      activatedRows: activateResult.affectedRows
    };

  } catch (error) {
    console.error("Error updating user gift status:", error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Export helper to fetch a User_Gift by its id (used by controllers/services)
exports.getGiftUserByUserGift = getGiftUserByUserGift;

// Persist a generated token to an existing User_Gift record
exports.createTokenForUserGift = async (id_user_gift, token, expires_at, generated_by) => {
  const connection = await createConnection();
  try {
    const [result] = await connection.execute(
      `UPDATE User_Gift
       SET token = ?, token_expires_at = ?, token_created_at = NOW(), token_used = 0, token_generated_by = ?
       WHERE id_user_gift = ?`,
      [token, expires_at || null, generated_by || null, id_user_gift]
    );

    if (result.affectedRows === 0) return null;

    const [rows] = await connection.execute(
      `SELECT ug.*, g.name AS gift_name, g.description AS gift_description, g.discount, g.reward_type
       FROM User_Gift ug
       LEFT JOIN Gifts g ON ug.id_gift = g.id_gift
       WHERE ug.id_user_gift = ? LIMIT 1`,
      [id_user_gift]
    );

    return rows[0] || null;
  } finally {
    await connection.end();
  }
};

// Find a User_Gift by token (prefer tokens stored in User_Gift)
exports.getUserGiftByToken = async (token) => {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT ug.*, g.name AS gift_name, g.description AS gift_description, g.discount, g.reward_type
       FROM User_Gift ug
       LEFT JOIN Gifts g ON ug.id_gift = g.id_gift
       WHERE ug.token = ? LIMIT 1`,
      [token]
    );
    return rows[0] || null;
  } finally {
    await connection.end();
  }
};

// Atomically mark the token as used and mark the gift redeemed
exports.markTokenUsedInUserGift = async (token, used_by) => {
  const connection = await createConnection();
  try {
    // atomic update: only mark if token_used = 0
    const [result] = await connection.execute(
      `UPDATE User_Gift
       SET token_used = 1, token_used_at = NOW(), redeemed = 1
       WHERE token = ? AND token_used = 0`,
      [token]
    );

    if (result.affectedRows === 0) return { affectedRows: 0 };

    // return the updated record
    const [rows] = await connection.execute(
      `SELECT ug.*, g.name AS gift_name, g.description AS gift_description, g.discount, g.reward_type
       FROM User_Gift ug
       LEFT JOIN Gifts g ON ug.id_gift = g.id_gift
       WHERE ug.token = ? LIMIT 1`,
      [token]
    );

    return { affectedRows: result.affectedRows, record: rows[0] || null };
  } finally {
    await connection.end();
  }
};