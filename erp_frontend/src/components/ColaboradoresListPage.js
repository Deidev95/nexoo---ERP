import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Avatar, 
    TextField, 
    InputAdornment, 
    IconButton, 
    Chip,
    Tooltip,
    CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Íconos
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ColaboradoresListPage = () => {
    const [colaboradores, setColaboradores] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchColaboradores = async () => {
            try {
                const accessToken = localStorage.getItem('access');
                const config = { headers: { 'Authorization': `Bearer ${accessToken}` } };
                const response = await axios.get('http://localhost:8000/api/colaboradores/', config);
                setColaboradores(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        fetchColaboradores();
    }, []);

    // Función para filtrar colaboradores (Buscador en tiempo real)
    const filteredColaboradores = colaboradores.filter(colaborador => {
        const fullName = `${colaborador.primer_nombre} ${colaborador.primer_apellido}`.toLowerCase();
        const cedula = colaborador.cedula ? colaborador.cedula.toString() : '';
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || cedula.includes(search);
    });

    // Función para obtener iniciales del avatar
    const getInitials = (nombre, apellido) => {
        return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box >
            
            {/* --- 1. HEADER DE LA PÁGINA --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/rrhh/colaboradores')} sx={{ color: 'text.primary' }}>
                            <ArrowBackIcon />
                    </IconButton>
                
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Directorio de Personal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestiona el acceso y la información de tus colaboradores.
                        </Typography>
                    </Box>
                </Box>
                
                {/* Botón de Crear (Ahora a la derecha y estilizado) */}
                <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/rrhh/colaboradores/crear')}
                    sx={{ px: 3, py: 1, borderRadius: 2 }}
                >
                    Nuevo Colaborador
                </Button>
            </Box>

            {/* --- 2. BARRA DE HERRAMIENTAS (BUSCADOR) --- */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por nombre o cédula..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 500 }}
                />
            </Paper>

            {/* --- 3. TABLA PROFESIONAL --- */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
                <Table>
                    {/* Cabecera de la Tabla */}
                    <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Colaborador</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cédula</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cargo</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sede</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Cuerpo de la Tabla */}
                    <TableBody>
                        {filteredColaboradores.length > 0 ? (
                            filteredColaboradores.map((colaborador) => (
                                <TableRow 
                                    key={colaborador.id} 
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {/* Nombre + Avatar */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32, fontSize: '0.9rem' }}>
                                                {getInitials(colaborador.primer_nombre, colaborador.primer_apellido)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {colaborador.primer_nombre} {colaborador.primer_apellido}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {colaborador.correo_personal}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell>{colaborador.cedula}</TableCell>
                                
                                    <TableCell>{colaborador.cargo_nombre || 'N/A'}</TableCell> 
                                    <TableCell>{colaborador.sede_nombre || 'N/A'}</TableCell>

                                    {/* Chip de Estado */}
                                    <TableCell>
                                        <Chip 
                                            label={colaborador.estado_empleado}
                                            color={
                                                colaborador.estado_empleado === 'ACTIVO' ? 'success' : 
                                                colaborador.estado_empleado === 'INACTIVO' ? 'error' : 'default'
                                            }
                                            size="small" 
                                            variant="outlined" 
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell align="center">
                                        <Tooltip title="Ver Perfil Completo">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => navigate(`/rrhh/colaboradores/${colaborador.id}`)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton 
                                                color="default" 
                                                size="small"
                                                onClick={() => navigate(`/rrhh/colaboradores/${colaborador.id}/editar`)}
                                            >
                                                <EditIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No se encontraron colaboradores.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ColaboradoresListPage;