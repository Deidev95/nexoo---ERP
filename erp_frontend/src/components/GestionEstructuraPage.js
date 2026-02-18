import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    Box, Paper, Typography, Tabs, Tab, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, IconButton, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    Grid, Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Divider, Chip, Tooltip 
} from '@mui/material';

// Íconos
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LayersIcon from '@mui/icons-material/Layers';
import { useNavigate } from 'react-router-dom';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const GestionEstructuraPage = () => {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    
    // ESTADOS DE DATOS
    const [cargos, setCargos] = useState([]);
    const [gerencias, setGerencias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);

    // ESTADOS DE MODALES (CARGOS)
    const [openCargoModal, setOpenCargoModal] = useState(false);
    const [currentCargo, setCurrentCargo] = useState({ nombre: '', nivel_jerarquico: 'OPERATIVO', areas: [] });
    const [isEditingCargo, setIsEditingCargo] = useState(false);

    // ESTADOS DE MODALES (ESTRUCTURA)
    const [openStructModal, setOpenStructModal] = useState(false);
    const [structType, setStructType] = useState(''); // 'GERENCIA', 'AREA', 'SUBAREA'
    const [currentStruct, setCurrentStruct] = useState({}); // Datos del item a editar/crear
    const [parentId, setParentId] = useState(null); // ID del padre (ej: ID de Gerencia al crear Área)

    // CARGA DE DATOS
    const fetchData = async () => {
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
        try {
            const [cargosRes, gerenciasRes, areasRes, subAreasRes] = await Promise.all([
                axios.get('http://localhost:8000/api/cargos/', config),
                axios.get('http://localhost:8000/api/gerencias/', config),
                axios.get('http://localhost:8000/api/areas/', config),
                axios.get('http://localhost:8000/api/subareas/', config),
            ]);
            setCargos(cargosRes.data);
            setGerencias(gerenciasRes.data);
            setAreas(areasRes.data);
            setSubAreas(subAreasRes.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- MANEJO DE CARGOS ---
    const handleOpenCargoModal = (cargo = null) => {
        if (cargo) {
            setIsEditingCargo(true);
            setCurrentCargo({ ...cargo, areas: cargo.areas || [] });
        } else {
            setIsEditingCargo(false);
            setCurrentCargo({ nombre: '', nivel_jerarquico: 'OPERATIVO', areas: [] });
        }
        setOpenCargoModal(true);
    };

    const handleSaveCargo = async () => {
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
        try {
            if (isEditingCargo) {
                await axios.put(`http://localhost:8000/api/cargos/${currentCargo.id}/`, currentCargo, config);
            } else {
                await axios.post('http://localhost:8000/api/cargos/', currentCargo, config);
            }
            fetchData();
            setOpenCargoModal(false);
            Swal.fire('Éxito', 'Cargo guardado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el cargo', 'error');
        }
    };

    const handleDeleteCargo = async (id) => {
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
        Swal.fire({
            title: '¿Eliminar Cargo?', text: "Esta acción es irreversible.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8000/api/cargos/${id}/`, config);
                    fetchData();
                    Swal.fire('Eliminado', 'Cargo eliminado.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'No se puede eliminar (quizás está en uso)', 'error');
                }
            }
        });
    };

    const toggleAreaInCargo = (areaId) => {
        const currentAreas = currentCargo.areas;
        if (currentAreas.includes(areaId)) {
            setCurrentCargo({ ...currentCargo, areas: currentAreas.filter(id => id !== areaId) });
        } else {
            setCurrentCargo({ ...currentCargo, areas: [...currentAreas, areaId] });
        }
    };

    // Abrir modal dinámico (Gerencia, Área o Subárea)
    const handleOpenStructModal = (type, item = null, parent = null) => {
        setStructType(type);
        setParentId(parent);
        
        if (item) {
            // Modo Edición
            setCurrentStruct({ ...item });
        } else {
            // Modo Creación
            const initialData = { nombre: '' };
            if (type === 'SUBAREA') initialData.codigo_centro_costos = '';
            setCurrentStruct(initialData);
        }
        setOpenStructModal(true);
    };

    const handleSaveStructure = async () => {
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
        
        // Determinar URL y Datos según el tipo
        let url = '';
        let data = { ...currentStruct };

        // Asignar padres si es creación
        if (!currentStruct.id) {
            if (structType === 'AREA') data.gerencia = parentId;
            if (structType === 'SUBAREA') data.area = parentId;
        }

        // Definir endpoint base
        if (structType === 'GERENCIA') url = 'http://localhost:8000/api/gerencias/';
        if (structType === 'AREA') url = 'http://localhost:8000/api/areas/';
        if (structType === 'SUBAREA') url = 'http://localhost:8000/api/subareas/';

        try {
            if (currentStruct.id) {
                // Editar (PUT)
                await axios.put(`${url}${currentStruct.id}/`, data, config);
            } else {
                // Crear (POST)
                await axios.post(url, data, config);
            }
            fetchData();
            setOpenStructModal(false);
            Swal.fire('Guardado', `${structType} guardada exitosamente`, 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Verifica los datos e intenta de nuevo', 'error');
        }
    };

    const handleDeleteStructure = async (type, id) => {
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
        
        let url = '';
        if (type === 'GERENCIA') url = `http://localhost:8000/api/gerencias/${id}/`;
        if (type === 'AREA') url = `http://localhost:8000/api/areas/${id}/`;
        if (type === 'SUBAREA') url = `http://localhost:8000/api/subareas/${id}/`;

        Swal.fire({
            title: `¿Eliminar ${type}?`, 
            text: "Si tiene elementos hijos, podría causar errores.", 
            icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(url, config);
                    fetchData();
                    Swal.fire('Eliminado', 'Elemento eliminado.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'No se puede eliminar (probablemente tiene dependencias)', 'error');
                }
            }
        });
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => navigate('/rrhh')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    Gestión de Estructura y Cargos
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8fafc' }}>
                    <Tab label="Gestión de Cargos y Permisos" />
                    <Tab label="Estructura (Gerencias/Áreas/Cecos)" />
                </Tabs>

                {/* PESTAÑA 1: CARGOS */}
                <TabPanel value={tabIndex} index={0}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCargoModal()}>
                            Nuevo Cargo
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                <TableRow>
                                    <TableCell><strong>Nombre del Cargo</strong></TableCell>
                                    <TableCell><strong>Nivel</strong></TableCell>
                                    <TableCell><strong>Áreas Habilitadas</strong></TableCell>
                                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cargos.map((cargo) => (
                                    <TableRow key={cargo.id} hover>
                                        <TableCell>{cargo.nombre}</TableCell>
                                        <TableCell>
                                            <Chip label={cargo.nivel_jerarquico} size="small" color={cargo.nivel_jerarquico === 'ESTRATEGICO' ? 'primary' : 'default'} variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            {cargo.areas && cargo.areas.length > 0 
                                                ? <Chip label={`${cargo.areas.length} Áreas permitidas`} size="small" color="success" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                                                : <Chip label="Todas / Ninguna" size="small" sx={{ bgcolor: '#f1f5f9' }} />
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton size="small" onClick={() => handleOpenCargoModal(cargo)} sx={{ color: '#3b82f6' }}><EditIcon /></IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteCargo(cargo.id)} sx={{ color: '#ef4444' }}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                {/* PESTAÑA 2: ESTRUCTURA (ARBOL CRUD) */}
                <TabPanel value={tabIndex} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Gestiona aquí la jerarquía completa de la organización.
                        </Typography>
                        <Button variant="contained" startIcon={<BusinessIcon />} onClick={() => handleOpenStructModal('GERENCIA')}>
                            Nueva Gerencia
                        </Button>
                    </Box>
                    
                    {gerencias.map(gerencia => (
                        <Accordion key={gerencia.id} disableGutters elevation={0} sx={{ border: '1px solid #e2e8f0', mb: 1, borderRadius: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <BusinessIcon sx={{ mr: 1, color: '#475569' }} />
                                        <Typography fontWeight="bold">{gerencia.nombre}</Typography>
                                    </Box>
                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <Tooltip title="Agregar Área">
                                            <IconButton size="small" color="primary" onClick={() => handleOpenStructModal('AREA', null, gerencia.id)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar Gerencia">
                                            <IconButton size="small" onClick={() => handleOpenStructModal('GERENCIA', gerencia)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar Gerencia">
                                            <IconButton size="small" color="error" onClick={() => handleDeleteStructure('GERENCIA', gerencia.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {areas.filter(a => a.gerencia === gerencia.id).map(area => (
                                    <Box key={area.id} sx={{ ml: 3, mb: 2, borderLeft: '2px solid #e2e8f0', pl: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccountTreeIcon sx={{ mr: 1, fontSize: 20, color: '#64748b' }} />
                                                <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 'bold' }}>
                                                    {area.nombre}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Tooltip title="Nuevo Centro de Costos">
                                                    <IconButton size="small" color="primary" onClick={() => handleOpenStructModal('SUBAREA', null, area.id)}>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <IconButton size="small" onClick={() => handleOpenStructModal('AREA', area)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteStructure('AREA', area.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        
                                        {/* SUBAREAS (CECOS) */}
                                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {subAreas.filter(s => s.area === area.id).map(sub => (
                                                <Chip 
                                                    key={sub.id} 
                                                    icon={<LayersIcon />}
                                                    label={`${sub.nombre} (${sub.codigo_centro_costos || 'N/A'})`} 
                                                    size="small" 
                                                    variant="outlined"
                                                    onDelete={() => handleDeleteStructure('SUBAREA', sub.id)}
                                                    onClick={() => handleOpenStructModal('SUBAREA', sub)}
                                                    sx={{ bgcolor: '#fff', '&:hover': { bgcolor: '#f8fafc' } }}
                                                />
                                            ))}
                                            {subAreas.filter(s => s.area === area.id).length === 0 && (
                                                <Typography variant="caption" color="text.secondary">Sin Centros de Costos</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                                {areas.filter(a => a.gerencia === gerencia.id).length === 0 && (
                                    <Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenStructModal('AREA', null, gerencia.id)}>
                                        Agregar primera área
                                    </Button>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    {gerencias.length === 0 && (
                        <Typography align="center" sx={{ mt: 4, color: 'text.secondary' }}>No hay estructura definida. ¡Crea la primera Gerencia!</Typography>
                    )}
                </TabPanel>
            </Paper>

            {/* MODAL CARGOS */}
            <Dialog open={openCargoModal} onClose={() => setOpenCargoModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>{isEditingCargo ? 'Editar Cargo' : 'Nuevo Cargo'}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Nombre del Cargo" fullWidth value={currentCargo.nombre} onChange={(e) => setCurrentCargo({ ...currentCargo, nombre: e.target.value })} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select label="Nivel Jerárquico" fullWidth value={currentCargo.nivel_jerarquico} SelectProps={{ native: true }} onChange={(e) => setCurrentCargo({ ...currentCargo, nivel_jerarquico: e.target.value })}>
                                <option value="OPERATIVO">Operativo</option>
                                <option value="TACTICO">Táctico</option>
                                <option value="ESTRATEGICO">Estratégico</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }}><Typography variant="caption" color="primary">ASIGNAR ÁREAS PERMITIDAS</Typography></Divider>
                            <Grid container spacing={1} sx={{ maxHeight: 200, overflowY: 'auto', p: 1, bgcolor: '#f8fafc', borderRadius: 1 }}>
                                {areas.map(area => (
                                    <Grid item xs={12} sm={6} md={4} key={area.id}>
                                        <FormControlLabel control={<Checkbox checked={currentCargo.areas.includes(area.id)} onChange={() => toggleAreaInCargo(area.id)} size="small" />} label={<Typography variant="caption">{area.nombre}</Typography>} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCargoModal(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSaveCargo} startIcon={<SaveIcon />}>Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* MODAL ESTRUCTURA (DINÁMICO) */}
            <Dialog open={openStructModal} onClose={() => setOpenStructModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {currentStruct.id ? 'Editar' : 'Nueva'} {structType === 'SUBAREA' ? 'Sub-Área (Ceco)' : structType}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mt: 1 }}>
                        <TextField 
                            label={`Nombre de ${structType.toLowerCase()}`} 
                            fullWidth 
                            value={currentStruct.nombre || ''} 
                            onChange={(e) => setCurrentStruct({ ...currentStruct, nombre: e.target.value })} 
                            sx={{ mb: 2 }}
                        />
                        {structType === 'SUBAREA' && (
                            <TextField 
                                label="Código Centro de Costos" 
                                fullWidth 
                                value={currentStruct.codigo_centro_costos || ''} 
                                onChange={(e) => setCurrentStruct({ ...currentStruct, codigo_centro_costos: e.target.value })} 
                                helperText="Ej: 1001, ADM-02"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStructModal(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSaveStructure} startIcon={<SaveIcon />}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GestionEstructuraPage;