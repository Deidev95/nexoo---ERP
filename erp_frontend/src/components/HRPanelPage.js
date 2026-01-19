import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, Divider } from '@mui/material';
import { Group as GroupIcon, ReceiptLong as ReceiptLongIcon, EventBusy as EventBusyIcon, QueryStats as QueryStatsIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

// --- DATOS DE LOS MÓDULOS DE RRHH ---
const hrModules = [
    {
        title: "Gestión de Colaboradores",
        description: "Administra perfiles, contratos y datos del personal.",
        icon: <GroupIcon sx={{ fontSize: 40 }} />,
        path: "/rrhh/colaboradores",
        enabled: true,
    },
    {
        title: "Gestión de Nómina",
        description: "Procesa salarios, bonificaciones y deducciones.",
        icon: <ReceiptLongIcon sx={{ fontSize: 40 }} />,
        path: "/rrhh/nomina",
        enabled: false,
    },
    {
        title: "Solicitudes y Permisos",
        description: "Gestiona vacaciones, licencias y otros permisos.",
        icon: <EventBusyIcon sx={{ fontSize: 40 }} />,
        path: "/rrhh/solicitudes",
        enabled: false,
    },
    {
        title: "Informes y Analíticas",
        description: "Genera reportes clave sobre la fuerza laboral.",
        icon: <QueryStatsIcon sx={{ fontSize: 40 }} />,
        path: "/rrhh/informes",
        enabled: false,
    },
];

// --- MINI-COMPONENTE PARA LAS TARJETAS ---
const ModuleCard = ({ title, description, icon, path, enabled }) => (
    <Paper
        elevation={4}
        sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            borderRadius: '12px',
            // Si el módulo no está habilitado, lo mostramos semitransparente
            opacity: enabled ? 1 : 0.6,
        }}
    >
        <Box>
            <Box sx={{ color: '#0057E7', mb: 2 }}>{icon}</Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: '40px' }}>
                {description}
            </Typography>
        </Box>
        <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            component={RouterLink}
            to={path}
            disabled={!enabled} // Deshabilitamos el botón si el módulo no está activo
            sx={{
                mt: 3,
                alignSelf: 'flex-start',
                bgcolor: '#0057E7',
                '&:hover': { bgcolor: '#1C1C59' },
            }}
        >
            {enabled ? 'Acceder' : 'Próximamente'}
        </Button>
    </Paper>
);


const HRPanelPage = () => {
    return (
        <Box sx={{ p: 2 }}>
            {/* --- ENCABEZADO --- */}
            <Typography variant="h4" component="h1" sx={{ fontWeight: '600', color: '#1e293b' }} gutterBottom>
                Panel de Recursos Humanos
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mb: 2 }}>
                Selecciona un sub-módulo para comenzar a gestionar.
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* --- CUADRÍCULA DE MÓDULOS --- */}
            <Grid container spacing={3}>
                {hrModules.map((module) => (
                    <Grid item xs={12} md={6} lg={4} key={module.title}>
                        <ModuleCard {...module} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default HRPanelPage;