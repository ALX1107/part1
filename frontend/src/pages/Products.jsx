import React, { useState, useEffect, useCallback } from 'react';
import ProductList from '../components/ProductList';
import { mockProducts } from '../mockData';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [chartRows, setChartRows] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // 🔁 Cargar productos desde la BD (con mock como fallback)
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fallo al cargar productos desde backend, usando mock:', err);
      setProducts(mockProducts);
    }
  }, [API]);

  // 📊 Cargar estadísticas de ventas para la gráfica
  const fetchSalesStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/stats/sales-by-product`);
      if (!res.ok) throw new Error('Error al obtener estadísticas de ventas');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setChartRows(data);
      } else {
        setChartRows([]);
      }
    } catch (err) {
      console.error('No se pudieron obtener estadísticas de ventas:', err);
      setChartRows([]);
    }
  }, [API]);

  // ⏱ Cargar datos al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchSalesStats();
  }, [fetchProducts, fetchSalesStats]);

  // 🛒 Carrito simple (solo para log o futuras mejoras)
  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    console.log('Añadido al carrito:', product.nombre);
  };

  // 🔁 Cuando se complete una venta, recargamos productos + stats desde la BD
  const handleSaleCompleted = () => {
    fetchProducts();
    fetchSalesStats();
  };

  // 🔎 Filtro + orden por stock (de mayor a menor)
  const normalizedSearch = searchTerm.toLowerCase();
  const filteredProducts = [...products]
    .filter((p) =>
      !normalizedSearch
        ? true
        : (p.nombre || '').toLowerCase().includes(normalizedSearch)
    )
    .sort((a, b) => (b.stock || 0) - (a.stock || 0));

  // 📊 Datos para la gráfica
  const hasSalesStats = chartRows && chartRows.length > 0;
  const labels = hasSalesStats
    ? chartRows.map((r) => r.nombre)
    : products.map((p) => p.nombre);
  const dataValues = hasSalesStats
    ? chartRows.map((r) => r.totalCantidad || 0)
    : products.map((p) => p.stock || 0);
  const datasetLabel = hasSalesStats ? 'Cantidad vendida' : 'Stock actual';

  const chartData = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: dataValues,
        backgroundColor: 'rgba(115, 209, 180, 0.8)'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: hasSalesStats ? 'Ventas por producto' : 'Stock por producto'
      }
    }
  };

  return (
    <div>
      <h1>Productos</h1>

      {/* Buscador */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: 8,
            minWidth: 280,
            borderRadius: 6,
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* Gráfica */}
      <div style={{ maxWidth: 800, marginBottom: 20 }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Inventario + carrito, todo sincronizado con la BD */}
      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        onSaleCompleted={handleSaleCompleted}
      />
    </div>
  );
};

export default Products;
