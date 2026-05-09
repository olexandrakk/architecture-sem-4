const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Неавторизований доступ. Токен відсутній.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secretKey = process.env.JWT_SECRET || 'secret-key-fallback';
    const decodedPayload = jwt.verify(token, secretKey);
    req.user = decodedPayload;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Токен недійсний або прострочений.' });
  }
};
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    return res.status(403).json({ error: 'Доступ заборонено. Вимагаються права адміністратора.' });
  }
};
module.exports = {
  authenticateToken,
  isAdmin
};