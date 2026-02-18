from django.db import models
from django.contrib.auth.models import AbstractUser
from simple_history.models import HistoricalRecords
from django.conf import settings
from .choices import *

# Modelo de configuración global (SMLV)
class ConfiguracionNomina(models.Model):
    anio_vigencia = models.IntegerField(unique=True, help_text="Año de vigencia de estos valores")
    salario_minimo = models.DecimalField(max_digits=12, decimal_places=2)
    auxilio_transporte = models.DecimalField(max_digits=12, decimal_places=2)
    
    def __str__(self):
        return f"Configuración {self.anio_vigencia}"

    class Meta:
        verbose_name = "Configuración de Nómina"
        verbose_name_plural = "Configuraciones de Nómina"

# Estructura Organizacional (Centros de Costos)
class Gerencia(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.nombre

class Area(models.Model):
    nombre = models.CharField(max_length=100)
    gerencia = models.ForeignKey(Gerencia, on_delete=models.CASCADE, related_name='areas')
    
    def __str__(self):
        return f"{self.nombre} - ({self.gerencia.nombre})"

class SubArea(models.Model):
    nombre = models.CharField(max_length=100)
    codigo_centro_costos = models.CharField(max_length=20, unique=True, help_text="Código contable del Centro de Costos")
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='subareas')
    
    def __str__(self):
        return f"{self.nombre} ({self.codigo_centro_costos})"

# Modelo de autenticación personalizado
class User(AbstractUser):
    pass

