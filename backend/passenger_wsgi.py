import sys
import os

# Caminho do interpretador Python dentro do virtualenv criado pelo Hostinger
INTERP = os.path.join(os.environ['HOME'], 'virtualenv', 'atrpap', 'backend', '3.11', 'bin', 'python')
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Adiciona o backend ao path do Python
sys.path.insert(0, os.path.join(os.environ['HOME'], 'atrpap', 'backend'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
