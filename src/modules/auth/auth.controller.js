const authService = require('./auth.service');

exports.login = (req, res) => {
  const { email, password } = req.body;

  authService
    .login(email, password)
    .then(({ role, token }) => {
      if (!token || !role) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      res.json({ success: true, message: 'Success!', role, token });
    })
    .catch(err => {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    });
};

exports.getProfile = (req, res) => {
  res.json({ username: 'jobbi_user', email: 'user@jobbi.com' });
};

exports.register = async (req, res) => {
  try {
    const payload = req.body;
    const result = await authService.register(payload);
    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: { id_user: result.insertId, email: result.email },
      token: result.token
    });
  } catch (err) {
    console.error('Controller register error:', err);
    const status = (err && err.status) || 500;
    const message = (err && err.message) || 'Error en el servidor';
    return res.status(status).json({ success: false, message });
  }
};
