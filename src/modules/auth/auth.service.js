const { loginUser } = require('./auth.db'); // better to move DB login logic to its own file
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret';

exports.login = (username, password) => {

  return new Promise((resolve, reject) => {

    loginUser(username, password, (err, user) => {
      
      if (err) return reject(err);
      if (!user) return resolve(null);

      const token = jwt.sign(
        { username: user.username, id: user.id },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      resolve(token);
    });
  });
};
