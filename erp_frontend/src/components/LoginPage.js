import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Usa el hook useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password,
            });

            // Guarda los tokens en el almacenamiento local
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);

            console.log('Login exitoso:', response.data);
            // Redirige al dashboard después del login exitoso
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Error en el login:', error);
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;