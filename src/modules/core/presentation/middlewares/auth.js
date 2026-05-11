const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Неавторизований доступ. Токен відсутній.' });
  }

  const headerValue = authHeader.trim();
  if (!headerValue.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Неавторизований доступ. Токен відсутній.' });
  }

  const rawToken = headerValue.slice(7);
  const token = rawToken.replace(/(^["']|["']$)/g, '').replace(/\s+/g, '');
  if (!token) {
    return res.status(401).json({ error: 'Неавторизований доступ. Токен відсутній.' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'super-secret-key-for-cinema-api';
    const decodedPayload = jwt.verify(token, secretKey);
    req.user = decodedPayload;
    
    next();
  } catch (error) {
    console.error('JWT verify error:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Токен прострочений.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Токен недійсний.', message: error.message });
    }
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