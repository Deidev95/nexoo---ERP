// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import HRPanelPage from './components/HRPanelPage';
import ColaboradoresListPage from './components/ColaboradoresListPage';
import ColaboradorProfilePage from './components/ColaboradorProfilePage';
import ColaboradorCreatePage from './components/ColaboradorCreatePage';
import ColaboradorEditPage from './components/ColaboradorEditPage';
import MainLayout from './components/MainLayout'; // <-- 1. IMPORTA EL LAYOUT

function App() {
  return (
    <Router>
      <Routes>
        {/* La ruta de Login queda afuera, no queremos el menú ahí */}
        <Route path="/" element={<LoginPage />} />

        {/* --- RUTAS PROTEGIDAS DENTRO DEL NUEVO LAYOUT --- */}
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
        <Route path="/rrhh" element={<ProtectedRoute><MainLayout><HRPanelPage /></MainLayout></ProtectedRoute>} />
        <Route path="/rrhh/colaboradores" element={<ProtectedRoute><MainLayout><ColaboradoresListPage /></MainLayout></ProtectedRoute>} />
        <Route path="/rrhh/colaboradores/crear" element={<ProtectedRoute><MainLayout><ColaboradorCreatePage /></MainLayout></ProtectedRoute>} />
        <Route path="/rrhh/colaboradores/:id" element={<ProtectedRoute><MainLayout><ColaboradorProfilePage /></MainLayout></ProtectedRoute>} />
        <Route path="/rrhh/colaboradores/:id/editar" element={<ProtectedRoute><MainLayout><ColaboradorEditPage /></MainLayout></ProtectedRoute>} />
        
      </Routes>
    </Router>
  );
}

export default App;