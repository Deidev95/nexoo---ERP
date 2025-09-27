// src/components/DashboardPage.js

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, Divider } from '@mui/material';
import { Group as GroupIcon, Assessment as AssessmentIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Paper
        elevation={3}
        sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '12px',
            height: '100%',
        }}
    >
        <Box sx={{
            bgcolor: color || '#0057E7', // Color corporativo
            color: 'white',
            borderRadius: '8px',
            p: 1.5,
            mr: 2,
            display: 'inline-flex'
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
                {value}
            </Typography>
            <Typography color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);

const DashboardPage = () => {
    // En el futuro, estos datos vendrían de tu API
    const kpis = {
        totalColaboradores: 4,
        modulosActivos: 1,
        reportesGenerados: 0,
        sedes: 2,
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* --- SECCIÓN DE BIENVENIDA --- */}
            <Typography variant="h4" component="h1" sx={{ fontWeight: '600', color: 'white' }} gutterBottom>
                Bienvenido al Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                Aquí tienes un resumen clave de la actividad de tu empresa.
            </Typography>
            <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* --- SECCIÓN DE INDICADORES (KPIs) --- */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Colaboradores Totales"
                        value={kpis.totalColaboradores}
                        icon={<GroupIcon />}
                        color="#0057E7" // Nexo Blue
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Módulos Activos"
                        value={kpis.modulosActivos}
                        icon={<AssessmentIcon />}
                        color="#1C1C59" // Nexo Blue Light
                    />
                </Grid>
                {/* Puedes añadir más tarjetas de estadísticas aquí */}
            </Grid>

            {/* --- SECCIÓN DE ACCESOS DIRECTOS --- */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            borderRadius: '12px',
                        }}
                    >
                        <Box>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                                Módulo de Recursos Humanos
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Gestiona colaboradores, nóminas, solicitudes y más.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            component={RouterLink}
                            to="/rrhh"
                            sx={{
                                mt: 3,
                                alignSelf: 'flex-start',
                                bgcolor: '#0057E7', // Nexo Blue
                                '&:hover': {
                                    bgcolor: '#1C1C59', // Nexo Blue Light
                                },
                            }}
                        >
                            Ir a RRHH
                        </Button>
                    </Paper>
                </Grid>
                {/* Puedes añadir más tarjetas de acceso directo aquí */}
            </Grid>
        </Box>
    );
};

export default DashboardPage;