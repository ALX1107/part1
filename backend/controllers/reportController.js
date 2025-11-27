// controllers/reportController.js
const getAccessLogsPdf = async (req, res) => {
  try {
    const content = `
      Reporte de accesos
      Usuario: ${req.user ? req.user.nombre : 'Desconocido'}
      Fecha: ${new Date().toLocaleString()}
    `;

    const buffer = Buffer.from(content, 'utf-8');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="access_logs.pdf"');
    return res.send(buffer);
  } catch (err) {
    console.error('Error al generar PDF:', err);
    return res.status(500).json({ msg: 'Error al generar reporte' });
  }
};

module.exports = { getAccessLogsPdf };
