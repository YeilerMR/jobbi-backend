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

module.exports = verifyToken;
