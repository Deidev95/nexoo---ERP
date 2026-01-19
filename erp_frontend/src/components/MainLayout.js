import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, Typography, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Collapse, IconButton,
    Avatar, Button, Menu, MenuItem
} from '@mui/material';

// Iconos
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 260;
const collapsedDrawerWidth = 70;

const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
        text: 'RRHH', icon: <BusinessIcon />, name: 'rrhh',
        children: [
            { text: 'Panel RRHH', icon: <AssessmentIcon />, path: '/rrhh' },
            { text: 'Colaboradores', icon: <PeopleIcon />, path: '/rrhh/colaboradores' },
        ],
    },
];

// Componentes estilizados
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const StyledDrawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: open ? drawerWidth : collapsedDrawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        // Estilo para el siderbar
        backgroundColor: theme.palette.primary.main, // Color oscuro del tema (Slate)
        color: theme.palette.primary.contrastText, // Texto blanco
        borderRight: 'none',
        overflowX: 'hidden',
    },
}));

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(true);
    const [openSubMenu, setOpenSubMenu] = useState({ rrhh: true });
    const location = useLocation();

    // Estado menú perfil
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [userData] = useState({ name: 'David Restrepo', initial: 'D' });

    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const toggleSidebar = () => setIsExpanded(!isExpanded);
    const handleSubMenuClick = (name) => {
        if (!isExpanded) setIsExpanded(true); // Abrir sidebar si está cerrado
        setOpenSubMenu(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const renderNavItems = (items) => {
        return items.map((item) => {
            const isActive = location.pathname === item.path;
            const isParentActive = item.children && item.children.some(child => location.pathname === child.path);
            
            // Estilos para los items del menú
            const itemStyle = {
                minHeight: 48,
                justifyContent: isExpanded ? 'initial' : 'center',
                px: 2.5,
                mb: 0.5,
                borderRadius: '8px', // Bordes redondeados en los botones
                mx: 1, // Margen horizontal
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                '&.Mui-selected': {
                    backgroundColor: theme.palette.secondary.main, // Color de selección (Azul)
                    '&:hover': { backgroundColor: theme.palette.secondary.dark },
                }
            };

            const iconStyle = {
                minWidth: 0,
                mr: isExpanded ? 2 : 'auto',
                justifyContent: 'center',
                color: 'inherit', // Heredar color blanco del padre
            };

            if (item.children) {
                return (
                    <React.Fragment key={item.text}>
                        <ListItemButton onClick={() => handleSubMenuClick(item.name)} sx={itemStyle} selected={isParentActive}>
                            <ListItemIcon sx={iconStyle}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: isExpanded ? 1 : 0 }} />
                            {isExpanded ? (openSubMenu[item.name] ? <ExpandLess /> : <ExpandMore />) : null}
                        </ListItemButton>
                        <Collapse in={isExpanded && openSubMenu[item.name]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {item.children.map((child) => (
                                    <ListItemButton
                                        key={child.text}
                                        component={RouterLink}
                                        to={child.path}
                                        selected={location.pathname === child.path}
                                        sx={{
                                            ...itemStyle,
                                            pl: 4,
                                            backgroundColor: location.pathname === child.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        }}
                                    >
                                        <ListItemIcon sx={iconStyle}>{child.icon}</ListItemIcon>
                                        <ListItemText primary={child.text} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                );
            }
            return (
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        component={RouterLink}
                        to={item.path}
                        selected={isActive}
                        sx={itemStyle}
                    >
                        <ListItemIcon sx={iconStyle}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} sx={{ opacity: isExpanded ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            );
        });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <AppBar position="fixed" open={isExpanded}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleSidebar}
                        edge="start"
                        sx={{ marginRight: 5 }}
                    >
                        {isExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    
                    <Typography variant="h6" noWrap component="div" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                        NEXOO ERP
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Menú de Perfil */}
                    <Button onClick={handleProfileMenuOpen} color="inherit" sx={{ borderRadius: '50px', textTransform: 'none' }}>
                        <Avatar sx={{ width: 35, height: 35, mr: 1, bgcolor: theme.palette.secondary.main, fontSize: '1rem' }}>
                            {userData.initial}
                        </Avatar>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
                            {userData.name}
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Menú desplegable */}
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleMenuClose}>Configuración</MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>Cerrar Sesión</MenuItem>
            </Menu>

            <StyledDrawer variant="permanent" open={isExpanded}>
                <Box sx={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    padding: theme.spacing(0, 1), 
                    ...theme.mixins.toolbar,
                }}>
                   <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', letterSpacing: 1 }}>
                       {isExpanded ? 'NEXOO' : 'N'}
                   </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <List component="nav" sx={{ mt: 2 }}>
                    {renderNavItems(navItems)}
                </List>
            </StyledDrawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', overflowX: 'hidden' }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;