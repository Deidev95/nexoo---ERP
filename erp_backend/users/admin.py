from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from simple_history.admin import SimpleHistoryAdmin
from .models import (
    User, Sede, Cargo, Colaborador,
    Gerencia, Area, SubArea, ConfiguracionNomina
)

# --- 1. USUARIO ---
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    pass

# --- 2. CONFIGURACIÓN GLOBAL ---
@admin.register(ConfiguracionNomina)
class ConfiguracionNominaAdmin(admin.ModelAdmin):
    list_display = ('anio_vigencia', 'salario_minimo', 'auxilio_transporte')

# --- 3. ESTRUCTURA ORGANIZACIONAL ---
# Esto permite agregar SubAreas directamente dentro de un Area
class SubAreaInline(admin.TabularInline):
    model = SubArea
    extra = 1

@admin.register(Gerencia)
class GerenciaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'gerencia')
    list_filter = ('gerencia',)
    inlines = [SubAreaInline]

@admin.register(SubArea)
class SubAreaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo_centro_costos', 'area')
    list_filter = ('area__gerencia', 'area')
    search_fields = ('nombre', 'codigo_centro_costos')

# --- 4. CATÁLOGOS ---
@admin.register(Sede)
class SedeAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion', 'estado')

@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nivel_jerarquico')

# --- 5. COLABORADOR ---
@admin.register(Colaborador)
class ColaboradorAdmin(SimpleHistoryAdmin):

    list_display = ('cedula', 'primer_apellido', 'primer_nombre', 'cargo', 'sede', 'sub_area', 'estado_empleado')
    
    list_filter = ('estado_empleado', 'cargo', 'sede', 'sub_area', 'tipo_contrato')
    
    search_fields = ('cedula', 'primer_nombre', 'primer_apellido', 'correo_personal')
    
    fieldsets = (
        ('Identificación', {
            'fields': ('tipo_documento', 'cedula', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'fecha_nacimiento', 'genero', 'estado_civil', 'nacionalidad')
        }),
        ('Contacto y Ubicación', {
            'fields': ('correo_personal', 'telefono', 'direccion', 'departamento', 'municipio', 'correo_corporativo', 'telefono_oficina')
        }),
        ('Información Laboral', {
            'fields': ('fecha_ingreso', 'cargo', 'sede', 'sub_area', 'jefe_inmediato', 'estado_empleado', 'user')
        }),
        ('Contratación y Salario', {
            'fields': ('tipo_contrato', 'termino_contrato', 'salario', 'auxilio_transporte', 'dias_vacaciones')
        }),
        ('Seguridad Social y Pagos', {
            'fields': ('banco', 'tipo_cuenta', 'numero_cuenta', 'eps', 'fondo_pensiones', 'fondo_cesantias')
        }),
        ('Desvinculación', {
            'fields': ('fecha_desvinculacion', 'motivo_retiro'),
            'classes': ('collapse',), # Esto hace que la sección salga contraída por defecto
        }),
    )