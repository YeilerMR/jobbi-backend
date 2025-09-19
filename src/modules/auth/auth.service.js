const { loginUser, getUserByEmail, createUser } = require('./auth.db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret';

function escapeInput(str = '') {
  return validator.escape(String(str || '')).trim();
}

function isStrongPassword(password = '') {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return re.test(password);
}

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    loginUser(email, password, async (err, user) => {
      try {
        if (err) return reject(err);
        if (!user) return resolve(null);

        // Compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return resolve(null);

        const { id_user, id_rol, name, last_name, email: userEmail, phone, state_user } = user;
        const token = jwt.sign({ id_user, id_rol, name, last_name, email: userEmail, phone, state_user }, SECRET_KEY, { expiresIn: '1h' });
        resolve(token);
      } catch (ex) {
        return reject(ex);
      }
    });
  });
};

exports.register = async (payload) => {
  try {
    const name = escapeInput(payload.name || '');
    const last_name = escapeInput(payload.last_name || '');
    const email = (payload.email || '').toLowerCase().trim();
    const phone = escapeInput(payload.phone || '');
    const password = payload.password || '';
    const id_rol = payload.id_rol || 2;

    if (!name) throw { status: 400, message: 'El nombre es requerido' };
    if (!email) throw { status: 400, message: 'El correo es requerido' };
    if (!password) throw { status: 400, message: 'La contraseña es requerida' };

    if (!validator.isEmail(email)) throw { status: 400, message: 'El correo no tiene un formato válido' };
    if (!isStrongPassword(password)) throw { status: 400, message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' };

    const existing = await getUserByEmail(email);
    if (existing) {
      throw { status: 409, message: 'El correo ya está registrado' };
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const result = await createUser({ id_rol, name, last_name: last_name || null, email, phone: phone || null, password: hashed, state_user: 1 });
    // generate token for the newly created user
    const userPayload = { id_user: result.insertId, id_rol, name, last_name, email, phone, state_user: 1 };
    const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1h' });
    return { insertId: result.insertId, email, token };
  } catch (err) {
    if (err && err.status && err.message) throw err;
    console.error('Service register error:', err);
    throw { status: 500, message: 'Error interno al registrar usuario' };
  }
};
