import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    Box, 
    Paper, 
    Typography, 
    Grid, 
    TextField, 
    Button, 
    MenuItem, 
    Divider 
} from '@mui/material';

// Íconos
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const ColaboradorCreatePage = () => {
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

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            try {
                const [cargosRes, sedesRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/cargos/', config),
                    axios.get('http://localhost:8000/api/sedes/', config)
                ]);
                setCargos(cargosRes.data);
                setSedes(sedesRes.data);
            } catch (error) {
                console.error("Error al cargar listas:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setColaborador({
            ...colaborador,
            [e.target.name]: e.target.value
        });
    };

    // Reemplaza tu función handleSubmit con esta lógica:
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            
            await axios.post('http://localhost:8000/api/colaboradores/', colaborador, config);
            
            // --- INICIO DEL CAMBIO ---
            // Lanzamos la alerta bonita (SweetAlert2)
            Swal.fire({
                title: '¡Excelente!',
                text: 'Colaborador incluido con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1e293b', // Usamos el color de tu tema
            }).then((result) => {
                // Solo redirigimos cuando el usuario hace clic en Aceptar
                if (result.isConfirmed) {
                    navigate('/rrhh/colaboradores/listado');
                }
            });
            // --- FIN DEL CAMBIO ---

        } catch (error) {
            console.error("Error al crear:", error.response?.data);
            // También ponemos bonita la alerta de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al crear el colaborador. Revisa los datos.',
                icon: 'error',
                confirmButtonColor: '#d32f2f'
            });
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate('/rrhh/colaboradores')}
                    sx={{ color: 'text.secondary', mr: 2, textTransform: 'none' }}
                >
                    Cancelar
                </Button>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    Nuevo Ingreso de Personal
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

                    {/* Usamos spacing={2} para que estén más juntos (minimalista) */}
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
                        {/* Espacio vacío para completar la fila de 3 si quieres, o dejarlo así */}
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
                                value={colaborador.segundo_nombre} onChange={handleChange} 
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
                                value={colaborador.segundo_apellido} onChange={handleChange} 
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
                                value={colaborador.telefono} onChange={handleChange} 
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3, opacity: 0.5 }} />

                    {/* --- SECCIÓN 3: DATOS LABORALES (Ajustado para que no se encoja) --- */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WorkIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Vinculación Laboral
                        </Typography>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {/* Fecha de Ingreso */}
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
                                sx={{minWidth:200}}
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
                                sx={{minWidth:200}}
                            >
                                {sedes.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* Botón de Guardar */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disableElevation // Botón plano sin sombra (minimalista)
                            startIcon={<SaveIcon />}
                            sx={{ px: 4, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Guardar Colaborador
                        </Button>
                    </Box>

                </form>
            </Paper>
        </Box>
    );
};

export default ColaboradorCreatePage;