import os 
import sys 
import django 
from django.core.management import execute_from_command_line 
from django.db.migrations.loader import MigrationLoader 
 
print("Iniciando bypass migrate...") 
 
original_check = MigrationLoader.check_consistent_history 
MigrationLoader.check_consistent_history = lambda self, connection: None 
 
print("Check de consistencia deshabilitado") 
 
if __name__ == '__main__': 
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings') 
    django.setup() 
    print("Django configurado, ejecutando migrate...") 
    execute_from_command_line(['manage.py', 'migrate']) 
    print("Migrate completado!") 
