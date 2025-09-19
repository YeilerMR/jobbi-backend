const jwt = require('jsonwebtoken');

class JwtHandler {
  constructor(secret = process.env.JWT_SECRET || 'fallback-secret') {
    this.secret = secret;
  }

  // Generate token
  generate(payload, expiresIn = '1h') {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  // Validate token
  validate(token) {
    try {
      const decoded = jwt.verify(token, this.secret);
      return { valid: true, decoded };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }

  // Decode without validating (use with caution)
  decode(token) {
    try {
      return jwt.decode(token);
    } catch (err) {
      return null;
    }
  }
}

module.exports = new JwtHandler();
