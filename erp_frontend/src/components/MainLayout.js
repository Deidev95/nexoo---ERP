import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
    Box, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, Typography, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Collapse, IconButton,
    Avatar, Button, Menu, MenuItem
} from '@mui/material';
import './MainLayout.css';

// --- ÍCONOS ---
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

// --- ESTRUCTURA DE NAVEGACIÓN ---
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

// --- COMPONENTES ESTILIZADOS ---
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    ...(!open && {
        width: `calc(100% - ${collapsedDrawerWidth}px)`,
        marginLeft: `${collapsedDrawerWidth}px`,
    }),
}));

// Drawer estilizado con funcionalidad de colapsar/expandir
const StyledDrawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: open ? drawerWidth : collapsedDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    '& .MuiDrawer-paper': {
        width: open ? drawerWidth : collapsedDrawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        // Aplicamos el background animado directamente
        background: 'linear-gradient(45deg, #0057E7, #1C1C59, #0057E7)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 12s ease-in-out infinite',
        color: 'rgba(255, 255, 255, 0.9)',
        borderRight: 'none',
        position: 'relative',
        overflow: 'hidden',
        // Hover effect para expandir cuando está colapsado
        '&:hover': {
            ...(open ? {} : {
                width: drawerWidth,
                '& .drawer-content': {
                    opacity: 1,
                },
            }),
        },
        // Burbujas como pseudo-elementos
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '10%',
            left: '80%',
            width: '50px',
            height: '50px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            animation: 'float 5s ease-in-out infinite alternate',
            zIndex: 0,
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '70%',
            left: '15%',
            width: '35px',
            height: '35px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            animation: 'float 4.2s ease-in-out infinite alternate',
            zIndex: 0,
        },
    },
}));

const DrawerContent = styled('div', {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    opacity: open ? 1 : 0,
    '.MuiDrawer-paper:hover &': {
        opacity: 1,
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

const MainLayout = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [openSubMenu, setOpenSubMenu] = useState({ rrhh: true });
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    // --- ESTADO Y MANEJADORES PARA EL MENÚ DE PERFIL ---
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Datos de ejemplo para el usuario (más adelante los traeremos de la API)
    const [userData, setUserData] = React.useState({
        name: 'David Restrepo',
        initial: 'D'
    });

    const toggleSidebar = () => setIsExpanded(!isExpanded);
    
    const handleSubMenuClick = (name) => {
        setOpenSubMenu(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    
    // Determina si el sidebar debe mostrar contenido completo
    const shouldShowContent = isExpanded || isHovered;
    
    // Función para renderizar el menú
    const renderNavItems = (items) => {
        const iconColor = 'rgba(255, 255, 255, 0.85)';
        const listItemStyles = {
            ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            '&.Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            '&.Mui-selected:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
            borderRadius: '8px',
            margin: '4px 8px',
            position: 'relative',
            zIndex: 1,
            justifyContent: shouldShowContent ? 'flex-start' : 'center',
            minHeight: 48,
        };

        return items.map((item) => {
            if (item.children) {
                return (
                    <React.Fragment key={item.text}>
                        <ListItemButton 
                            onClick={() => handleSubMenuClick(item.name)} 
                            sx={listItemStyles}
                        >
                            <ListItemIcon sx={{ 
                                color: iconColor, 
                                minWidth: shouldShowContent ? '40px' : 'auto',
                                mr: shouldShowContent ? 0 : 0,
                                justifyContent: 'center'
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            {shouldShowContent && (
                                <>
                                    <ListItemText primary={item.text} />
                                    {openSubMenu[item.name] ? <ExpandLess /> : <ExpandMore />}
                                </>
                            )}
                        </ListItemButton>
                        <Collapse 
                            in={shouldShowContent && openSubMenu[item.name]} 
                            timeout="auto" 
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                {item.children.map((child) => (
                                    <ListItemButton 
                                        key={child.text} 
                                        component={RouterLink} 
                                        to={child.path} 
                                        selected={location.pathname === child.path} 
                                        sx={{ 
                                            ...listItemStyles, 
                                            pl: shouldShowContent ? 4 : 1,
                                            justifyContent: shouldShowContent ? 'flex-start' : 'center',
                                        }}
                                    >
                                        <ListItemIcon sx={{ 
                                            color: iconColor, 
                                            minWidth: shouldShowContent ? '40px' : 'auto',
                                            justifyContent: 'center'
                                        }}>
                                            {child.icon}
                                        </ListItemIcon>
                                        {shouldShowContent && <ListItemText primary={child.text} />}
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                );
            }
            return (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton 
                        component={RouterLink} 
                        to={item.path} 
                        selected={location.pathname === item.path} 
                        sx={listItemStyles}
                    >
                        <ListItemIcon sx={{ 
                            color: iconColor, 
                            minWidth: shouldShowContent ? '40px' : 'auto',
                            justifyContent: 'center'
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        {shouldShowContent && <ListItemText primary={item.text} />}
                    </ListItemButton>
                </ListItem>
            );
        });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                elevation={3}
                sx={{
                    width: `calc(100% - ${isExpanded ? drawerWidth : 60}px)`,
                    ml: `${isExpanded ? drawerWidth : 60}px`,
                    backgroundColor: 'white',
                    color: '#333',
                    backdropFilter: 'blur(5px)',
                }}
            >
                <Toolbar sx={{ 
                        minHeight: { xs: '55px', sm: '55px', md: '55px' },
                        height: '55px'
                    }}>
                    <IconButton color="inherit" onClick={toggleSidebar} edge="start" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                        <img src="/logo.png" alt="NexoERP Logo" style={{ height: '30px'}} />

                        {/* Este Box actúa como un resorte para empujar el menú a la derecha */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Menú de Perfil */}
                        <Button
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            sx={{ textTransform: 'none', borderRadius: '16px', padding: '4px 8px' }}
                        >
                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#0057E7' }}>
                                {userData.initial}
                            </Avatar>
                            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {userData.name}
                            </Typography>
                        </Button>
                </Toolbar>
            </AppBar>

            {/* Menú desplegable del perfil */}
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                sx={{ mt: 1}}
            >
                <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleMenuClose}>Cuenta</MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>Cerrar Sesión</MenuItem>
            
            </Menu>
            
            <StyledDrawer
                variant="permanent"
                anchor="left"
                open={isExpanded}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Toolbar />
                <Divider sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.2)', 
                    position: 'relative', 
                    zIndex: 1 
                }} />
                <List sx={{ position: 'relative', zIndex: 1 }} className="drawer-content">
                    {renderNavItems(navItems)}
                </List>
            </StyledDrawer>
            
            <Box
                component="main"
                className="main-content-wrapper animated-background"
                sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    position: 'relative',
                    transition: (theme) => theme.transitions.create(['margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar />
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;