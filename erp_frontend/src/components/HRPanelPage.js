import React from 'react';
import { Link } from 'react-router-dom'; 

const HRPanelPage = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Panel de Recursos Humanos (RRHH)</h1>
            <p>Aquí se mostrarán los sub-módulos de RRHH.</p>
            <p>Esto esta en construcción.</p>
            <Link to="/rrhh/colaboradores">Ir a la lista de Colaboradores</Link>
        </div>
    );
};

export default HRPanelPage;