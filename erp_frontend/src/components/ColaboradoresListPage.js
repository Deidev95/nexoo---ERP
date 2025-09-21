import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ColaboradoresListPage = () => {
    const [colaboradores, setColaboradores] = useState([]);

    useEffect(() => {
        const fetchColaboradores = async () => {
            try {
                const accessToken = localStorage.getItem('access');
                
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };

                const response = await axios.get('http://localhost:8000/api/colaboradores/', config);
                setColaboradores(response.data);
            } catch (error) {
                console.error("Hubo un error al obtener los colaboradores:", error);
            }
        };

        fetchColaboradores();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Listado de Colaboradores</h1>

            <Link to="/rrhh/colaboradores/crear" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                <button>Crear Nuevo Colaborador</button> 
            </Link>

            <ul>
                {colaboradores.map(colaborador => (
                    <li key={colaborador.id}> {/* Cambiado a key={colaborador.id} */}
                        <Link to={`/rrhh/colaboradores/${colaborador.id}`}>
                            {colaborador.primer_nombre} {colaborador.primer_apellido}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ColaboradoresListPage;