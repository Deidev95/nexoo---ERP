from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Sede, Cargo, Colaborador

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    pass

@admin.register(Sede)
class SedeAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'direccion', 'estado')

@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nivel_jerarquico')

@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('cedula', 'primer_nombre', 'primer_apellido', 'cargo', 'sede', 'estado_empleado')
    list_filter = ('estado_empleado', 'cargo', 'sede')
    search_fields = ('cedula', 'primer_nombre', 'primer_apellido')
