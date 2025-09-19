const authService = require('./auth.service');

exports.login = (req, res) => {
  const { email, password } = req.body;

  authService
    .login(email, password)
    .then(token => {
      if (!token) {
        return res.status(401).json({ succes: false, message: "Invalid credentials" });
      }
      res.json({ succes: true, message: "Succes!", token });
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    });
};

exports.getProfile = (req, res) => {
  res.json({ username: 'jobbi_user', email: 'user@jobbi.com' });
};
