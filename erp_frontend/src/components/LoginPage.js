// src/components/LoginPage.js

import React, { useState, useEffect } from 'react'; // <-- Se importa useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // NUEVO: Estado para el checkbox "Recordarme"
    const [rememberMe, setRememberMe] = useState(false);
    
    const navigate = useNavigate();

    // NUEVO: useEffect para leer el usuario guardado al cargar la página
    useEffect(() => {
        const savedUser = localStorage.getItem('rememberedUser');
        if (savedUser) {
            setUsername(savedUser);
            setRememberMe(true);
        }
    }, []); // El array vacío asegura que esto solo se ejecute una vez, al montar el componente

    const handleSubmit = async (event) => {
        event.preventDefault();

        // NUEVO: Lógica para guardar o borrar el usuario
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password,
            });
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error en el login:', error);
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="login-page-container">
            {/* ... Panel izquierdo (sin cambios) ... */}
            <div className="left-panel">
                <div className="left-panel-content">
                    <h1>¡Bienvenido a Nexoo!</h1>
                    <p>Tu empresa, todo en un solo lugar.</p>
                </div>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
            </div>

            {/* ===== PANEL DERECHO ===== */}
            <div className="right-panel">
                <div className="login-card">
                    <div className="text-center mb-4">
                        <img src="/logo.png" alt="NexoERP Logo" style={{ height: '30px'}} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* ... Input de usuario (sin cambios) ... */}
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* ... Input de contraseña (sin cambios) ... */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                    <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                                </span>
                            </div>
                        </div>

                        {/* --- Checkbox "Recordarme" MODIFICADO --- */}
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe} // Conectado al estado
                                onChange={(e) => setRememberMe(e.target.checked)} // Conectado al manejador
                            />
                            <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
                        </div>

                        {/* ... Botón y texto de privacidad (sin cambios) ... */}
                        <div className="d-grid mb-1">
                            <button type="submit" className="btn btn-nexo">Ingresar</button>
                        </div>
                        <div className="text-center mt-3">
                            <small>
                                Al ingresar aceptas nuestra <a href="#" className="link-primary">Política de Privacidad</a>.
                            </small>
                        </div>
                    </form>
                </div>
                <div className="version-info">
                    <small className="text-muted">V 1.0.0 © 2025 NexoERP</small>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;