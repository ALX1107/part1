// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';

function Register() {
  const { user, hasRole, registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    edad: '',
    correo: '',
    contraseña: '',
    rol: 'Employee',
  });
  const [pwStrength, setPwStrength] = useState({ score: 0, label: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Solo Admin puede crear usuarios
  if (!user || !hasRole('Admin')) {
    return (
      <div
        className="form-container"
        style={{
          backgroundColor: 'var(--container-color-2)',
          color: 'white',
          margin: '50px auto',
        }}
      >
        <h2>Acceso Denegado</h2>
        <p>Solo los administradores pueden crear nuevos usuarios.</p>
        <button onClick={() => navigate('/products')}>Volver a Productos</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'contraseña') {
      setPwStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = (data) => {
    if (!data.nombre.trim()) return 'El nombre es obligatorio.';
    if (!data.apellidos.trim()) return 'Los apellidos son obligatorios.';
    if (!data.correo.trim()) return 'El correo es obligatorio.';
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(data.correo)) return 'El correo no es válido.';
    if (!data.contraseña || data.contraseña.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres.';
    const strength = checkPasswordStrength(data.contraseña);
    if (strength.label === 'Débil') return 'La contraseña es demasiado débil.';
    if (
      data.edad &&
      (!Number.isInteger(Number(data.edad)) || Number(data.edad) <= 0)
    )
      return 'La edad debe ser un número entero positivo.';
    if (!['Employee', 'Admin'].includes(data.rol)) return 'Rol inválido.';
    return null;
  };

  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: '' };
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    let label = 'Débil';
    if (score >= 3) label = 'Fuerte';
    else if (score === 2) label = 'Intermedio';
    return { score, label };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(formData);
      setMessage(`Usuario ${data.nombre} (${data.rol}) creado con éxito.`);
      setFormData({
        nombre: '',
        apellidos: '',
        edad: '',
        correo: '',
        contraseña: '',
        rol: 'Employee',
      });
    } catch (err) {
      setError(err.message || 'Error al crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ margin: '0 auto', maxWidth: 520 }}>
      <h1>👤 Crear Nuevo Usuario</h1>
      <p style={{ marginBottom: '12px' }}>
        Rol actual: <strong>{user.rol}</strong>
      </p>

      {message && (
        <div className="success" style={{ marginBottom: '10px' }}>
          {message}
        </div>
      )}
      {error && (
        <div
          className="error"
          style={{ marginBottom: '10px', color: 'salmon' }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <Input
          label="Apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          placeholder="Apellidos"
        />
        <Input
          label="Edad"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          placeholder="Edad"
          type="number"
        />
        <Input
          label="Correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          type="email"
        />
        <Input
          label="Contraseña"
          name="contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          placeholder="Contraseña"
          type="password"
        />

        <div style={{ marginTop: 6, marginBottom: 8 }}>
          <div
            style={{
              height: 8,
              background: '#eee',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(pwStrength.score / 4) * 100}%`,
                height: '100%',
                background:
                  pwStrength.score >= 3
                    ? 'green'
                    : pwStrength.score === 2
                    ? 'orange'
                    : 'salmon',
              }}
            />
          </div>
          <small style={{ color: '#555' }}>
            Fuerza: {pwStrength.label || '—'}
          </small>
        </div>

        <div className="input-group">
          <label>Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="styled-input"
          >
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creando...' : 'Crear usuario'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-secondary"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
