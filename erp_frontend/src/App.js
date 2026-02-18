// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import HRPanelPage from './components/HRPanelPage';
import ColaboradoresListPage from './components/ColaboradoresListPage';
import ColaboradorProfilePage from './components/ColaboradorProfilePage';
import ColaboradorCreatePage from './components/ColaboradorCreatePage';
import ColaboradorEditPage from './components/ColaboradorEditPage';
import MainLayout from './components/MainLayout';
import ColaboradoresMenuPage from './components/ColaboradoresMenuPage';
import GestionEstructuraPage from './components/GestionEstructuraPage';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* --- Rutas principales --- */}
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
          <Route path="/rrhh" element={<ProtectedRoute><MainLayout><HRPanelPage /></MainLayout></ProtectedRoute>} />

          {/* --- Rutas de Colaboradores --- */}
          <Route path="/rrhh/colaboradores" element={<ProtectedRoute><MainLayout><ColaboradoresMenuPage /></MainLayout></ProtectedRoute>} />
          <Route path="/rrhh/colaboradores/listado" element={<ProtectedRoute><MainLayout><ColaboradoresListPage /></MainLayout></ProtectedRoute>} />
          <Route path="/rrhh/colaboradores/crear" element={<ProtectedRoute><MainLayout><ColaboradorCreatePage /></MainLayout></ProtectedRoute>} />
          <Route path="/rrhh/colaboradores/:id" element={<ProtectedRoute><MainLayout><ColaboradorProfilePage /></MainLayout></ProtectedRoute>} />
          <Route path="/rrhh/colaboradores/:id/editar" element={<ProtectedRoute><MainLayout><ColaboradorEditPage /></MainLayout></ProtectedRoute>} />
          <Route path="/rrhh/estructura" element={<ProtectedRoute><MainLayout><GestionEstructuraPage /></MainLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App;