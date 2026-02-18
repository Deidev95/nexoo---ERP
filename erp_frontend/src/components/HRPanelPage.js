import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, Divider } from '@mui/material';
import { 
    Group as GroupIcon, 
    ReceiptLong as ReceiptLongIcon, 
    EventBusy as EventBusyIcon, 
    QueryStats as QueryStatsIcon, 
    ArrowForward as ArrowForwardIcon, 
    Business as BusinessIcon 
} from '@mui/icons-material';

// DATOS DE LOS MÓDULOS DE RRHH
const hrModules = [
    {
        title: "Gestión de Colaboradores",
        description: "Administra perfiles, contratos y datos del personal.",
        icon: <GroupIcon fontSize="medium" />, 
        path: "/rrhh/colaboradores",
        enabled: true,
    },
    {
        title: "Estructura y Cargos",
        description: "Administra gerencias, áreas, centros de costos y perfiles.",
        icon: <BusinessIcon fontSize="medium" />,
        path: "/rrhh/estructura",
        enabled: true,
    },
    {
        title: "Gestión de Nómina",
        description: "Procesa salarios, bonificaciones y deducciones.",
        icon: <ReceiptLongIcon fontSize="medium" />,
        path: "/rrhh/nomina",
        enabled: false,
    },
    {
        title: "Solicitudes y Permisos",
        description: "Gestiona vacaciones, licencias y otros permisos.",
        icon: <EventBusyIcon fontSize="medium" />,
        path: "/rrhh/solicitudes",
        enabled: false,
    },
    {
        title: "Informes y Analíticas",
        description: "Genera reportes clave e indicadores.",
        icon: <QueryStatsIcon fontSize="medium" />,
        path: "/rrhh/informes",
        enabled: false,
    }
];

const ModuleCard = ({ title, description, icon, path, enabled }) => (
    <Paper
        elevation={0}
        sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '220px',      
            maxHeight: '220px',   
            overflow: 'hidden',   
            
            borderRadius: '12px',
            opacity: enabled ? 1 : 0.6,
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s',
            '&:hover': {
                transform: enabled ? 'translateY(-3px)' : 'none',
                boxShadow: enabled ? '0 8px 16px -4px rgba(0, 0, 0, 0.1)' : 'none',
                borderColor: enabled ? '#3b82f6' : '#e2e8f0'
            }
        }}
    >
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                 <Box sx={{ color: enabled ? '#3b82f6' : '#94a3b8', p: 1, bgcolor: enabled ? '#eff6ff' : '#f1f5f9', borderRadius: 2 }}>
                    {icon}
                 </Box>
            </Box>

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 'bold',
                    color: '#1e293b',
                    fontSize: '0.95rem',
                    lineHeight: 1.2,
                    mb: 1,
                    
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                {title}
            </Typography>

            <Typography 
                variant="body2"
                color="text.secondary"
                sx={{ 
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                    
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                {description}
            </Typography>
        </Box>

        <Button
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />} 
            component={RouterLink}
            to={path}
            disabled={!enabled}
            disableElevation
            size="small" 
            fullWidth
            sx={{
                mt: 'auto',
                bgcolor: '#3b82f6',
                textTransform: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                py: 0.8,
                '&:hover': { bgcolor: '#2563eb' },
            }}
        >
            {enabled ? 'Ingresar' : 'Próximamente'}
        </Button>
    </Paper>
);

const HRPanelPage = () => {
    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: '700', color: '#1e293b' }}>
                    Panel de Recursos Humanos
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Selecciona un módulo para gestionar.
                </Typography>
            </Box>
            
            <Divider sx={{ mb: 4, opacity: 0.6 }} />

            <Grid container spacing={2}> 
                {hrModules.map((module) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={module.title}> 
                        <ModuleCard {...module} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default HRPanelPage;