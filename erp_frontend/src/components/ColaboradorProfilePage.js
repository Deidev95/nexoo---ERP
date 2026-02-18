import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    Box, Grid, Paper, Typography, Button, Avatar, Divider, Chip, 
    CircularProgress, Stack, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
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
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';

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
                axios.get(`http://localhost:8000/api/colaboradores/${id}/?modo_edicion=false`, config),
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

            {/* Sección superior fija */}
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
                                {colaborador.cargo_nombre}
                            </Typography>

                            {/* Chip dinámico de estado del colaborador */}
                            <Chip 
                                label={colaborador.estado_empleado} 
                                color={
                                    colaborador.estado_empleado === 'ACTIVO' ? 'success' : 
                                    colaborador.estado_empleado === 'INACTIVO' ? 'error' : 'warning'
                                } 
                                size="small" 
                                sx={{ fontWeight: 'bold' }} 
                            />

                            {/* Chip de Número de Contrato del colaborador */}
                            <Chip 
                                label={`Contrato #${colaborador.numero_contrato || 1}`} 
                                // Si está ACTIVO es 'success' (verde), si no es 'error' (rojo)
                                color={colaborador.estado_empleado === 'ACTIVO' ? "success" : "error"} 
                                variant="outlined" 
                                size="small" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    // Estilos condicionales para Verde (Activo) vs Rojo (Inactivo)
                                    border: colaborador.estado_empleado === 'ACTIVO' ? '1px solid #4caf50' : '1px solid #ef5350', 
                                    color: colaborador.estado_empleado === 'ACTIVO' ? '#2e7d32' : '#c62828', 
                                    bgcolor: colaborador.estado_empleado === 'ACTIVO' ? '#e8f5e9' : '#ffebee' 
                                }}
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
                        <Tab icon={<WorkIcon />} iconPosition="start" label="Información Laboral" />
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
                            <InfoItem icon={<PhoneIcon fontSize="small"/>} label="Teléfono / Celular" value={colaborador.telefono} />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<LocationOnIcon fontSize="small"/>} label="Dirección" value={`${colaborador.direccion || ''}, ${colaborador.municipio || ''}`} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<BadgeIcon fontSize="small"/>} label="Estado Civil" value={colaborador.estado_civil} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <InfoItem icon={<PersonIcon fontSize="small"/>} label="Género" value={colaborador.genero} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<PublicIcon fontSize="small"/>} label="Nacionalidad" value={colaborador.nacionalidad} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<LocationCityIcon fontSize="small"/>} label="Departamento" value={colaborador.departamento} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<MapIcon fontSize="small"/>} label="Municipio" value={colaborador.municipio} />
                        </Grid>

                        {/* lógica de reito de colaboradro */}
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

                {/* --- Pestaña 1: "Información Laboral" (NUEVA) --- */}
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.text.primary }}>
                        Estructura y Contratación
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<BusinessIcon fontSize="small"/>} label="Gerencia" value={colaborador.gerencia_nombre} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<AccountTreeIcon fontSize="small"/>} label="Área" value={colaborador.area_nombre} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<AccountTreeIcon fontSize="small"/>} label="Sub-Área / Ceco" value={`${colaborador.sub_area_nombre || ''} ${colaborador.codigo_centro_costos ? `(${colaborador.codigo_centro_costos})` : ''}`} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<LocationOnIcon fontSize="small"/>} label="Sede de Trabajo" value={colaborador.sede_nombre} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<SupervisorAccountIcon fontSize="small"/>} label="Jefe Inmediato" value={colaborador.jefe_inmediato_nombre || 'Sin jefe (Cabeza de área)'} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InfoItem icon={<CalendarMonthIcon fontSize="small"/>} label="Fecha Ingreso" value={colaborador.fecha_ingreso} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <InfoItem icon={<EmailIcon fontSize="small"/>} label="Correo Corporativo" value={colaborador.correo_corporativo} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoItem icon={<BadgeIcon fontSize="small"/>} label="Contrato" value={`${colaborador.tipo_contrato} ${colaborador.termino_contrato ? `(Vence: ${colaborador.termino_contrato})` : ''}`} />
                        </Grid>
                    </Grid>

                    {colaborador.contratos_previos && colaborador.contratos_previos.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Divider sx={{ mb: 2 }}>
                                <Chip label="📜 Historial de Vinculaciones Anteriores" size="small" />
                            </Divider>

                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell><strong>Cargo Anterior</strong></TableCell>
                                            <TableCell><strong>Área / Gerencia</strong></TableCell>
                                            <TableCell><strong>Fecha Inicio</strong></TableCell>
                                            <TableCell><strong>Fecha Fin</strong></TableCell>
                                            <TableCell><strong>Motivo Retiro</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {colaborador.contratos_previos.map((hist) => (
                                            <TableRow key={hist.id} hover>
                                                <TableCell>{hist.cargo_snapshot || '---'}</TableCell>
                                                <TableCell>
                                                    <Typography variant="caption" display="block">{hist.area_snapshot}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{hist.gerencia_snapshot}</Typography>
                                                </TableCell>
                                                <TableCell>{hist.fecha_inicio}</TableCell>
                                                <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }}>{hist.fecha_fin}</TableCell>
                                                <TableCell>
                                                    <Chip label={hist.motivo_retiro || 'No especificado'} size="small" variant="outlined" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </TabPanel>

                {/* --- Pestaña 2: "Auditoria de cambios" --- */}
                <TabPanel value={tabValue} index={2}>
                     <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                        {history.length > 0 ? (
                            <Stack spacing={2}>
                                {history.map((record) => {
                                    const typeInfo = getHistoryTypeLabel(record.history_type);
                                
                                    // DETECTAMOS SI ES UN REINGRESO
                                    // (Si el campo history_change_reason tiene texto, es un reingreso)
                                    const esReingreso = record.history_change_reason && record.history_change_reason.length > 0;

                                    return (
                                        <Paper 
                                            key={record.history_id} 
                                            elevation={0} 
                                            sx={{ 
                                                p: 2, 
                                                border: '1px solid #e2e8f0', 
                                                // Si es reingreso, borde MORADO. Si no, usa el color normal (Verde/Azul/Rojo)
                                                borderLeft: esReingreso ? '4px solid #9c27b0' : `4px solid ${typeInfo.color === 'success' ? '#2e7d32' : typeInfo.color === 'info' ? '#0288d1' : '#d32f2f'}` 
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                {/* Si es reingreso, mostramos etiqueta especial */}
                                                {esReingreso ? (
                                                    <Chip label="🚀 REINGRESO" color="secondary" size="small" sx={{ fontWeight: 'bold' }} />
                                                ) : (
                                                    <Chip label={typeInfo.text} color={typeInfo.color} size="small" />
                                                )}
                                            
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(record.history_date).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Por:</strong> {record.history_user || 'Sistema'}
                                            </Typography>

                                            {/* CAJA DE DETALLES */}
                                            <Box sx={{ p: 1.5, bgcolor: esReingreso ? '#f3e5f5' : '#f8fafc', borderRadius: 1, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                                {esReingreso ? (
                                                    // 1. Mensaje de Reingreso (Lo que escribimos en el Backend)
                                                    <Typography variant="body2" color="secondary.main" fontWeight="bold">
                                                        {record.history_change_reason}
                                                    </Typography>
                                                ) : (
                                                    // 2. Cambios normales (Campo A -> Campo B)
                                                    record.changes || 'Sin detalles de cambios.'
                                                )}
                                            </Box>
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