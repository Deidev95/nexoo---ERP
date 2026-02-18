from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Colaborador, HistoricoContrato
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from .models import User, Sede, Cargo, Colaborador, Gerencia, Area, SubArea, ConfiguracionNomina
from .serializers import (SedeSerializer, CargoSerializer, ColaboradorReadSerializer, 
    ColaboradorWriteSerializer, 
    historialColaboradorSerializer, 
    GerenciaSerializer, 
    AreaSerializer, 
    SubAreaSerializer, 
    ConfiguracionNominaSerializer)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class SedeViewSet(viewsets.ModelViewSet):
    queryset = Sede.objects.all()
    serializer_class = SedeSerializer

class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer

class ColaboradorViewSet(viewsets.ModelViewSet):
    queryset = Colaborador.objects.all()
    serializer_class = ColaboradorReadSerializer
    
    def get_serializer_class(self):
        
        if self.request.query_params.get('modo_edicion') == 'true':
            return ColaboradorWriteSerializer
            
        if self.action in ['create', 'update', 'partial_update']:
            return ColaboradorWriteSerializer
        
        return super().get_serializer_class()

    @action(detail=False, methods=['get'])
    def kpis(self, request):
        
        total = Colaborador.objects.count()
        now = timezone.now()
        nuevos_mes = Colaborador.objects.filter(fecha_ingreso__year=now.year, fecha_ingreso__month=now.month).count()
        return Response({ "total_colaboradores": total, "nuevos_este_mes": nuevos_mes, "indicadores": { "trm": 4100, "uvr": 350.2, "smlv": 1300000 } })

    @action(detail=True, methods=['get'], url_path='historial')
    def historial(self, request, pk=None):
        try:
            colaborador = self.get_object()
            historial = colaborador.history.all()
            serializer = historialColaboradorSerializer(historial, many=True)
            return Response(serializer.data)
        except Colaborador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def perform_update(self, serializer):
        # 1. Obtenemos cómo estaba el colaborador ANTES de los cambios
        instance_anterior = self.get_object()
        estado_anterior = instance_anterior.estado_empleado
        
        # 2. Guardamos los cambios nuevos, actualizamos la BD 
        colaborador_actualizado = serializer.save()
        
        # 3. Lógica de historico de contratos
        if estado_anterior == 'ACTIVO' and colaborador_actualizado.estado_empleado == 'INACTIVO':
            HistoricoContrato.objects.create(
                colaborador=colaborador_actualizado,
                fecha_inicio=colaborador_actualizado.fecha_ingreso,
                fecha_fin=colaborador_actualizado.fecha_desvinculacion,
                motivo_retiro=colaborador_actualizado.motivo_retiro,
                # Guardamos la 'foto' de dónde trabajaba (Snapshots)
                cargo_snapshot=colaborador_actualizado.cargo.nombre if colaborador_actualizado.cargo else 'Sin Cargo',
                gerencia_snapshot=colaborador_actualizado.sub_area.area.gerencia.nombre if colaborador_actualizado.sub_area else '---',
                area_snapshot=colaborador_actualizado.sub_area.area.nombre if colaborador_actualizado.sub_area else '---',
                sede_snapshot=colaborador_actualizado.sede.nombre if colaborador_actualizado.sede else '---'
            )
            
    @action(detail=True, methods=['post'])
    def reactivar(self, request, pk=None):
        """
        Prepara el reingreso: Limpia datos y sube contador, PERO MANTIENE INACTIVO
        hasta que se guarden los datos en el formulario de edición.
        """
        colaborador = self.get_object()
        
        if colaborador.estado_empleado == 'ACTIVO':
            return Response({'error': 'El colaborador ya está activo.'}, status=400)

        # 1. EVITAR CONTADOR INFINITO: 
        # Si ya está limpio (cargo es None) es porque es un reintento. No sumamos contrato.
        es_reintento = colaborador.cargo is None and colaborador.fecha_ingreso is None
        
        if not es_reintento:
             colaborador.numero_contrato += 1
             
             # Limpiamos datos SOLO si no es un reintento (para no borrar algo que ya estaba limpio)
             colaborador.fecha_ingreso = None 
             colaborador.fecha_desvinculacion = None
             colaborador.motivo_retiro = None
             colaborador.tipo_contrato = None
             colaborador.termino_contrato = None
             colaborador.cargo = None 
        
        # 2. IMPORTANTE: NO LO ACTIVAMOS TODAVÍA 🛑
        # colaborador.estado_empleado = 'ACTIVO'  <-- COMENTADO PARA EVITAR FANTASMAS
        
        # Nota para el historial
        colaborador._change_reason = f'PROCESO DE REINGRESO - PREPARACIÓN CONTRATO #{colaborador.numero_contrato}'
        
        colaborador.save()
        
        return Response({'status': 'Colaborador preparado para contrato', 'numero_contrato': colaborador.numero_contrato})
        
class GerenciaViewSet(viewsets.ModelViewSet):
    queryset = Gerencia.objects.all()
    serializer_class = GerenciaSerializer
    permission_classes = [IsAuthenticated]

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [IsAuthenticated]

class SubAreaViewSet(viewsets.ModelViewSet):
    queryset = SubArea.objects.all()
    serializer_class = SubAreaSerializer
    permission_classes = [IsAuthenticated]