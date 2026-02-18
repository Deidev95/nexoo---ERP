export const TIPOS_DOCUMENTO = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'PAS', label: 'Pasaporte' },
    { value: 'PEP', label: 'Permiso Especial de Permanencia' },
    { value: 'PPT', label: 'Permiso por Protección Temporal' },
    { value: 'OTRO', label: 'Otro' },
];

export const GENEROS = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
];

export const ESTADO_CIVIL = [
    { value: 'SOLTERO', label: 'Soltero(a)' },
    { value: 'CASADO', label: 'Casado(a)' },
    { value: 'UNION_LIBRE', label: 'Unión Libre' },
    { value: 'SEPARADO', label: 'Separado(a)' },
    { value: 'DIVORCIADO', label: 'Divorciado(a)' },
    { value: 'VIUDO', label: 'Viudo(a)' },
];

export const TIPOS_CONTRATO = [
    { value: 'INDEFINIDO', label: 'Indefinido' },
    { value: 'FIJO', label: 'Término Fijo' },
    { value: 'OBRA_LABOR', label: 'Obra o Labor' },
    { value: 'APRENDIZ_SENA', label: 'SENA Etapa Productiva' },
    { value: 'APRENDIZ_LECTIVO', label: 'SENA Etapa Lectiva' },
    { value: 'PRACTICANTE', label: 'Practicante Universitario' },
    { value: 'PRESTACION_SERVICIOS', label: 'Prestación de Servicios' },
];

export const TIPOS_CUENTA = [
    { value: 'AHORROS', label: 'Ahorros' },
    { value: 'CORRIENTE', label: 'Corriente' },
];

export const BANCOS = [
    { value: 'BANCOLOMBIA', label: 'Bancolombia' },
    { value: 'DAVIVIENDA', label: 'Davivienda' },
    { value: 'BBVA', label: 'BBVA' },
    { value: 'BOGOTA', label: 'Banco de Bogotá' },
    { value: 'OCCIDENTE', label: 'Banco de Occidente' },
    { value: 'AV_VILLAS', label: 'Banco AV Villas' },
    { value: 'NEQUI', label: 'Nequi' },
    { value: 'DAVIPLATA', label: 'Daviplata' },
    // agregar más bancos según sea necesario
];

export const EPS_LIST = [
    { value: 'SURA', label: 'EPS Sura' },
    { value: 'SANITAS', label: 'Sanitas' },
    { value: 'NUEVA_EPS', label: 'Nueva EPS' },
    { value: 'SALUD_TOTAL', label: 'Salud Total' },
    { value: 'COOMEVA', label: 'Coomeva' },
    { value: 'FAMISANAR', label: 'Famisanar' },
    { value: 'COMPENSAR', label: 'Compensar' },
    { value: 'ALIANSALUD', label: 'Aliansalud' },
    { value: 'NO_APLICA', label: 'No Aplica' },
];

export const FONDOS_PENSION = [
    { value: 'PROTECCION', label: 'Protección' },
    { value: 'PORVENIR', label: 'Porvenir' },
    { value: 'COLFONDOS', label: 'Colfondos' },
    { value: 'SKANDIA', label: 'Skandia' },
    { value: 'COLPENSIONES', label: 'Colpensiones' },
    { value: 'NO_APLICA', label: 'No Aplica' },
];

export const FONDOS_CESANTIAS = [
    { value: 'PROTECCION', label: 'Protección' },
    { value: 'PORVENIR', label: 'Porvenir' },
    { value: 'COLFONDOS', label: 'Colfondos' },
    { value: 'FNA', label: 'Fondo Nacional del Ahorro' },
    { value: 'NO_APLICA', label: 'No Aplica' },
];