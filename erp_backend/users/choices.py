TIPOS_DOCUMENTO = [
    ('CC', 'Cédula de Ciudadanía'),
    ('CE', 'Cédula de Extranjería'),
    ('TI', 'Tarjeta de Identidad'),
    ('PAS', 'Pasaporte'),
    ('PEP', 'Permiso Especial de Permanencia'),
    ('PPT', 'Permiso por Protección Temporal'),
    ('OTRO', 'Otro'),
]

GENEROS = [
    ('M', 'Masculino'),
    ('F', 'Femenino'),
]

ESTADO_CIVIL = [
    ('SOLTERO', 'Soltero(a)'),
    ('CASADO', 'Casado(a)'),
    ('UNION_LIBRE', 'Unión Libre'),
    ('SEPARADO', 'Separado(a)'),
    ('DIVORCIADO', 'Divorciado(a)'),
    ('VIUDO', 'Viudo(a)'),
]

TIPOS_CONTRATO = [
    ('INDEFINIDO', 'Indefinido'),
    ('FIJO', 'Término Fijo'),
    ('OBRA_LABOR', 'Obra o Labor'),
    ('APRENDIZ_SENA', 'Aprendizaje SENA'),
    ('PRACTICANTE', 'Practicante Universitario'),
    ('PRESTACION_SERVICIOS', 'Prestación de Servicios'),
]

TIPOS_CUENTA = [
    ('AHORROS', 'Ahorros'),
    ('CORRIENTE', 'Corriente'),
]

BANCOS = [
    ('BANCOLOMBIA', 'Bancolombia'),
    ('DAVIVIENDA', 'Davivienda'),
    ('BBVA', 'BBVA'),
    ('BOGOTA', 'Banco de Bogotá'),
    ('OCCIDENTE', 'Banco de Occidente'),
    ('AV_VILLAS', 'Banco AV Villas'),
    ('NEQUI', 'Nequi'),
    ('DAVIPLATA', 'Daviplata'),
    # ... agregar el resto ...
]

EPS_LIST = [
    ('SURA', 'EPS Sura'),
    ('SANITAS', 'Sanitas'),
    ('NUEVA_EPS', 'Nueva EPS'),
    ('SALUD_TOTAL', 'Salud Total'),
    ('COOMEVA', 'Coomeva'),
    ('FAMISANAR', 'Famisanar'),
    ('COMPENSAR', 'Compensar'),
    ('ALIANSALUD', 'Aliansalud'),
    ('NO_APLICA', 'No Aplica'),
    # ... agregar el resto ...
]

FONDO_PENSIONES = [
    ('PROTECCION', 'Protección'),
    ('PORVENIR', 'Porvenir'),
    ('COLFONDOS', 'Colfondos'),
    ('SKANDIA', 'Skandia'),
    ('COLPENSIONES', 'Colpensiones'),
    ('NO_APLICA', 'No Aplica'),
]

FONDO_CESANTIAS = [
    ('PROTECCION', 'Protección'),
    ('PORVENIR', 'Porvenir'),
    ('COLFONDOS', 'Colfondos'),
    ('FNA', 'Fondo Nacional del Ahorro'),
    ('NO_APLICA', 'No Aplica'),
]

DIAS_VACACIONES = [
    ('L-V', 'Lunes a Viernes (Sábado NO hábil)'),
    ('L-S', 'Lunes a Sábado (Sábado hábil)'),
]