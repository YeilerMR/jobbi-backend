const db = require('./gifts.db');
const crypto = require('crypto');
const PUBLIC_URL = process.env.PUBLIC_URL || process.env.HOST_URL || null;
// Token expiry in minutes (fixed). Can be configured via env var GIFT_TOKEN_EXPIRES_MINUTES
const TOKEN_EXPIRES_MINUTES = Number(process.env.GIFT_TOKEN_EXPIRES_MINUTES) || 60;

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

exports.createAssociationUserGift = async (userId, giftId) => {
    return await db.createAssociationUserGift(userId, giftId);
}

exports.updateUserGiftStatus = async (userId, giftId) => {
    return await db.updateUserGiftStatus(userId, giftId);
}

// Generate a token for an existing User_Gift and persist it (returns token + url + record)
exports.generateQRCodeForUserGift = async (id_user_gift, opts = {}) => {
  if (!id_user_gift) throw new Error('id_user_gift is required');

  const token = crypto.randomBytes(16).toString('hex');
  // Use fixed expiry from env or default (60 minutes). Ignore caller-provided expiresMinutes.
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRES_MINUTES * 60 * 1000);
  const generatedBy = opts.generatedBy || null;

  const record = await db.createTokenForUserGift(id_user_gift, token, expiresAt, generatedBy);
  if (!record) throw new Error('Unable to persist token for that user gift');

  const host = opts.hostUrl || PUBLIC_URL || (opts.req && `${opts.req.protocol}://${opts.req.get('host')}`) || '';
  const validateUrl = `${host.replace(/\/$/, '')}/gifts/qr/validate?token=${token}`;

  return { token, validateUrl, expiresAt, record };
};

// Validate a token stored in User_Gift and optionally mark it used (returns record and status)
exports.validateQRCode = async (token, opts = {}) => {
  if (!token) throw new Error('token is required');

  // look up token in User_Gift
  const userGift = await db.getUserGiftByToken(token);
  if (!userGift) return { valid: false, reason: 'Token not found' };

  if (userGift.token_used === 1) return { valid: false, reason: 'Token already used', record: userGift };

  if (userGift.token_expires_at && new Date(userGift.token_expires_at) < new Date()) {
    return { valid: false, reason: 'Token expired', record: userGift };
  }

  if (opts.markUsed) {
    const res = await db.markTokenUsedInUserGift(token, opts.usedBy || null);
    if (!res || res.affectedRows === 0) return { valid: false, reason: 'Token already used (race)', record: userGift };
    return { valid: true, used: true, record: res.record };
  }

  return { valid: true, used: false, record: userGift };
};

// Validate by User_Gift id (used when front/back flow uses /gifts/assoc to create the row)
exports.validateUserGiftById = async (id_user_gift, opts = {}) => {
  if (!id_user_gift) throw new Error('id_user_gift is required');

  const userGift = await db.getGiftUserByUserGift(id_user_gift);
  if (!userGift) return { valid: false, reason: 'User_Gift not found' };

  // If a token exists on the row, prefer token validation rules
  if (userGift.token) {
    // respect token state
    if (userGift.token_used === 1) return { valid: false, reason: 'Token already used', record: userGift };
    if (userGift.token_expires_at && new Date(userGift.token_expires_at) < new Date()) {
      return { valid: false, reason: 'Token expired', record: userGift };
    }

    if (opts.markUsed) {
      const res = await db.markTokenUsedInUserGift(userGift.token, opts.usedBy || null);
      if (!res || res.affectedRows === 0) return { valid: false, reason: 'Token already used (race)', record: userGift };
      return { valid: true, used: true, record: res.record };
    }

    return { valid: true, used: false, record: userGift };
  }

  // No token in the row: validate by id and optionally mark used/redeemed
  // if (userGift.token_used === 1 || userGift.redeemed === 1) {
  //   return { valid: false, reason: 'Already redeemed', record: userGift };
  // }

  if (opts.markUsed) {
    const res = await db.markUserGiftUsedById(id_user_gift, opts.usedBy || null);
    if (!res || res.affectedRows === 0) return { valid: false, reason: 'Already redeemed (race)', record: userGift };
    return { valid: true, used: true, record: res.record };
  }

  return { valid: true, used: false, record: userGift };
};
