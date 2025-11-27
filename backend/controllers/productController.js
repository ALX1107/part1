// controllers/productController.js
const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ stock: -1, nombre: 1 });
    res.json(products);
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ msg: 'Error al obtener productos' });
  }
};

// POST /api/products (opcional, solo admin)
const createProduct = async (req, res) => {
  try {
    const { nombre, costo, stock, unit } = req.body;
    const product = await Product.create({ nombre, costo, stock, unit });
    res.status(201).json(product);
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ msg: 'Error al crear producto' });
  }
};

module.exports = { getProducts, createProduct };
