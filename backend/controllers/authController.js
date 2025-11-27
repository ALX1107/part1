// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const User = require('../models/User');

const captchaStore = new Map();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '1d',
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    console.log('🟢 Body recibido en /api/auth/login:', req.body);

    // 1) LEER DATOS QUE VIENEN DEL FRONT
    const correo = req.body.correo || req.body.email;
    const contraseña = req.body.contraseña || req.body.password;
    const { captchaId, captchaValue } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ msg: 'Correo y contraseña son requeridos' });
    }

    // 2) CAPTCHA (solo si está guardado en memoria)
    if (captchaId && captchaStore.has(captchaId)) {
      const real = captchaStore.get(captchaId);
      if (!captchaValue || captchaValue.toLowerCase() !== real.toLowerCase()) {
        return res.status(400).json({ msg: 'Captcha incorrecto' });
      }
      captchaStore.delete(captchaId);
    }

    // 3) BUSCAR USUARIO EN LA BD (aceptar correo o email)
    const user = await User.findOne({
      $or: [{ correo }, { email: correo }],
    });

    console.log('👀 Usuario encontrado en BD:', user ? user.correo || user.email : null);

    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas (usuario)' });
    }

    // 4) TOMAR HASH DE CONTRASEÑA (aceptar contraseña o password en el modelo)
    const hash = user.contraseña || user.password;
    console.log('🔍 Hash guardado en BD:', hash);
    if (!hash) {
      console.error('⚠ El usuario en BD no tiene campo contraseña/password');
      return res
        .status(500)
        .json({ msg: 'Configuración incorrecta de usuario en BD (contraseña faltante)' });
    }

    const isMatch = await bcrypt.compare(contraseña, hash);
    console.log('🔑 Contraseña válida:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas (contraseña)' });
    }

    // 5) GENERAR TOKEN
    const token = generateToken(user._id);

    return res.json({
      id: user._id,
      nombre: user.nombre,
      correo: user.correo || user.email,
      rol: user.rol,
      token,
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
};

// GET /api/auth/captcha
const getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: '#ffffff',
  });

  const id = Date.now().toString() + Math.random().toString(16).slice(2);
  captchaStore.set(id, captcha.text);

  return res.json({ id, data: captcha.data });
};

const register = async (req, res) => {
  res.status(501).json({ msg: 'register no implementado en esta demo' });
};

const logout = async (req, res) => {
  return res.json({ msg: 'Logout OK' });
};

module.exports = { login, register, logout, getCaptcha };
