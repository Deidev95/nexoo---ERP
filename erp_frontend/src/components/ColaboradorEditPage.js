import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    Box, Paper, Typography, Grid, TextField, Button, MenuItem, 
    Stepper, Step, StepLabel, Divider, InputAdornment, FormControlLabel, Checkbox,
    Alert, CircularProgress
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import { 
    TIPOS_DOCUMENTO, GENEROS, ESTADO_CIVIL, TIPOS_CONTRATO, 
    TIPOS_CUENTA, BANCOS, EPS_LIST, FONDOS_PENSION, FONDOS_CESANTIAS 
} from '../utils/constants';
import { COLOMBIA_DATA } from '../utils/colombia';

const SMLV_2026 = 1750905;
const TOPE_AUXILIO = SMLV_2026 * 2; 

const steps = ['Identificación', 'Ubicación', 'Laboral', 'Contratación'];

const ColaboradorEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);
    
    const [cargos, setCargos] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [gerencias, setGerencias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [posiblesJefes, setPosiblesJefes] = useState([]);

    const [areasFiltradas, setAreasFiltradas] = useState([]);
    const [subAreasFiltradas, setSubAreasFiltradas] = useState([]);

    const [colaborador, setColaborador] = useState({
        tipo_documento: 'CC', cedula: '', primer_nombre: '', segundo_nombre: '',
        primer_apellido: '', segundo_apellido: '', genero: '', fecha_nacimiento: '',
        nacionalidad: 'Colombiana', estado_civil: 'SOLTERO',
        direccion: '', departamento: '', municipio: '', correo_personal: '',
        telefono: '', correo_corporativo: '', telefono_oficina: '',
        fecha_ingreso: '', cargo: '', sede: '', 
        gerencia_temp: '', area_temp: '', sub_area: '', 
        jefe_inmediato: '',
        estado_empleado: 'ACTIVO',
        tipo_contrato: 'INDEFINIDO', termino_contrato: '', salario: '',
        auxilio_transporte: true, banco: '', tipo_cuenta: 'AHORROS',
        numero_cuenta: '', eps: '', fondo_pensiones: '', fondo_cesantias: '',
        dias_vacaciones: 'L-V'
    });

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            
            try {
                
                const [cargosRes, sedesRes, gerenciasRes, areasRes, subAreasRes, jefesRes, colabRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/cargos/', config),
                    axios.get('http://localhost:8000/api/sedes/', config),
                    axios.get('http://localhost:8000/api/gerencias/', config),
                    axios.get('http://localhost:8000/api/areas/', config),
                    axios.get('http://localhost:8000/api/subareas/', config),
                    axios.get('http://localhost:8000/api/colaboradores/', config),
                    axios.get(`http://localhost:8000/api/colaboradores/${id}/?modo_edicion=true`, config)
                ]);

                setCargos(cargosRes.data);
                setSedes(sedesRes.data);
                setGerencias(gerenciasRes.data);
                setAreas(areasRes.data);
                setSubAreas(subAreasRes.data);
                setPosiblesJefes(jefesRes.data);

                const data = colabRes.data;
                let gerenciaId = '';
                let areaId = '';
                let areasParaFiltro = [];
                let subAreasParaFiltro = [];
                let municipiosParaFiltro = [];

                if (data.sub_area) {
                    const subAreaObj = subAreasRes.data.find(s => s.id === data.sub_area);
                    if (subAreaObj) {
                        areaId = subAreaObj.area;
                        
                        subAreasParaFiltro = subAreasRes.data.filter(s => s.area === areaId);
                        
                        const areaObj = areasRes.data.find(a => a.id === areaId);
                        if (areaObj) {
                            gerenciaId = areaObj.gerencia;
                            
                            areasParaFiltro = areasRes.data.filter(a => a.gerencia === gerenciaId);
                        }
                    }
                }

                if (data.departamento) {
                    const deptoData = COLOMBIA_DATA.find(d => d.departamento === data.departamento);
                    municipiosParaFiltro = deptoData ? deptoData.municipios : [];
                }

                setAreasFiltradas(areasParaFiltro);
                setSubAreasFiltradas(subAreasParaFiltro);
                setMunicipiosDisponibles(municipiosParaFiltro);

                setColaborador({
                    ...data,
                    // --- Protecciones para el reingreso de colaboradores ---
                    cargo: data.cargo || '', // Evita error en el select de cargo
                    fecha_ingreso: data.fecha_ingreso || '', // Evita error en el date picker
                    tipo_contrato: data.tipo_contrato || 'INDEFINIDO', // Sugerido por defecto
                    salario: data.salario || '', // Evita error en el campo numérico

                    termino_contrato: data.termino_contrato || '',
                    segundo_nombre: data.segundo_nombre || '',
                    segundo_apellido: data.segundo_apellido || '',
                    correo_corporativo: data.correo_corporativo || '',
                    telefono_oficina: data.telefono_oficina || '',
                    jefe_inmediato: data.jefe_inmediato || '',
                   
                    gerencia_temp: gerenciaId,
                    area_temp: areaId
                });

                setLoading(false);

            } catch (error) {
                console.error("Error cargando datos:", error);
                Swal.fire('Error', 'No se pudo cargar la información del colaborador', 'error');
                navigate('/rrhh/colaboradores/listado');
            }
        };
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (loading) return;
        
        const salarioNum = parseFloat(colaborador.salario) || 0;
        const contrato = colaborador.tipo_contrato;
        let tieneAuxilio = true;

        if (salarioNum > TOPE_AUXILIO) tieneAuxilio = false;
        if (contrato === 'APRENDIZ_LECTIVO' || contrato === 'PRESTACION_SERVICIOS') tieneAuxilio = false;

        if (colaborador.auxilio_transporte !== tieneAuxilio) {
            setColaborador(prev => ({ ...prev, auxilio_transporte: tieneAuxilio }));
        }
    }, [colaborador.salario, colaborador.tipo_contrato, loading]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setColaborador({
            ...colaborador,
            [name]: type === 'checkbox' ? checked : value
        });
        
        if (name === 'departamento') {
            const deptoData = COLOMBIA_DATA.find(d => d.departamento === value);
            setMunicipiosDisponibles(deptoData ? deptoData.municipios : []);
            setColaborador(prev => ({ ...prev, departamento: value, municipio: '' }));
        }

        if (name === 'gerencia_temp') {
            const areasFil = areas.filter(a => a.gerencia === value);
            setAreasFiltradas(areasFil);
            setSubAreasFiltradas([]);
            setColaborador(prev => ({ ...prev, gerencia_temp: value, area_temp: '', sub_area: '' }));
        }

        if (name === 'area_temp') {
            const subAreasFil = subAreas.filter(s => s.area === value);
            setSubAreasFiltradas(subAreasFil);
            setColaborador(prev => ({ ...prev, area_temp: value, sub_area: '' }));
        }
    };

    const handleNext = (e) => {
        if (e) e.preventDefault();
        setActiveStep((prev) => prev + 1);
    }
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!colaborador.fecha_ingreso || !colaborador.cargo || !colaborador.salario) {
            Swal.fire({
                title: '¡Faltan Datos del Contrato!',
                text: 'Para completar el reingreso o actualización, es obligatorio indicar: Cargo, Fecha de Ingreso y Salario.',
                icon: 'warning',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        let nuevoEstado = colaborador.estado_empleado;
        
        if (colaborador.estado_empleado === 'INACTIVO' && !colaborador.fecha_desvinculacion) {
             nuevoEstado = 'ACTIVO';
        }
        
        const dataToSend = { 
            ...colaborador,
            estado_empleado: nuevoEstado,
            termino_contrato: colaborador.termino_contrato || null,
            jefe_inmediato: colaborador.jefe_inmediato || null,
            correo_corporativo: colaborador.correo_corporativo || null,
            telefono_oficina: colaborador.telefono_oficina || null,
            salario: parseFloat(colaborador.salario)
        };
        
        delete dataToSend.gerencia_temp;
        delete dataToSend.area_temp;
        delete dataToSend.cargo_nombre; 
        delete dataToSend.sede_nombre;
        delete dataToSend.centro_costos_info;

        try {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            
            await axios.put(`http://localhost:8000/api/colaboradores/${id}/`, dataToSend, config);
            
            Swal.fire({
                title: 'Actualizado',
                text: 'La información ha sido actualizada correctamente.',
                icon: 'success',
                confirmButtonColor: '#1e293b',
            }).then(() => navigate('/rrhh/colaboradores/listado'));

        } catch (error) {
            console.error("Error updating:", error);
            const mensajeError = error.response?.data ? JSON.stringify(error.response.data) : 'Error al guardar';
            Swal.fire('Error', `Detalle: ${mensajeError}`, 'error');
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    const renderStepContent = (step) => {
        switch (step) {
            case 0: return (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <TextField select fullWidth size="small" label="Tipo Documento" name="tipo_documento" value={colaborador.tipo_documento} onChange={handleChange}>
                            {TIPOS_DOCUMENTO.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField fullWidth size="small" label="Número Documento" name="cedula" value={colaborador.cedula} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField fullWidth size="small" type="date" label="Fecha Nacimiento" name="fecha_nacimiento" value={colaborador.fecha_nacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} required sx={{minWidth: 230}} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField select fullWidth size="small" label="Género" name="genero" value={colaborador.genero} onChange={handleChange} sx={{minWidth: 230}}>
                            {GENEROS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField fullWidth size="small" label="Primer Nombre" name="primer_nombre" value={colaborador.primer_nombre} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField fullWidth size="small" label="Segundo Nombre" name="segundo_nombre" value={colaborador.segundo_nombre} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField fullWidth size="small" label="Primer Apellido" name="primer_apellido" value={colaborador.primer_apellido} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField fullWidth size="small" label="Segundo Apellido" name="segundo_apellido" value={colaborador.segundo_apellido} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Estado Civil" name="estado_civil" value={colaborador.estado_civil} onChange={handleChange} sx={{minWidth: 230}}>
                            {ESTADO_CIVIL.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="Nacionalidad" name="nacionalidad" value={colaborador.nacionalidad} onChange={handleChange} />
                    </Grid>
                </Grid>
            );
            case 1: return (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="small" label="Dirección Residencia" name="direccion" value={colaborador.direccion} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField select fullWidth size="small" label="Departamento" name="departamento" value={colaborador.departamento} onChange={handleChange} sx={{minWidth: 200}}>
                            {COLOMBIA_DATA.map((d) => <MenuItem key={d.departamento} value={d.departamento}>{d.departamento}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField select fullWidth size="small" label="Municipio" name="municipio" value={colaborador.municipio} onChange={handleChange} disabled={!colaborador.departamento} sx={{minWidth: 200}}>
                            {municipiosDisponibles.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="small" type="email" label="Email Personal" name="correo_personal" value={colaborador.correo_personal} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="small" label="Celular / Teléfono" name="telefono" value={colaborador.telefono} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="small" type="email" label="Email Corporativo" name="correo_corporativo" value={colaborador.correo_corporativo} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="small" label="Teléfono Oficina" name="telefono_oficina" value={colaborador.telefono_oficina} onChange={handleChange} />
                    </Grid>
                </Grid>
            );
            case 2: return (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" type="date" label="Fecha Ingreso" name="fecha_ingreso" value={colaborador.fecha_ingreso} onChange={handleChange} InputLabelProps={{ shrink: true }} required sx={{minWidth: 200}}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Cargo" name="cargo" value={colaborador.cargo} onChange={handleChange} required sx={{minWidth: 200}}>
                            {cargos.map((o) => <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Sede" name="sede" value={colaborador.sede} onChange={handleChange} required sx={{minWidth: 200}}>
                            {sedes.map((o) => <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="caption" sx={{ fontWeight:'bold', color: '#64748b' }}>ESTRUCTURA Y JERARQUÍA</Typography></Divider></Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField select fullWidth size="small" label="1. Gerencia" name="gerencia_temp" value={colaborador.gerencia_temp} onChange={handleChange} sx={{minWidth: 200}}>
                            {gerencias.map((g) => <MenuItem key={g.id} value={g.id}>{g.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField select fullWidth size="small" label="2. Área" name="area_temp" value={colaborador.area_temp} onChange={handleChange} disabled={!colaborador.gerencia_temp} sx={{minWidth: 200}}>
                            {areasFiltradas.map((a) => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField select fullWidth size="small" label="3. Sub-Área (Ceco)" name="sub_area" value={colaborador.sub_area} onChange={handleChange} disabled={!colaborador.area_temp} required sx={{minWidth: 200}}>
                            {subAreasFiltradas.map((s) => <MenuItem key={s.id} value={s.id}>{s.display_name || s.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField select fullWidth size="small" label="Jefe Inmediato" name="jefe_inmediato" value={colaborador.jefe_inmediato} onChange={handleChange} helperText="Si no tiene jefe, selecciona 'Es cabeza de área'">
                            <MenuItem value=""><em>Es cabeza de área (Sin jefe)</em></MenuItem>
                            {posiblesJefes.map((j) => (                              
                                j.id !== parseInt(id) && (
                                    <MenuItem key={j.id} value={j.id}>
                                        {j.primer_nombre} {j.primer_apellido}
                                    </MenuItem>
                                )
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            );
            case 3: return (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Tipo Contrato" name="tipo_contrato" value={colaborador.tipo_contrato} onChange={handleChange}>
                            {TIPOS_CONTRATO.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" type="date" label="Fin Contrato" name="termino_contrato" value={colaborador.termino_contrato} onChange={handleChange} InputLabelProps={{ shrink: true }} disabled={colaborador.tipo_contrato === 'INDEFINIDO'} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="Salario Mensual" name="salario" type="number" value={colaborador.salario} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} required />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Alert severity={colaborador.auxilio_transporte ? "success" : "info"} icon={false} sx={{ mb: 1 }}>
                            {colaborador.auxilio_transporte 
                                ? "✅ Aplica Auxilio de Transporte" 
                                : "ℹ️ No aplica Auxilio de Transporte"}
                        </Alert>
                        <FormControlLabel 
                            control={<Checkbox checked={colaborador.auxilio_transporte} name="auxilio_transporte" disabled />} 
                            label="Derecho a Auxilio de Transporte (Calculado)" 
                        />
                    </Grid>

                    <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="caption">DATOS DE PAGO</Typography></Divider></Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Banco" name="banco" value={colaborador.banco} onChange={handleChange} sx={{minWidth: 200}}>
                            {BANCOS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Tipo Cuenta" name="tipo_cuenta" value={colaborador.tipo_cuenta} onChange={handleChange} sx={{minWidth: 200}}>
                            {TIPOS_CUENTA.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="Número Cuenta" name="numero_cuenta" value={colaborador.numero_cuenta} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="caption">SEGURIDAD SOCIAL</Typography></Divider></Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="EPS" name="eps" value={colaborador.eps} onChange={handleChange} sx={{minWidth: 200}}>
                            {EPS_LIST.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Fondo Pensiones" name="fondo_pensiones" value={colaborador.fondo_pensiones} onChange={handleChange} sx={{minWidth: 200}}>
                            {FONDOS_PENSION.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="Fondo Cesantías" name="fondo_cesantias" value={colaborador.fondo_cesantias} onChange={handleChange} sx={{minWidth: 200}}>
                            {FONDOS_CESANTIAS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                        </TextField>
                    </Grid>
                </Grid>
            );
            default: return 'Desconocido';
        }
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/rrhh/colaboradores/listado')} sx={{ color: 'text.secondary', mr: 2 }}>Cancelar</Button>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                    Editar Colaborador: {colaborador.primer_nombre} {colaborador.primer_apellido}
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>

                <form onSubmit={handleSubmit}>
                    {renderStepContent(activeStep)}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        
                        <Button 
                            type="button" 
                            disabled={activeStep === 0} 
                            onClick={handleBack} 
                            startIcon={<NavigateBeforeIcon />}
                        >
                            Atrás
                        </Button>
                        
                        {activeStep === steps.length - 1 ? (
                            
                            <Button 
                                variant="contained" 
                                color="primary" 
                                type="submit" 
                                startIcon={<SaveIcon />} 
                                disableElevation
                            >
                                Guardar Cambios
                            </Button>
                        ) : (
                            
                            <Button 
                                type='button' 
                                variant="contained" 
                                onClick={(e) => handleNext(e)} 
                                endIcon={<NavigateNextIcon />} 
                                disableElevation
                            >
                                Siguiente
                            </Button>
                        )}
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ColaboradorEditPage;