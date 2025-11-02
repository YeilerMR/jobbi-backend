const service = require('./gifts.service');
const { getUserById } = require('../user/user.db');
const db = require('./gifts.db');

// GET /gifts/points (returns points for the logged-in user)
// Note: this controller reads the user id from the JWT (req.user)
exports.getGifts = async (req, res) => {
  try {
    const requester = req.user; // provided by verifyToken()
    const id_user = requester && requester.id_user;

    // Authorization: require authenticated requester
    if (!requester) {
      console.log('Unauthorized request to get gifts');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    
    // Validate that the requested user (from JWT) exists
    const userExists = await getUserById(id_user);
    if (!userExists) {
      console.log(`User ${id_user} not found`);
      return res.status(404).json({ success: false, message: 'That user does not exist' });
    }

    const gifts = await service.getGiftsForUser(id_user);
    console.log(`Gifts retrieved for user ${id_user}`);
    return res.json({ success: true, message: 'Gifts retrieved successfully', data: gifts });
  } catch (err) {
    console.error('Error in getGifts:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /gifts/available  -> list gifts available for the logged-in user's role
exports.listAvailableByRole = async (req, res) => { 
  try {
    const requester = req.user;
    if (!requester) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const roleId = requester.id_rol;
    if (!roleId) {
      return res.status(400).json({ success: false, message: 'User role not found' });
    }

    const gifts = await service.getAvailableGiftsForRole(roleId);
    console.log(`Available gifts listed for role ${roleId}`);
    return res.json({ success: true, message: 'Available gifts retrieved successfully', data: gifts });
  } catch (err) {
    console.error('Error in listAvailableByRole:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /gifts/mine -> list gifts related to the logged-in user (User_Gift entries)
exports.listUserGifts = async (req, res) => {
  try {
    const requester = req.user;
    if (!requester) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const id_user = requester.id_user;

    // Validate user exists (defensive)
    const userExists = await getUserById(id_user);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'That user does not exist' });
    }

    const rows = await service.getUserGifts(id_user);
    console.log(`User gifts listed for user ${id_user}`);
    return res.json({ success: true, message: 'User gifts retrieved successfully', data: rows });
  } catch (err) {
    console.error('Error in listUserGifts:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.createAssociationUserGift = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const giftId = req.params.giftId;

        const creation = await service.createAssociationUserGift(userId, giftId);

        res.status(201).json({
            success: true,
            data: creation
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateUserGiftStatus = async (req, res) => {
    try {
        const userId = req.user.id_user;
        const giftId = req.params.giftId;

        const updateStatus = await service.updateUserGiftStatus(userId, giftId);

        if (!updateStatus || updateStatus.activatedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "The gift couldn't be activated. Please try again later."
            });
        }

        res.status(200).json({
            success: true,
            message: "Reward activated successfully. You can use it for your next appointment!",
            data: updateStatus
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /gifts/qr/create -> body: { id_user_gift, expiresMinutes, hostUrl }
exports.createQRCode = async (req, res) => {
  try {
    const requester = req.user;
    if (!requester) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { id_user_gift, expiresMinutes, hostUrl } = req.body || {};
    if (!id_user_gift) return res.status(400).json({ success: false, message: 'id_user_gift is required' });

    // Ensure the user_gift belongs to the requester (security)
    const userGift = await db.getGiftUserByUserGift(id_user_gift);
    if (!userGift) return res.status(404).json({ success: false, message: 'User_Gift not found' });
    if (Number(userGift.id_user) !== Number(requester.id_user)) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot create token for another user' });
    }

    const result = await service.generateQRCodeForUserGift(id_user_gift, { expiresMinutes, hostUrl, generatedBy: requester.id_user, req });

    return res.status(201).json({ success: true, message: 'Token generated', data: result });
  } catch (err) {
    console.error('Error in createQRCode:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// POST /gifts/qr/validate -> body: { token, markUsed }
exports.validateQRCode = async (req, res) => {
  try {
    const requester = req.user || null; // may be unauthenticated scanner
    const { token, markUsed } = req.body || {};
    if (!token) return res.status(400).json({ success: false, message: 'token is required' });

    const result = await service.validateQRCode(token, { markUsed: !!markUsed, usedBy: requester ? requester.id_user : null });

    if (!result.valid) return res.status(400).json({ success: false, message: result.reason, data: result.record });

    return res.json({ success: true, message: 'Token valid', data: result.record, used: !!result.used });
  } catch (err) {
    console.error('Error in validateQRCode:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};