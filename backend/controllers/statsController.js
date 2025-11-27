// controllers/statsController.js
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// GET /api/stats/sales-by-product
const getSalesByProduct = async (req, res) => {
  try {
    const pipeline = [
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.nombre',
          totalCantidad: { $sum: '$items.cantidad' },
          revenue: {
            $sum: { $multiply: ['$items.cantidad', '$items.precio'] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          nombre: '$_id',
          totalCantidad: 1,
          revenue: 1
        }
      },
      { $sort: { totalCantidad: -1 } }
    ];

    const results = await Sale.aggregate(pipeline);
    return res.json(results);
  } catch (error) {
    console.error('Error al obtener ventas por producto:', error);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
};

// POST /api/stats/sales
const createSale = async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: 'Items de la venta son requeridos' });
    }

    const saleData = {
      items,
      total,
      usuarioId: req.user ? req.user._id : undefined,
      usuario: req.user ? req.user.nombre || req.user.correo : 'Invitado'
    };

    const sale = await Sale.create(saleData);

    // Actualizar inventario: restar stock por nombre de producto
    for (const item of items) {
      await Product.findOneAndUpdate(
        { nombre: item.nombre },
        { $inc: { stock: -item.cantidad } },
        { new: true }
      );
    }

    return res.status(201).json({
      msg: 'Venta registrada y stock actualizado',
      sale
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
};

module.exports = { getSalesByProduct, createSale };
