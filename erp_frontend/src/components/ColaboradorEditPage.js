import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ColaboradorEditPage = () => {
    const { id } = useParams(); // Obtiene el ID del colaborador a editar
    const [colaborador, setColaborador] = useState({
        cedula: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        fecha_nacimiento: '',
        correo_personal: '',
        telefono: '',
        fecha_ingreso: '',
        estado_empleado: 'ACTIVO',
        cargo: '',
        sede: ''
    });

    const [cargos, setCargos] = useState([]);
    const [sedes, setSedes] = useState([]);
    const navigate = useNavigate();

    // Efecto para cargar los datos del colaborador y las listas de cargos/sedes
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('access');
            const config = {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            };
            try {
                // Hacemos todas las peticiones en paralelo
                const [colaboradorRes, cargosRes, sedesRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/colaboradores/${id}/`, config),
                    axios.get('http://localhost:8000/api/cargos/', config),
                    axios.get('http://localhost:8000/api/sedes/', config)
                ]);

                // Poblamos el estado del formulario con los datos del colaborador
                setColaborador(colaboradorRes.data);
                setCargos(cargosRes.data);
                setSedes(sedesRes.data);

            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setColaborador({
            ...colaborador,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
        try {
            // Usamos el método PUT para actualizar el recurso completo
            await axios.put(`http://localhost:8000/api/colaboradores/${id}/`, colaborador, config);
            navigate(`/rrhh/colaboradores/${id}`); // Redirigir al perfil del colaborador
        } catch (error) {
            console.error("Hubo un error al actualizar el colaborador:", error.response.data);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Editar Colaborador</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input name="cedula" value={colaborador.cedula} onChange={handleChange} placeholder="Cédula" required />
                    <input name="primer_nombre" value={colaborador.primer_nombre} onChange={handleChange} placeholder="Primer Nombre" required />
                    <input name="segundo_nombre" value={colaborador.segundo_nombre} onChange={handleChange} placeholder="Segundo Nombre" />
                    <input name="primer_apellido" value={colaborador.primer_apellido} onChange={handleChange} placeholder="Primer Apellido" required />
                    <input name="segundo_apellido" value={colaborador.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido" />
                    <input name="telefono" value={colaborador.telefono} onChange={handleChange} placeholder="Teléfono" />
                    <input name="correo_personal" type="email" value={colaborador.correo_personal} onChange={handleChange} placeholder="Correo Personal" required />
                    <div>
                        <label>Fecha de Nacimiento: </label>
                        <input name="fecha_nacimiento" type="date" value={colaborador.fecha_nacimiento} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Fecha de Ingreso: </label>
                        <input name="fecha_ingreso" type="date" value={colaborador.fecha_ingreso} onChange={handleChange} required />
                    </div>
                    <select name="cargo" value={colaborador.cargo} onChange={handleChange} required>
                        <option value="">Selecciona un Cargo</option>
                        {cargos.map(cargo => (
                            <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
                        ))}
                    </select>
                    <select name="sede" value={colaborador.sede} onChange={handleChange} required>
                        <option value="">Selecciona una Sede</option>
                        {sedes.map(sede => (
                            <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                        ))}
                    </select>
                </div>
                <br />
                <button type="submit">Actualizar Colaborador</button>
            </form>
        </div>
    );
};

export default ColaboradorEditPage;