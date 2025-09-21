from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Sede, Cargo, Colaborador
from .serializers import SedeSerializer, CargoSerializer, ColaboradorReadSerializer, ColaboradorWriteSerializer, historialColaboradorSerializer

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
        if self.action in ['create', 'update', 'partial_update']:
            return ColaboradorWriteSerializer
        return super().get_serializer_class()

    @action(detail=True, methods=['get'], url_path='historial')
    def historial(self, request, pk=None):
        try:
            colaborador = self.get_object()
            historial = colaborador.history.all()
            serializer = historialColaboradorSerializer(historial, many=True)
            return Response(serializer.data)
        except Colaborador.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)