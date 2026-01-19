import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import { 
    Box, 
    Paper, 
    Typography, 
    Grid, 
    TextField, 
    Button, 
    MenuItem, 
    Divider,
    CircularProgress
} from '@mui/material';

// Íconos
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const ColaboradorEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado inicial
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            try {
                // 1. Obtenemos toda la data en paralelo
                const [colRes, cargosRes, sedesRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/colaboradores/${id}/`, config),
                    axios.get('http://localhost:8000/api/cargos/', config),
                    axios.get('http://localhost:8000/api/sedes/', config)
                ]);

                const colData = colRes.data;
                const listaCargos = cargosRes.data;
                const listaSedes = sedesRes.data;

                // 2. LOGICA INTELIGENTE: Mapear Nombres a IDs
                // Como el backend nos devuelve "Bogotá" (texto), buscamos qué ID tiene "Bogotá" en la lista.
                const cargoObj = listaCargos.find(c => c.nombre === colData.cargo);
                const sedeObj = listaSedes.find(s => s.nombre === colData.sede);

                setColaborador({
                    ...colData,
                    // Si encontramos el objeto, usamos su ID. Si no, dejamos cadena vacía.
                    cargo: cargoObj ? cargoObj.id : '',
                    sede: sedeObj ? sedeObj.id : ''
                });

                setCargos(listaCargos);
                setSedes(listaSedes);
                setLoading(false);

            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setLoading(false);
                Swal.fire('Error', 'No se pudieron cargar los datos del colaborador', 'error');
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
            await axios.put(`http://localhost:8000/api/colaboradores/${id}/`, colaborador, config);
            
            // Alerta Bonita de Éxito
            Swal.fire({
                title: '¡Actualizado!',
                text: 'La información del colaborador ha sido actualizada.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1e293b',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/rrhh/colaboradores/${id}`); // Volver al perfil
                }
            });

        } catch (error) {
            console.error("Error al actualizar:", error.response?.data);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar. Verifica los datos.',
                icon: 'error',
                confirmButtonColor: '#d32f2f'
            });
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate(`/rrhh/colaboradores/${id}`)}
                    sx={{ color: 'text.secondary', mr: 2, textTransform: 'none' }}
                >
                    Cancelar
                </Button>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    Editar Colaborador
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <form onSubmit={handleSubmit}>
                    
                    {/* --- SECCIÓN 1: DATOS PERSONALES --- */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Datos de Identificación
                        </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField 
                                fullWidth size="small" label="Cédula" name="cedula" 
                                value={colaborador.cedula} onChange={handleChange} required 
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField 
                                fullWidth size="small" type="date" label="Fecha de Nacimiento" name="fecha_nacimiento" 
                                value={colaborador.fecha_nacimiento} onChange={handleChange} required 
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}></Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth size="small" label="Primer Nombre" name="primer_nombre" 
                                value={colaborador.primer_nombre} onChange={handleChange} required 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth size="small" label="Segundo Nombre" name="segundo_nombre" 
                                value={colaborador.segundo_nombre || ''} onChange={handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth size="small" label="Primer Apellido" name="primer_apellido" 
                                value={colaborador.primer_apellido} onChange={handleChange} required 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth size="small" label="Segundo Apellido" name="segundo_apellido" 
                                value={colaborador.segundo_apellido || ''} onChange={handleChange} 
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3, opacity: 0.5 }} />

                    {/* --- SECCIÓN 2: CONTACTO --- */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ContactMailIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Información de Contacto
                        </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth size="small" type="email" label="Correo Personal" name="correo_personal" 
                                value={colaborador.correo_personal} onChange={handleChange} required 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth size="small" label="Teléfono / Celular" name="telefono" 
                                value={colaborador.telefono || ''} onChange={handleChange} 
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3, opacity: 0.5 }} />

                    {/* --- SECCIÓN 3: DATOS LABORALES --- */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WorkIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Vinculación Laboral
                        </Typography>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField 
                                fullWidth size="small" type="date" label="Fecha de Ingreso" name="fecha_ingreso" 
                                value={colaborador.fecha_ingreso} onChange={handleChange} required 
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                select 
                                fullWidth 
                                size="small" 
                                label="Cargo" 
                                name="cargo"
                                value={colaborador.cargo} 
                                onChange={handleChange} 
                                required
                            >
                                {cargos.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                select 
                                fullWidth 
                                size="small" 
                                label="Sede" 
                                name="sede"
                                value={colaborador.sede} 
                                onChange={handleChange} 
                                required
                            >
                                {sedes.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        
                        {/* Campo adicional para Estado (solo editable aquí) */}
                        <Grid item xs={12} sm={4}>
                             <TextField
                                select 
                                fullWidth 
                                size="small" 
                                label="Estado del Empleado" 
                                name="estado_empleado"
                                value={colaborador.estado_empleado} 
                                onChange={handleChange} 
                                required
                            >
                                <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                                <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                                <MenuItem value="LICENCIA">LICENCIA</MenuItem>
                            </TextField>
                        </Grid>
                        
                        {/* Campo condicional: Fecha de retiro */}
                         {colaborador.estado_empleado === 'INACTIVO' && (
                            <Grid item xs={12} sm={4}>
                                <TextField 
                                    fullWidth size="small" type="date" label="Fecha de Retiro" name="fecha_desvinculacion" 
                                    value={colaborador.fecha_desvinculacion || ''} onChange={handleChange} 
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                         )}

                    </Grid>

                    {/* Botón de Actualizar */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disableElevation
                            startIcon={<EditIcon />}
                            sx={{ px: 4, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Actualizar Datos
                        </Button>
                    </Box>

                </form>
            </Paper>
        </Box>
    );
};

export default ColaboradorEditPage;