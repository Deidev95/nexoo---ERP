import React, { useEffect, useState } from 'react'; // <--- Importamos Hooks
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <--- Importamos Axios
import { Box, Grid, Card, CardContent, Typography, Button, Divider, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ColaboradoresMenuPage = () => {
    const navigate = useNavigate();
    
    // 1. Estado para guardar los datos que vienen del backend
    const [kpis, setKpis] = useState({
        total_colaboradores: 0,
        nuevos_este_mes: 0,
        indicadores: { trm: 0, uvr: 0, smlv: 0 }
    });
    const [loading, setLoading] = useState(true); // Para mostrar carga

    // 2. Efecto para cargar los datos al entrar a la página
    useEffect(() => {
        const fetchKpis = async () => {
            try {
                const accessToken = localStorage.getItem('access');
                const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
                
                // Llamamos a nuestro nuevo endpoint
                const response = await axios.get('http://localhost:8000/api/colaboradores/kpis/', config);
                setKpis(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar KPIs:", error);
                setLoading(false);
            }
        };
        fetchKpis();
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
    };

    if (loading) {
        return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
                Gestión de Colaboradores
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
                Vista general e indicadores clave del personal.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                
                {/* Tarjeta 1: Total Real */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: '5px solid #1976d2', boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PeopleIcon sx={{ color: '#1976d2', mr: 1, fontSize: 30 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Total Colaboradores
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                {kpis.total_colaboradores} {/* <--- DATO REAL */}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Activos en nómina
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta 2: Indicadores (Vienen del backend) */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: '5px solid #2e7d32', boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingUpIcon sx={{ color: '#2e7d32', mr: 1, fontSize: 30 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Indicadores Hoy
                                </Typography>
                            </Box>
                            <Typography variant="body1"><strong>TRM:</strong> ${kpis.indicadores.trm.toLocaleString()}</Typography>
                            <Typography variant="body1"><strong>UVR:</strong> ${kpis.indicadores.uvr}</Typography>
                            <Typography variant="body1"><strong>SMLV:</strong> ${kpis.indicadores.smlv.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tarjeta 3: Nuevos este mes Real */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderLeft: '5px solid #ed6c02', boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonAddIcon sx={{ color: '#ed6c02', mr: 1, fontSize: 30 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Nuevos (Este Mes)
                                </Typography>
                            </Box>
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                {kpis.nuevos_este_mes} {/* <--- DATO REAL */}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ingresos registrados
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
                Acciones Disponibles
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Button 
                        variant="contained" 
                        size="large"
                        fullWidth
                        startIcon={<ListAltIcon />}
                        onClick={() => handleNavigate('/rrhh/colaboradores/listado')}
                        sx={{ p: 2, fontSize: '1.1rem', backgroundColor: '#1565c0' }}
                    >
                        Consultar Listado
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Button 
                        variant="outlined" 
                        size="large"
                        fullWidth
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => handleNavigate('/rrhh/colaboradores/crear')}
                        sx={{ p: 2, fontSize: '1.1rem', borderWidth: '2px' }}
                    >
                        Crear Nuevo Colaborador
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ColaboradoresMenuPage;