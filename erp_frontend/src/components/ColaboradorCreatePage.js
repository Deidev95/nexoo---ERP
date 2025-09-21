import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ColaboradorCreatePage = () => {
    // Estado para guardar los datos del formulario
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
        estado_empleado: 'ACTIVO', // Valor por defecto
        cargo: '', // Guardaremos el ID del cargo
        sede: ''   // Guardaremos el ID de la sede
    });

    // Estados para guardar las listas de cargos y sedes
    const [cargos, setCargos] = useState([]);
    const [sedes, setSedes] = useState([]);
    
    // Hook para la navegación
    const navigate = useNavigate();

    // Efecto para cargar cargos y sedes cuando el componente se monta
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('access');
            const config = {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            };
            try {
                const [cargosRes, sedesRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/cargos/', config),
                    axios.get('http://localhost:8000/api/sedes/', config)
                ]);
                setCargos(cargosRes.data);
                setSedes(sedesRes.data);
            } catch (error) {
                console.error("Error al cargar cargos o sedes:", error);
            }
        };
        fetchData();
    }, []);


    // Manejador para cambios en los inputs del formulario
    const handleChange = (e) => {
        setColaborador({
            ...colaborador,
            [e.target.name]: e.target.value
        });
    };

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('access');
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            await axios.post('http://localhost:8000/api/colaboradores/', colaborador, config);
            // Redirigir a la lista de colaboradores después de la creación exitosa
            navigate('/rrhh/colaboradores');
        } catch (error) {
            console.error("Hubo un error al crear el colaborador:", error.response.data);
            // Aquí se podra mostrar un mensaje de error al usuario
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Crear Nuevo Colaborador</h1>
            <form onSubmit={handleSubmit}>
                {/* Usamos un div como grid simple para el layout */}
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
                <button type="submit">Guardar Colaborador</button>
            </form>
        </div>
    );
};

export default ColaboradorCreatePage;