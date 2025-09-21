import React from "react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Bienvenido al Dashboard de NexooERP</h1>
            <p>Aquí se mostrarán los indicadores clave y los accesos a los módulos.</p>
            <p>Esta en construcción.</p>
            <Link to="/rrhh">Ir al Panel de RRHH</Link>
        </div>
    );
};

export default DashboardPage;
