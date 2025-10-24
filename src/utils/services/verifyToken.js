const getAuthUser = require('../services/getAuthUser');

function verifyToken(origin = null) {
  return (req, res, next) => {
    const user = getAuthUser(req, origin);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token"
      });
    }

    req.user = user;
    next();
  };
}

// Middleware to verify admin role (id_rol === 1)
function verifyAdmin(origin = null) {
  return (req, res, next) => {
    const user = getAuthUser(req, origin);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token"
      });
    }

    // Check if user has admin role (id_rol === 1)
    if (user.id_rol !== 1) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required"
      });
    }

    req.user = user;
    next();
  };
}

module.exports = verifyToken;
module.exports.verifyAdmin = verifyAdmin;