# Modelos para la gestión de colaboradores
class Sede(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    estado = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre

class Cargo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nivel_jerarquico = models.CharField(max_length=50, choices=[
        ('ESTRATEGICO', 'Estratégico'),
        ('TACTICO', 'Táctico'),
        ('OPERATIVO', 'Operativo')
    ], default='OPERATIVO')
    
    areas = models.ManyToManyField('Area', related_name='cargos', blank=True, help_text="Áreas a las que pertenece este cargo")

    def __str__(self):
        return self.nombre

class Colaborador(models.Model):
    
    MOTIVOS_RETIRO = [
        ('RENUNCIA_VOLUNTARIA', 'Renuncia voluntaria'),
        ('TERMINACION_OBRA', 'Terminación obra o labor'),
        ('TERMINACION_JUSTA_CAUSA', 'Terminación de contrato con justa causa'),
        ('MUTUO_ACUERDO', 'Mutuo acuerdo'),
        ('VENCIMIENTO_TERMINO_FIJO', 'Vencimiento contrato fijo'),
        ('TERMINACION_APRENDIZAJE', 'Terminación contrato de aprendizaje'),
        ('MUERTE', 'Muerte del trabajador'),
        ('PERIODO_PRUEBA', 'Terminación del contrato por periodo de prueba'),
        ('ABANDONO_CARGO', 'Abandono de cargo'),
        ('SIN_JUSTA_CAUSA', 'Terminación de contrato sin justa causa'),
    ]
    
    # 1. Identificación Personal
    tipo_documento = models.CharField(max_length=10, choices=TIPOS_DOCUMENTO, default='CC')
    cedula = models.CharField(max_length=20, unique=True, verbose_name="Número de Documento")
    
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, blank=True, null=True)
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50, blank=True, null=True)
    
    genero = models.CharField(max_length=1, choices=GENEROS)
    fecha_nacimiento = models.DateField()
    nacionalidad = models.CharField(max_length=50, default='Colombiana')
    estado_civil = models.CharField(max_length=20, choices=ESTADO_CIVIL, default='SOLTERO')

    # 2. Ubicación y Contacto
    direccion = models.CharField(max_length=200)
    departamento = models.CharField(max_length=100) 
    municipio = models.CharField(max_length=100)
    
    correo_personal = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, verbose_name="Celular / Teléfono")
    
    correo_corporativo = models.EmailField(blank=True, null=True)
    telefono_oficina = models.CharField(max_length=20, blank=True, null=True)

    # 3. Información Laboral y Organizacional
    fecha_ingreso = models.DateField(verbose_name="Fecha de Ingreso", null=True, blank=True)
    cargo = models.ForeignKey('Cargo', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Cargo")
    sede = models.ForeignKey('Sede', on_delete=models.SET_NULL, null=True)
    
    # Centro de Costos
    sub_area = models.ForeignKey('SubArea', on_delete=models.SET_NULL, null=True, verbose_name="Centro de Costos")
    
    # Jefe Inmediato
    jefe_inmediato = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinados')
    
    # Estado del Empleado
    estado_empleado = models.CharField(max_length=20, default='ACTIVO')
    
    # Control de Reingresos
    numero_contrato = models.PositiveIntegerField(default=1, verbose_name="Número de Contrato Actual")

    # 4. Contratación y Nómina
    tipo_contrato = models.CharField(max_length=30, choices=TIPOS_CONTRATO, default='INDEFINIDO', verbose_name="Tipo de Contrato", null=True, blank=True)
    termino_contrato = models.DateField(blank=True, null=True, help_text="Fecha fin de contrato si aplica")
    
    salario = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    auxilio_transporte = models.BooleanField(default=True, help_text="¿Recibe auxilio de transporte legal?")
    
    banco = models.CharField(max_length=50, choices=BANCOS)
    tipo_cuenta = models.CharField(max_length=20, choices=TIPOS_CUENTA, default='AHORROS')
    numero_cuenta = models.CharField(max_length=50)
    
    eps = models.CharField(max_length=50, choices=EPS_LIST)
    fondo_pensiones = models.CharField(max_length=50, choices=FONDO_PENSIONES)
    fondo_cesantias = models.CharField(max_length=50, choices=FONDO_CESANTIAS)
    
    dias_vacaciones = models.CharField(max_length=5, choices=DIAS_VACACIONES, default='L-V', help_text="Define si el sábado cuenta como hábil")

    # Campos de Retiro
    fecha_desvinculacion = models.DateField(blank=True, null=True)
    motivo_retiro = models.CharField(max_length=50, choices=MOTIVOS_RETIRO, blank=True, null=True)

    # Auditoría
    history = HistoricalRecords()

    # Vinculación con el usuario del sistema
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        help_text="Usuario del sistema vinculado al colaborador"
    )

    # Lógica para formatear nombres y correos antes de guardar
    def save(self, *args, **kwargs):
        if self.primer_nombre: self.primer_nombre = self.primer_nombre.title()
        if self.segundo_nombre: self.segundo_nombre = self.segundo_nombre.title()
        if self.primer_apellido: self.primer_apellido = self.primer_apellido.title()
        if self.segundo_apellido: self.segundo_apellido = self.segundo_apellido.title()
        
        if self.correo_personal: self.correo_personal = self.correo_personal.lower()
        if self.correo_corporativo: self.correo_corporativo = self.correo_corporativo.lower()

        super(Colaborador, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido}"
    
class HistoricoContrato(models.Model):
    """
    Tabla para guardar el historial de vinculaciones pasadas.
    Se llena automáticamente cuando se procesa un Retiro/Reingreso.
    """
    colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE, related_name='contratos_previos')
    fecha_inicio = models.DateField(verbose_name="Fecha de Inicio")
    fecha_fin = models.DateField(verbose_name="Fecha de Finalización")
    motivo_retiro = models.CharField(max_length=255, null=True, blank=True)
    
    # guardamos 'snapshots' (texto) de la estructura en ese momento.
    # debemos texto porque si en el futuro la Gerencia cambia de nombre, 
    # el historial debe mostrar cómo se llamaba EN ESE MOMENTO.
    cargo_snapshot = models.CharField(max_length=255, null=True, blank=True)
    gerencia_snapshot = models.CharField(max_length=255, null=True, blank=True)
    area_snapshot = models.CharField(max_length=255, null=True, blank=True)
    sede_snapshot = models.CharField(max_length=255, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contrato Previo - {self.colaborador} ({self.fecha_fin})"