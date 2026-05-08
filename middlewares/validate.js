const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email та пароль є обов\'язковими полями.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Некоректний формат email адреси.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль має містити щонайменше 6 символів.' });
  }

  next();
};

module.exports = {
  validateAuth
};