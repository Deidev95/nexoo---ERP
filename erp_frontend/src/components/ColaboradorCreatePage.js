import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    Box, Paper, Typography, Grid, TextField, Button, MenuItem, 
    Stepper, Step, StepLabel, Divider, InputAdornment, FormControlLabel, Checkbox,
    Alert
} from '@mui/material';

// Íconos
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Datos estáticos
import { 
    TIPOS_DOCUMENTO, GENEROS, ESTADO_CIVIL, TIPOS_CONTRATO, 
    TIPOS_CUENTA, BANCOS, EPS_LIST, FONDOS_PENSION, FONDOS_CESANTIAS 
} from '../utils/constants';
import { COLOMBIA_DATA } from '../utils/colombia';

// Valores legales 2026
const SMLV_2026 = 1750905;
const TOPE_AUXILIO = SMLV_2026 * 2;

const steps = ['Identificación', 'Ubicación', 'Laboral', 'Contratación'];

const ColaboradorCreatePage = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);
    
    // Listas dinámicas
    const [cargos, setCargos] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [gerencias, setGerencias] = useState([]);
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [posiblesJefes, setPosiblesJefes] = useState([]);


    // Listas filtradas
    const [areasFiltradas, setAreasFiltradas] = useState([]);
    const [subAreasFiltradas, setSubAreasFiltradas] = useState([]);

    // Estado para manejar blur de cédula
    const [cedulaBlur, setCedulaBlur] = useState(false);

    const [colaborador, setColaborador] = useState({
        // 1. Identificación
        tipo_documento: 'CC', cedula: '', primer_nombre: '', segundo_nombre: '',
        primer_apellido: '', segundo_apellido: '', genero: '', fecha_nacimiento: '',
        nacionalidad: 'Colombiana', estado_civil: 'SOLTERO',
        
        // 2. Ubicación
        direccion: '', departamento: '', municipio: '', correo_personal: '',
        telefono: '', correo_corporativo: '', telefono_oficina: '',
        
        // 3. Laboral
        fecha_ingreso: '', cargo: '', sede: '', 
        gerencia_temp: '', area_temp: '', sub_area: '', 
        jefe_inmediato: '',
        estado_empleado: 'ACTIVO',
        
        // 4. Contratación
        tipo_contrato: 'INDEFINIDO', termino_contrato: '', salario: '',
        auxilio_transporte: true, banco: '', tipo_cuenta: 'AHORROS',
        numero_cuenta: '', eps: '', fondo_pensiones: '', fondo_cesantias: '',
        dias_vacaciones: 'L-V'
    });

    // Cargar listas del Backend
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            try {
                const [cargosRes, sedesRes, gerenciasRes, areasRes, subAreasRes, jefesRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/cargos/', config),
                    axios.get('http://localhost:8000/api/sedes/', config),
                    axios.get('http://localhost:8000/api/gerencias/', config),
                    axios.get('http://localhost:8000/api/areas/', config),
                    axios.get('http://localhost:8000/api/subareas/', config),
                    axios.get('http://localhost:8000/api/colaboradores/', config),
                ]);
                setCargos(cargosRes.data);
                setSedes(sedesRes.data);
                setGerencias(gerenciasRes.data);
                setAreas(areasRes.data);
                setSubAreas(subAreasRes.data);
                setPosiblesJefes(jefesRes.data);
            } catch (error) {
                console.error("Error cargando listas:", error);
            }
        };
        fetchData();
    }, []);

    // Cálculo automático de auxilio de transporte
    useEffect(() => {
        const salarioNum = parseFloat(colaborador.salario) || 0;
        const contrato = colaborador.tipo_contrato;

        let tieneAuxilio = true;

        if (salarioNum > TOPE_AUXILIO) {
            tieneAuxilio = false;
        }

        if (contrato === 'APRENDIZ_LECTIVO' || contrato === 'PRESTACION_SERVICIOS') {
            tieneAuxilio = false;
        }

        if (colaborador.auxilio_transporte !== tieneAuxilio) {
            setColaborador(prev => ({ ...prev, auxilio_transporte: tieneAuxilio }));
        }
        
    }, [colaborador.salario, colaborador.tipo_contrato]); 

    // Manejo de cambios
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

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Limpieza de datos
        const dataToSend = { 
            ...colaborador,
            termino_contrato: colaborador.termino_contrato || null,
            jefe_inmediato: colaborador.jefe_inmediato || null,
            correo_corporativo: colaborador.correo_corporativo || null,
            telefono_oficina: colaborador.telefono_oficina || null,
            salario: parseFloat(colaborador.salario)
        };
        delete dataToSend.gerencia_temp;
        delete dataToSend.area_temp;

        try {
            const accessToken = localStorage.getItem('access');
            const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
            await axios.post('http://localhost:8000/api/colaboradores/', dataToSend, config);
            
            Swal.fire({
                title: '¡Excelente!',
                text: 'Colaborador creado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#1e293b',
            }).then(() => navigate('/rrhh/colaboradores/listado'));

        } catch (error) {
            console.error("Error:", error.response?.data);
            const mensajeError = error.response?.data ? JSON.stringify(error.response.data) : 'Datos inválidos';
            Swal.fire('Error', `Detalle técnico: ${mensajeError}`, 'error');
        }
    };

    // Renderizado de pasos
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
                        <TextField fullWidth size="small" label="Número Documento" name="cedula" value={colaborador.cedula} onChange={handleChange} onBlur={handleCheckCedula} required />
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
                        <TextField fullWidth size="small" type="email" label="Email Corporativo (Opcional)" name="correo_corporativo" value={colaborador.correo_corporativo} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth size="small" label="Teléfono Oficina (Opcional)" name="telefono_oficina" value={colaborador.telefono_oficina} onChange={handleChange} />
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

                    <Grid item xs={12}><Divider sx={{ my: 1 }}><Typography variant="caption">CENTRO DE COSTOS Y JERARQUÍA</Typography></Divider></Grid>
                    
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="1. Gerencia" name="gerencia_temp" value={colaborador.gerencia_temp} onChange={handleChange} sx={{minWidth: 200}}>
                            {gerencias.map((g) => <MenuItem key={g.id} value={g.id}>{g.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="2. Área" name="area_temp" value={colaborador.area_temp} onChange={handleChange} disabled={!colaborador.gerencia_temp} sx={{minWidth: 200}}>
                            {areasFiltradas.map((a) => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" label="3. Sub-Área (Ceco)" name="sub_area" value={colaborador.sub_area} onChange={handleChange} disabled={!colaborador.area_temp} required sx={{minWidth: 200}}>
                            {subAreasFiltradas.map((s) => <MenuItem key={s.id} value={s.id}>{s.display_name || s.nombre}</MenuItem>)}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                            <TextField select fullWidth size="small" label="Jefe Inmediato" name="jefe_inmediato" value={colaborador.jefe_inmediato} onChange={handleChange} helperText="Si no tiene jefe, selecciona 'Es cabeza de área'">
                                <MenuItem value=""><em>Es cabeza de área (Sin jefe)</em></MenuItem>
                                {posiblesJefes.map((j) => (
                                    <MenuItem key={j.id} value={j.id}>
                                        {j.primer_nombre} {j.primer_apellido}
                                    </MenuItem>
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
                                ? "✅ Aplica Auxilio de Transporte (Automático)" 
                                : "ℹ️ No aplica Auxilio de Transporte (Por tope salarial > 2 SMLV o Tipo de Contrato)"}
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

    const handleCheckCedula = async (e) => {
    const cedulaIngresada = e.target.value;
    if (!cedulaIngresada) return;

    try {
        const accessToken = localStorage.getItem('access');
        const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };

        // Consultamos si existe alguien con esa cédula
        // Nota: Asumo que tu API de listado permite filtrar o que traemos todos. 
        // Para ser más eficientes, idealmente el backend soportaría ?cedula=XYZ, 
        // pero por ahora buscaremos en la lista general si no es gigante.
        const response = await axios.get(`http://localhost:8000/api/colaboradores/?search=${cedulaIngresada}`, config);

        // Buscamos coincidencia exacta
        const encontrado = response.data.find(c => c.cedula === cedulaIngresada);

        if (encontrado) {
            if (encontrado.estado_empleado === 'ACTIVO') {
                Swal.fire({
                    title: '¡Ya existe!',
                    text: `El colaborador ${encontrado.primer_nombre} ${encontrado.primer_apellido} ya está ACTIVO en el sistema.`,
                    icon: 'warning'
                });
                // Limpiamos el campo para que no lo duplique
                setColaborador({ ...colaborador, cedula: '' });
            } 
            else if (encontrado.estado_empleado === 'INACTIVO') {
                // --- AQUÍ ESTÁ LA MAGIA DEL REINGRESO ---
                Swal.fire({
                    title: 'Ex-Colaborador Detectado',
                    text: `${encontrado.primer_nombre} ${encontrado.primer_apellido} trabajó aquí antes (Contrato #${encontrado.numero_contrato || 1}). ¿Deseas procesar su REINGRESO?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, Reingresar',
                    confirmButtonColor: '#3b82f6',
                    cancelButtonText: 'No, corregir cédula'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        // Llamamos al endpoint de REACTIVAR colaborador
                        try {
                            await axios.post(`http://localhost:8000/api/colaboradores/${encontrado.id}/reactivar/`, {}, config);

                            Swal.fire({
                                    title: '¡Reactivado!',
                                    text: 'Redirigiendo a la edición del contrato...',
                                    icon: 'success',
                                    timer: 1500,               // Espera 1.5 segundos
                                    showConfirmButton: false,  // Oculta el botón OK
                                    timerProgressBar: true
                                }).then(() => {
                                    // Apenas termine el tiempo, navega automáticamente
                                    navigate(`/rrhh/colaboradores/${encontrado.id}/editar`);
                                });

                        } catch (error) {
                            Swal.fire('Error', 'No se pudo reactivar al colaborador', 'error');
                        }
                    } else {
                        setColaborador({ ...colaborador, cedula: '' });
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error verificando cédula:", error);
    }
};




    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/rrhh/colaboradores')} sx={{ color: 'text.secondary', mr: 2 }}>Cancelar</Button>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>Nuevo Ingreso de Personal</Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>

                <form onSubmit={handleSubmit}>
                    {renderStepContent(activeStep)}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<NavigateBeforeIcon />}>Atrás</Button>
                        
                        {activeStep === steps.length - 1 ? (
                            <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />} disableElevation>Finalizar Contratación</Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext} endIcon={<NavigateNextIcon />} disableElevation>Siguiente</Button>
                        )}
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ColaboradorCreatePage;