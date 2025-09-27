from rest_framework import serializers
from .models import Sede, Cargo, Colaborador

class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = '__all__'
        
class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = '__all__'
        
class ColaboradorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = '__all__'
        
        def update(self, instance, validated_data):
            instance._history_user = self.context['request'].user
            return super().update(instance, validated_data)
        
class ColaboradorReadSerializer(serializers.ModelSerializer):
    #cargo = serializers.StringRelatedField()
    #sede = serializers.StringRelatedField()
    
    class Meta:
        model = Colaborador
        fields = '__all__'

# Serializer Historial de cambios de Colaborador
class historialColaboradorSerializer(serializers.ModelSerializer):
    history_user = serializers.StringRelatedField()
    changes = serializers.SerializerMethodField() # Campo para mostrar los cambios 
    
    class Meta:
        # Apunta al modelo de historial que crea la librería automáticamente
        model = Colaborador.history.model
        fields = ['history_id', 'history_date', 'history_user', 'history_type', 'changes']
        
    def get_changes(self, obj):
        """
        Este metodo se ejecuta para el campo 'changes'.
        Compara el estado actual con el previo para encontrar diferencias.
        """
        # Solo comparamos la diferencia para los registros de tipo "Actualización"
        if obj.history_type == '~' and obj.prev_record:
            delta = obj.diff_against(obj.prev_record)
            
            # Carga los nombres de sedes y cargos una sola vez
            sedes = {sede.id: sede.nombre for sede in Sede.objects.all()}
            cargos = {cargo.id: cargo.nombre for cargo in Cargo.objects.all()}
            
            changes_list = []
            for change in delta.changes:
                field_name = change.field
                old_value = change.old
                new_value = change.new
                
                # Si el campo es 'cargo' o 'sede', reemplazamos el ID por el nombre
                if field_name == 'cargo':
                    old_name = cargos.get(old_value, f"ID: {old_value}")
                    new_name = cargos.get(new_value, f"ID: {new_value}")
                    changes_list.append(f"cargo: '{old_name}' -> '{new_name}'")
                    
                elif field_name == 'sede':
                    old_name = sedes.get(old_value, f"ID desc.: {old_value}")
                    new_name = sedes.get(new_value, f"ID: {new_value}")
                    changes_list.append(f"sede: '{old_name}' -> '{new_name}'")
                    
                # Logica por defecto para cualquier otro campo
                else:
                    changes_list.append(f"{field_name}: '{old_value}' -> '{new_value}'")
                    
            return ', '.join(changes_list)
        return None