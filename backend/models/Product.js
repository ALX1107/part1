// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'unidad' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
