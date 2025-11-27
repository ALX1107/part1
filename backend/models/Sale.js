// models/Sale.js
const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },   // 👈 OJO: type: Number
    precio: { type: Number, required: true }      // 👈 OJO: type: Number
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    items: { type: [saleItemSchema], required: true },
    total: { type: Number, required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usuario: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
