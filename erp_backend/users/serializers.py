from rest_framework import serializers
from .models import Sede, Cargo, Colaborador, Gerencia, Area, SubArea, ConfiguracionNomina, HistoricoContrato

# Serializers de estructuras organizacionales
class ConfiguracionNominaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionNomina
        fields = '__all__'

class GerenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gerencia
        fields = '__all__'

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class SubAreaSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = SubArea
        fields = '__all__'

    def get_display_name(self, obj):
        return f"{obj.nombre} ({obj.codigo_centro_costos})"

class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = '__all__'
        
class CargoSerializer(serializers.ModelSerializer):
    areas_nombres = serializers.StringRelatedField(many=True, source='areas', read_only=True)
    class Meta:
        model = Cargo
        fields = '__all__'

# Sertializers para Colaborador
class ColaboradorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = '__all__'
    
    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            instance._history_user = request.user
        return super().update(instance, validated_data)
    
class HistoricoContratoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoContrato
        fields = ['id', 'fecha_inicio', 'fecha_fin', 'motivo_retiro', 'cargo_snapshot', 'gerencia_snapshot', 'area_snapshot']
        
class ColaboradorReadSerializer(serializers.ModelSerializer):
    
    cargo_nombre = serializers.CharField(source='cargo.nombre', read_only=True, default='---')
    area_nombre = serializers.CharField(source='sub_area.area.nombre', read_only=True, default='---')
    gerencia_nombre = serializers.CharField(source='sub_area.area.gerencia.nombre', read_only=True, default='---')   
    sub_area_nombre = serializers.CharField(source='sub_area.nombre', read_only=True, default='---')
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True, default='---')
    
    contratos_previos = HistoricoContratoSerializer(many=True, read_only=True)
    
    jefe_inmediato_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Colaborador
        fields = '__all__'

    def get_jefe_inmediato_nombre(self, obj):
        if obj.jefe_inmediato:
            return f"{obj.jefe_inmediato.primer_nombre} {obj.jefe_inmediato.primer_apellido}"
        return None

# Serializer para el historial de cambios del Colaborador
class historialColaboradorSerializer(serializers.ModelSerializer):
    history_user = serializers.StringRelatedField()
    changes = serializers.SerializerMethodField()
    
    class Meta:
        model = Colaborador.history.model
        fields = ['history_id', 'history_date', 'history_user', 'history_type', 'changes', 'history_change_reason']
        
    def get_changes(self, obj):
        if obj.history_type == '~' and obj.prev_record:
            delta = obj.diff_against(obj.prev_record)
            
            # Diccionarios de traducción (aqui cargamos los nombres para no mostrar IDs)
            sedes = {s.id: s.nombre for s in Sede.objects.all()}
            cargos = {c.id: c.nombre for c in Cargo.objects.all()}
            subareas = {sa.id: sa.nombre for sa in SubArea.objects.all()}
            
            changes_list = []
            for change in delta.changes:
                field_name = change.field
                old_value = change.old
                new_value = change.new
                
                # --- Función para eliminar 'none' cuando es reingreso ---
                def clean(val):
                    return val if val is not None else 'Sin Asignar'

                # Traducción de Cargo
                if field_name == 'cargo':
                    old_name = cargos.get(old_value, f"ID: {old_value}") if old_value is not None else 'Sin Asignar'
                    new_name = cargos.get(new_value, f"ID: {new_value}") if new_value is not None else 'Sin Asignar'
                    changes_list.append(f"Cargo: '{old_name}' -> '{new_name}'")
                    
                # Traducción de Sede
                elif field_name == 'sede':
                    old_name = sedes.get(old_value, f"ID: {old_value}") if old_value is not None else 'Sin Asignar'
                    new_name = sedes.get(new_value, f"ID: {new_value}") if new_value is not None else 'Sin Asignar'
                    changes_list.append(f"Sede: '{old_name}' -> '{new_name}'")

                # Traducción de Centro de Costos (SubArea)
                elif field_name == 'sub_area':
                    old_name = subareas.get(old_value, f"ID: {old_value}") if old_value is not None else 'Sin Asignar'
                    new_name = subareas.get(new_value, f"ID: {new_value}") if new_value is not None else 'Sin Asignar'
                    changes_list.append(f"Centro Costos: '{old_name}' -> '{new_name}'")
                    
                # Traducción de Estado
                elif field_name == 'estado_empleado':
                     changes_list.append(f"Estado: '{clean(old_value)}' -> '{clean(new_value)}'")

                # Traducción General (Fechas, contratos, etc.)
                else:
                    # Aquí atrapamos fecha_ingreso, tipo_contrato, etc.
                    changes_list.append(f"{field_name}: '{clean(old_value)}' -> '{clean(new_value)}'")
                    
            return ', '.join(changes_list)
        return None