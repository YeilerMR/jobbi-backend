const service = require('./gifts.service');
const { getUserById } = require('../user/user.db');

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
