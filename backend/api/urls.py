from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from . import views

router = DefaultRouter()
router.register('noticias',   views.NoticiaViewSet,            basename='noticia')
router.register('galeria',    views.GaleriaViewSet,            basename='galeria')
router.register('documentos', views.DocumentoViewSet,          basename='documento')
router.register('projetos',   views.ProjetoViewSet,            basename='projeto')
router.register('linhas',     views.LinhaOrcamentariaViewSet,  basename='linha')
router.register('protocolos', views.ProtocoloViewSet,          basename='protocolo')
router.register('excecoes',   views.ExcecaoViewSet,            basename='excecao')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', obtain_auth_token, name='api-token'),
]
