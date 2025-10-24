const db = require('./gifts.db');

// Returns { id_user, total_points, redeemed_points, available_points, last_update }
exports.getGiftsForUser = async (id_user) => {
  if (!id_user) throw new Error('User id is required');

  const record = await db.getGiftsByUser(id_user);
  if (!record) {
    // If no record found, return zeros
    return {
      id_user,
      total_points: 0,
      redeemed_points: 0,
      available_points: 0,
      last_update: null
    };
  }

  const available = (Number(record.total_points) || 0) - (Number(record.redeemed_points) || 0);
  return {
    id_user: record.id_user,
    total_points: Number(record.total_points) || 0,
    redeemed_points: Number(record.redeemed_points) || 0,
    available_points: available < 0 ? 0 : available,
    last_update: record.last_update
  };
};

// Returns array of gifts available for a role
exports.getAvailableGiftsForRole = async (roleId) => {
  if (!roleId) throw new Error('Role id is required');
  const rows = await db.listGiftsByRole(roleId);
  return rows || [];
};

// Returns array of user_gift records with gift details for a user
exports.getUserGifts = async (id_user) => {
  if (!id_user) throw new Error('User id is required');
  const rows = await db.listUserGifts(id_user);
  return rows || [];
};
