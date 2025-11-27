
import React from 'react';
// 🚨 Asegúrate de importar Navigate para la redirección
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // 🚨 Debes importar useAuth
import AppLayout from './components/AppLayout';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';

// --------------------------------------------------------------------
// 🚨 PASO CLAVE 1: Definir el componente que maneja la ruta raíz (/)
// --------------------------------------------------------------------
const InitialRedirect = () => {
    const { isLoggedIn } = useAuth();
    
    // Si está logueado, redirige al dashboard. Si no, al Login.
    return isLoggedIn ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      {/* El AuthProvider debe envolver todo para que useAuth funcione */}
      <AuthProvider> 
        <Routes>
          {/* RUTA 1: Login (Pública) */}
          <Route path="/login" element={<Login />} />
          
          {/* RUTA 2: La ruta raíz (/) usa el componente de redirección */}
          <Route path="/" element={<InitialRedirect />} />
          
          {/* RUTA 3: Rutas Protegidas (Requieren AppLayout con Navbar y protecciones internas) */}
          <Route element={<AppLayout />}>
            {/* Solo se accede si ya pasaste la redirección y estás logueado */}
            <Route path="/products" element={<Products />} /> 
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 - No Encontrado</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;