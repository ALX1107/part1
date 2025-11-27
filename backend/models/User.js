// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    edad: { type: Number },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
