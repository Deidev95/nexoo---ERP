from django.db import models
from django.contrib.auth.models import AbstractUser
from simple_history.models import HistoricalRecords
from django.conf import settings

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
    nombre = models.CharField(max_length=100)
    nivel_jerarquico = models.IntegerField(default=1)

    def __str__(self):
        return self.nombre

class Colaborador(models.Model):
    cedula = models.CharField(max_length=20, unique=True)
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50, blank=True, null=True)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    correo_personal = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_ingreso = models.DateField()
    fecha_desvinculacion = models.DateField(blank=True, null=True)
    estado_empleado = models.CharField(max_length=20, default='ACTIVO')
    
    # Relaciones
    cargo = models.ForeignKey(Cargo, on_delete=models.SET_NULL, null=True)
    sede = models.ForeignKey(Sede, on_delete=models.SET_NULL, null=True)
    history = HistoricalRecords()
    
    # Esto crea  un vinculo uno-a-uno con el modelo User de Django
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f'{self.primer_nombre} {self.primer_apellido}'
