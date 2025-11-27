// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, hasRole, logout } = useAuth();

  if (!user) {
    // No renderizar si el usuario no está logueado
    return null;
  }

  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Estilos basados en tus especificaciones
  const navStyle = {
    backgroundColor: 'var(--container-color-1)', // #73d1b4
    padding: '15px 50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const linkStyle = {
    color: 'var(--text-dark)',
    textDecoration: 'none',
    margin: '0 15px',
    fontWeight: 'bold',
    fontSize: '18px',
    fontFamily: 'var(--font-display)',
  };

  const buttonStyle = {
    backgroundColor: 'var(--container-color-2)', // #ee4242
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  };

  const handleDownloadReport = async () => {
    try {
      const token = user.token;
      const res = await fetch(`${API}/api/reports/access-logs/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error descargando PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'access_logs.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('No se pudo descargar el reporte.');
    }
  };

  return (
    <nav style={navStyle}>
      {/* Sección Izquierda: Logo y Navegación */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🍰 Pastelería Admin</h1>

        <Link to="/products" style={linkStyle}>
          Ventas y Productos
        </Link>

        {/* Enlace Condicional: Solo visible si el usuario es 'Admin' */}
        {hasRole('Admin') && (
          <>
            <Link to="/register" style={linkStyle}>
              Crear Usuario
            </Link>
            <button
              onClick={handleDownloadReport}
              style={{ ...linkStyle, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Descargar Reporte
            </button>
          </>
        )}
      </div>

      {/* Sección Derecha: Información de Usuario y Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>
          {user.nombre} ({user.rol})
        </span>
        <button onClick={logout} style={buttonStyle}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
