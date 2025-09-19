const jwtHandler = require('../services/jwt-handler');

function getAuthUser(req, requiredOrigin = null) {
  let token = null;

  // Try Authorization Header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Try Cookies
  if (!token) {
    if (requiredOrigin === 'foodtrucks') {
      token = req.cookies?.clientAuthToken ?? null;
    } else if (requiredOrigin === 'admin') {
      token = req.cookies?.adminAuthToken ?? null;
    } else {
      token = req.cookies?.clientAuthToken ?? null;
    }
  }

  if (!token) return null;

  const { valid, decoded } = jwtHandler.validate(token);

  return valid ? decoded : null;
}

module.exports = getAuthUser;
