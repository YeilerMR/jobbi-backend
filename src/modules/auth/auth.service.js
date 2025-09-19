const { loginUser } = require('./auth.db'); // better to move DB login logic to its own file
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret';

exports.login = (email, password) => {

  return new Promise((resolve, reject) => {

    loginUser(email, password, (err, user) => {

      if (err) return reject(err);
      if (!user) return resolve(null);

      // Destructure user and exclude password
      const {
        id_user,
        id_rol,
        name,
        last_name,
        email: userEmail,
        phone,
        state_user
      } = user;

      // Create JWT with full user info (except password)
      const token = jwt.sign(
        {
          id_user,
          id_rol,
          name,
          last_name,
          email: userEmail,
          phone,
          state_user
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      resolve(token);
    });
  });
};
