from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from users.views import CustomTokenObtainPairView, SedeViewSet, CargoViewSet, ColaboradorViewSet

# Crea un router para registrar las vistas de la API
router = routers.DefaultRouter()
router.register(r'sedes', SedeViewSet, basename='sedes')
router.register(r'cargos', CargoViewSet, basename='cargos')
router.register(r'colaboradores', ColaboradorViewSet, basename='colaboradores')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)), # Esta línea icluye las URLs de la API
]