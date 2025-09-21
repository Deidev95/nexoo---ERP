import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ColaboradorProfilePage = () => {
    const [colaborador, setColaborador] = useState(null);
    const [history, setHistory] = useState([]);
    const { id } = useParams(); // Obtiene el ID de la URL
    const navigate = useNavigate(); // Hook para redirigir

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('access');
            const config = {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            };
            try {
                // hacemos ambas peticiones en paralelo
                const [colaboradorRes, historyRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/colaboradores/${id}/`, config),
                    axios.get(`http://localhost:8000/api/colaboradores/${id}/historial/`, config)
                ]);

                setColaborador(colaboradorRes.data);
                setHistory(historyRes.data); // <-- 3. GUARDAMOS EL HISTORIAL EN EL ESTADO
            } catch (error) {
                console.error("Error al cargar los datos del colaborador:", error);
            }
        };
        fetchData();
    }, [id]);

    // --- LÓGICA DE ELIMINACIÓN ---
    const handleDelete = async () => {
        // Pedimos confirmación antes de una acción destructiva
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este colaborador?");
        
        if (isConfirmed) {
            const accessToken = localStorage.getItem('access');
            const config = {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            };
            try {
                await axios.delete(`http://localhost:8000/api/colaboradores/${id}/`, config);
                alert("Colaborador eliminado con éxito.");
                navigate('/rrhh/colaboradores'); // Redirigir a la lista
            } catch (error) {
                console.error("Error al eliminar el colaborador:", error);
                alert("Hubo un error al eliminar el colaborador.");
            }
        }
    };

    if (!colaborador) {
        return <div>Cargando...</div>;
    }

    // Función para traducir el tipo de cambio realizado
    const getHistoryTypeLabel = (type) => {
        if (type === '+') return 'Creado';
        if (type === '~') return 'Actualizado';
        if (type === '-') return 'Eliminado';
        return type;
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

            {/* Columna Izquierda: Información del perfil */}
            <div style={{ flex: 1, minWidth: '350px' }}>

                <Link to="/rrhh/colaboradores">Volver al listado</Link> 

                <h1>Perfil de {colaborador.primer_nombre} {colaborador.segundo_nombre} {colaborador.primer_apellido} {colaborador.segundo_apellido}</h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>

                <div>
                    <p><strong>Cédula:</strong></p> 
                    <p>{colaborador.cedula}</p>
                </div>

                <div>
                    <p><strong>Fecha de Nacimiento:</strong></p> 
                    <p>{colaborador.fecha_nacimiento}</p>
                </div>

                <div>
                    <p><strong>Correo Personal:</strong></p> 
                    <p>{colaborador.correo_personal}</p>
                </div>

                <div>
                    <p><strong>Telefono:</strong></p> 
                    <p>{colaborador.telefono || 'No registrado'}</p>
                </div>

                <div>
                    <p><strong>Cargo</strong></p>
                    <p>{colaborador.cargo}</p>
                </div>

                <div>
                    <p><strong>Sede</strong></p>
                    <p>{colaborador.sede}</p>
                </div>

                <div>
                    <p><strong>Fecha de Ingreso:</strong></p> 
                    <p>{colaborador.fecha_ingreso}</p>
                </div>

                <div>
                    <p><strong>Estado del Empleado:</strong></p>
                    <p>{colaborador.estado_empleado}</p>
                </div>

                {/* Mostramos la fecha de desvinculación solo si existe */}
                {colaborador.fecha_desvinculacion && (
                        <div>
                            <p><strong>Fecha de Desvinculación:</strong></p>
                            <p>{colaborador.fecha_desvinculacion}</p>
                        </div>
                    )}

            </div>

                {/* --- BOTONES DE ACCIÓN --- */}
                <div style={{ marginTop: '1.5rem' }}>
                    <Link to={`/rrhh/colaboradores/${id}/editar`}>
                        <button style={{ marginRight: '1rem' }}>Editar Colaborador</button>
                    </Link>
                    <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                        Eliminar Colaborador
                    </button>
                </div>
            </div>

            {/* Columna Derecha: Historial de Cambios */}
            <div style={{minWidth: '300px'}}>
                <h2>Historial de Cambios</h2>
                {history.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {history.map(record => (
                            <li key={record.history_id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                                <p><strong>Tipo:</strong> {getHistoryTypeLabel(record.history_type)}</p>
                                <p><strong>Fecha:</strong> {new Date(record.history_date).toLocaleString()}</p>
                                <p><strong>Usuario:</strong> {record.history_user || 'Sistema'}</p>

                                {/* Mostramos los detalles si el campo 'changes' tiene contenido */}
                                {record.changes && (
                                    <p style={{ color: '#555', fontStyle: 'italic' }}>
                                        <strong>Detalle:</strong> {record.changes}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #ddd',
                        padding: '10px',
                        borderRadius: '5px',
                        color: '#666',
                    }}>
                    No hay historial de cambios para este colaborador.
                    </p>
                )}
            </div>  
        </div>
    );
};

export default ColaboradorProfilePage;