// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    console.log('🔐 Header Authorization recibido:', req.headers.authorization);
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No autorizado: Token requerido' });
    }
    const token = auth.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-contraseña');
    if (!user) return res.status(401).json({ msg: 'Usuario no encontrado' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Error en protect:', err.message);
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'Admin') {
    return res.status(403).json({ msg: 'Solo administradores pueden realizar esta acción' });
  }
  next();
};

module.exports = { protect, requireAdmin };
