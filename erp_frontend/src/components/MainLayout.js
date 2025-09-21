// src/components/MainLayout.js

import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Collapse, IconButton } from '@mui/material';

// Importa los íconos que usaremos
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu'; // <-- Ícono para el botón de menú

const drawerWidth = 240; // Ancho del menú expandido

const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
        text: 'RRHH',
        icon: <BusinessIcon />,
        name: 'rrhh',
        children: [
            { text: 'Panel RRHH', icon: <AssessmentIcon />, path: '/rrhh' },
            { text: 'Colaboradores', icon: <PeopleIcon />, path: '/rrhh/colaboradores' },
        ],
    },
];

const MainLayout = ({ children }) => {
    // --- NUEVOS ESTADOS ---
    const [isSidebarOpen, setSidebarOpen] = useState(true); // Estado para el menú principal (abierto/cerrado)
    const [openSubMenu, setOpenSubMenu] = useState({ rrhh: true }); // Estado para los submenús
    
    const location = useLocation();

    // --- NUEVAS FUNCIONES ---
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSubMenuClick = (name) => {
        setOpenSubMenu(prevOpen => ({ ...prevOpen, [name]: !prevOpen[name] }));
    };

    const renderNavItems = (items) => {
        // ... (Esta función se queda igual que antes, la incluimos para que el código esté completo)
        return items.map((item) => {
            if (item.children) {
                return (
                    <React.Fragment key={item.text}>
                        <ListItemButton onClick={() => handleSubMenuClick(item.name)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {/* El texto y el ícono de expandir solo se muestran si el menú está abierto */}
                            {isSidebarOpen && <ListItemText primary={item.text} />}
                            {isSidebarOpen && (openSubMenu[item.name] ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                        <Collapse in={isSidebarOpen && openSubMenu[item.name]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {item.children.map((child) => (
                                    <ListItemButton
                                        key={child.text}
                                        component={RouterLink} to={child.path}
                                        sx={{ pl: 4 }}
                                        selected={location.pathname === child.path}
                                    >
                                        <ListItemIcon>{child.icon}</ListItemIcon>
                                        <ListItemText primary={child.text} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                );
            }
            return (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton component={RouterLink} to={item.path} selected={location.pathname === item.path}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        {isSidebarOpen && <ListItemText primary={item.text} />}
                    </ListItemButton>
                </ListItem>
            );
        });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* --- APPBAR MODIFICADA --- */}
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${isSidebarOpen ? drawerWidth : 60}px)`, // Ancho dinámico
                    ml: `${isSidebarOpen ? drawerWidth : 60}px`,
                    transition: (theme) => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar>
                    {/* Botón para abrir/cerrar el menú */}
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        onClick={toggleSidebar}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        NEXOO ERP
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* --- DRAWER MODIFICADO --- */}
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: isSidebarOpen ? drawerWidth : 60, // Ancho dinámico
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    '& .MuiDrawer-paper': {
                        width: isSidebarOpen ? drawerWidth : 60, // Ancho dinámico del papel interior
                        overflowX: 'hidden', // Oculta el texto que se desborda al cerrar
                        transition: (theme) => theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
            >
                <Toolbar />
                <Divider />
                <List>{renderNavItems(navItems)}</List>
            </Drawer>
            
            {/* --- CONTENIDO PRINCIPAL --- */}
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;