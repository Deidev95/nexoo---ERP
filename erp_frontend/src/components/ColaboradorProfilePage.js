import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    Box, Grid, Paper, Typography, Button, Avatar, Divider, Chip, 
    CircularProgress, Stack, Tabs, Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Íconos
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import CakeIcon from '@mui/icons-material/Cake';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import InfoIcon from '@mui/icons-material/Info';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import PersonOffIcon from '@mui/icons-material/PersonOff';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ColaboradorProfilePage = () => {
    const [colaborador, setColaborador] = useState(null);
    const [history, setHistory] = useState([]);
    const [tabValue, setTabValue] = useState(0); 
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    // Función para recargar datos
    const fetchData = async () => {
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
        try {
            const [colaboradorRes, historyRes] = await Promise.all([
                axios.get(`http://localhost:8000/api/colaboradores/${id}/`, config),
                axios.get(`http://localhost:8000/api/colaboradores/${id}/historial/`, config)
            ]);
            setColaborador(colaboradorRes.data);
            setHistory(historyRes.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Lógica de eliminar colaborador (Borrado Físico y total)
    const handleDelete = async () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará permanentemente al colaborador y su historial. Úsala solo si fue un error de registro.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const accessToken = localStorage.getItem('access');
                const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
                try {
                    await axios.delete(`http://localhost:8000/api/colaboradores/${id}/`, config);
                    Swal.fire('Eliminado', 'El colaborador ha sido eliminado.', 'success');
                    navigate('/rrhh/colaboradores/listado');
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
                }
            }
        });
    };

    // Lógica de desvinculación (Retiro)
    const handleRetire = async () => {
        const motivos = {
            'RENUNCIA_VOLUNTARIA': 'Renuncia voluntaria',
            'TERMINACION_OBRA': 'Terminación obra o labor',
            'TERMINACION_JUSTA_CAUSA': 'Terminación de contrato con justa causa',
            'MUTUO_ACUERDO': 'Mutuo acuerdo',
            'VENCIMIENTO_TERMINO_FIJO': 'Vencimiento contrato fijo',
            'TERMINACION_APRENDIZAJE': 'Terminación contrato de aprendizaje',
            'MUERTE': 'Muerte del trabajador',
            'PERIODO_PRUEBA': 'Terminación del contrato por periodo de prueba',
            'ABANDONO_CARGO': 'Abandono de cargo',
            'SIN_JUSTA_CAUSA': 'Terminación de contrato sin justa causa'
        };

        const opcionesHTML = Object.entries(motivos)
            .map(([key, label]) => `<option value="${key}">${label}</option>`)
            .join('');

        const inputStyle = 'width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 14px; color: #334155; outline: none; margin-top: 5px; box-sizing: border-box;';
        const labelStyle = 'display: block; text-align: left; font-weight: 600; font-size: 0.9rem; color: #475569; margin-top: 15px; margin-bottom: 2px;';

        const { value: formValues } = await Swal.fire({
            title: '<h3 style="color:#1e293b; font-weight:700;">Formalizar Desvinculación</h3>',
            html: `
                <div style="text-align: left; padding: 0 10px;">
                    <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 20px;">
                        Por favor, diligencia los detalles del retiro para actualizar el expediente.
                    </p>

                    <label style="${labelStyle} margin-top: 0;">Fecha Oficial de Retiro</label>
                    <input type="date" id="swal-fecha" value="${new Date().toISOString().split('T')[0]}" style="${inputStyle}">
                    
                    <label style="${labelStyle}">Causal de Retiro</label>
                    <select id="swal-motivo" style="${inputStyle} background-color: white;">
                        <option value="" disabled selected>Seleccione una causa...</option>
                        ${opcionesHTML}
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar Retiro',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ed6c02',
            cancelButtonColor: '#94a3b8',
            customClass: {
                popup: 'swal-wide',
            },
            preConfirm: () => {
                const fecha = document.getElementById('swal-fecha').value;
                const motivo = document.getElementById('swal-motivo').value;
                
                if (!fecha || !motivo) {
                    Swal.showValidationMessage('⚠️ Debes seleccionar la fecha y el motivo obligatorio');
                    return false;
                }
                return { fecha, motivo };
            }
        });

        if (formValues) {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            
            try {
                await axios.patch(`http://localhost:8000/api/colaboradores/${id}/`, {
                    estado_empleado: 'INACTIVO',
                    fecha_desvinculacion: formValues.fecha,
                    motivo_retiro: formValues.motivo
                }, config);

                Swal.fire({
                    icon: 'success',
                    title: 'Desvinculado',
                    text: 'El estado del colaborador ha cambiado a INACTIVO.',
                    confirmButtonColor: '#1e293b'
                });
                fetchData(); 
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo procesar la solicitud.', 'error');
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!colaborador) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    const getInitials = (n, a) => `${n.charAt(0)}${a.charAt(0)}`.toUpperCase();
    
    const getHistoryTypeLabel = (type) => {
        if (type === '+') return { text: 'Creado', color: 'success' };
        if (type === '~') return { text: 'Actualizado', color: 'info' };
        if (type === '-') return { text: 'Eliminado', color: 'error' };
        return { text: 'Desconocido', color: 'default' };
    };

    const InfoItem = ({ icon, label, value }) => (
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {icon && <Box sx={{ color: theme.palette.primary.main, mr: 1, display: 'flex' }}>{icon}</Box>}
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#334155' }}>{value || '---'}</Typography>
        </Paper>
    );

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/rrhh/colaboradores/listado')} sx={{ color: 'text.secondary' }}>
                    Volver
                </Button>
            </Box>

            {/* --- Sección superior fija --- */}
            <Paper sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 3, 
                display: 'flex', 
                flexWrap: 'wrap', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                gap: 3, 
                boxShadow: theme.shadows[1] 
            }}>
                {/* Lado Izquierdo: Identidad */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.secondary.main, fontSize: '2rem', boxShadow: 3 }}>
                        {getInitials(colaborador.primer_nombre, colaborador.primer_apellido)}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                            {colaborador.primer_nombre} {colaborador.primer_apellido}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {colaborador.cargo}
                            </Typography>

                            {/* Chip dinámico de estado */}
                            <Chip 
                                label={colaborador.estado_empleado} 
                                color={
                                    colaborador.estado_empleado === 'ACTIVO' ? 'success' : 
                                    colaborador.estado_empleado === 'INACTIVO' ? 'error' : 'warning'
                                } 
                                size="small" 
                                sx={{ fontWeight: 'bold' }} 
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Lado Derecho: Botones de Acción */}
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        startIcon={<EditIcon />} 
                        onClick={() => navigate(`/rrhh/colaboradores/${id}/editar`)}
                        sx={{ borderColor: theme.palette.divider, color: theme.palette.text.secondary }}
                    >
                        Editar
                    </Button>

                    {/* Botón: "Retirar" (Solo visible si el colaborador está ACTIVO) */}
                    {colaborador.estado_empleado === 'ACTIVO' && (
                        <Button 
                            variant="contained" 
                            color="warning"
                            startIcon={<PersonOffIcon />} 
                            onClick={handleRetire}
                            sx={{ boxShadow: 'none', color: 'white' }}
                        >
                            Retirar
                        </Button>
                    )}

                    <Button 
                        variant="contained" 
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={handleDelete}
                        sx={{ boxShadow: 'none', opacity: 0.8 }}
                    >
                        Eliminar
                    </Button>
                </Stack>
            </Paper>

            {/* --- Navegación por pestañas (TABS) --- */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[1] }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.background.paper }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ '& .MuiTab-root': { fontWeight: 600 } }}
                    >
                        <Tab icon={<InfoIcon />} iconPosition="start" label="Información General" />
                        <Tab icon={<HistoryIcon />} iconPosition="start" label="Auditoría de Cambios" />
                        <Tab label="Vacaciones" disabled />
                        <Tab label="Documentos" disabled />
                    </Tabs>
                </Box>

                {/* --- Pestaña 1: "Información General" --- */}
                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.text.primary }}>
                        Detalle del Expediente
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<BadgeIcon fontSize="small"/>} label="Cédula" value={colaborador.cedula} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<PersonIcon fontSize="small"/>} label="Fecha Nacimiento" value={colaborador.fecha_nacimiento} />
                        </Grid>
                         <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<WorkIcon fontSize="small"/>} label="Estado" value={colaborador.estado_empleado} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<EmailIcon fontSize="small"/>} label="Correo Personal" value={colaborador.correo_personal} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<PhoneIcon fontSize="small"/>} label="Teléfono" value={colaborador.telefono} />
                        </Grid>
                         <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<BusinessIcon fontSize="small"/>} label="Sede" value={colaborador.sede} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<EventAvailableIcon fontSize="small"/>} label="Fecha Ingreso" value={colaborador.fecha_ingreso} />
                        </Grid>

                        {/* Mostramos la fecha de retiro de forma destacada si existe */}
                        {colaborador.fecha_desvinculacion && (
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff4e5', border: '1px solid #ffcc80', borderRadius: 2, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PersonOffIcon sx={{ color: 'warning.main', mr: 1 }} fontSize="small"/>
                                        <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                            Fecha Retiro
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#663c00' }}>
                                        {colaborador.fecha_desvinculacion}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* --- Pestaña 2: "Auditoria de cambios" --- */}
                <TabPanel value={tabValue} index={1}>
                     <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                        {history.length > 0 ? (
                            <Stack spacing={2}>
                                {history.map((record) => {
                                    const typeInfo = getHistoryTypeLabel(record.history_type);
                                    return (
                                        <Paper key={record.history_id} elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderLeft: `4px solid ${typeInfo.color === 'success' ? '#2e7d32' : typeInfo.color === 'info' ? '#0288d1' : '#d32f2f'}` }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Chip label={typeInfo.text} color={typeInfo.color} size="small" />
                                                <Typography variant="caption" color="text.secondary">{new Date(record.history_date).toLocaleString()}</Typography>
                                            </Box>
                                            <Typography variant="body2"><strong>Por:</strong> {record.history_user || 'Sistema'}</Typography>
                                            {record.changes && (
                                                <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f1f5f9', borderRadius: 1, fontSize: '0.85rem', fontFamily: 'monospace' }}>{record.changes}</Box>
                                            )}
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>No hay registros de actividad.</Typography>
                        )}
                    </Box>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default ColaboradorProfilePage;