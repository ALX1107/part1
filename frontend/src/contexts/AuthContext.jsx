// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate();

  // LOGIN
  const login = async (correo, contraseña, captcha = null) => {
    try {
      const payload = { correo, contraseña };

      if (captcha && captcha.id) {
        payload.captchaId = captcha.id;
        payload.captchaValue = captcha.value;
      }

      const response = await axios.post(`${API_URL}/api/auth/login`, payload);

      const userData = {
        id: response.data.id,
        nombre: response.data.nombre,
        correo: response.data.correo,
        rol: response.data.rol,
        token: response.data.token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/products');
      return true;

    } catch (error) {
      const msg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        'Error al conectar con el servidor.';
      throw new Error(msg);
    }
  };

  // REGISTER (solo Admin)
  const registerUser = async (formData) => {
    const token = user?.token;
    if (!token) throw new Error('Token inválido: requiere rol administrador.');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formData, config);
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) logout();
      const msg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        'Error al registrar usuario.';
      throw new Error(msg);
    }
  };

  // LOGOUT
  const logout = () => {
    const token = user?.token;

    try {
      if (token) {
        fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch (e) {}

    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const hasRole = (requiredRole) => user && user.rol === requiredRole;

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      hasRole,
      isLoggedIn: !!user,
      registerUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
