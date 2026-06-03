from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAdminUser

from .repositories import (
    NoticiaRepository,
    GaleriaRepository,
    DocumentoRepository,
    ProjetoRepository,
    LinhaOrcamentariaRepository,
    ProtocoloRepository,
    ExcecaoRepository,
)
from .serializers import (
    NoticiaListSerializer, NoticiaDetailSerializer, NoticiaWriteSerializer,
    GaleriaSerializer, GaleriaWriteSerializer,
    DocumentoSerializer, DocumentoWriteSerializer,
    LinhaOrcamentariaReadSerializer, LinhaOrcamentariaWriteSerializer,
    ProjetoSerializer, ProjetoWriteSerializer,
    ProtocoloSerializer, ProtocoloWriteSerializer,
    ExcecaoSerializer, ExcecaoWriteSerializer,
)

_SAFE = ('GET', 'HEAD', 'OPTIONS')


class NoticiaViewSet(viewsets.ModelViewSet):
    filter_backends = [SearchFilter]
    search_fields   = ['titulo', 'resumo', 'categoria']

    def get_queryset(self):
        repo = NoticiaRepository()
        if self.request.user.is_staff:
            return repo.all()
        return repo.published()

    def get_serializer_class(self):
        if self.action == 'list':
            return NoticiaListSerializer
        if self.action == 'retrieve':
            return NoticiaDetailSerializer
        return NoticiaWriteSerializer

    def get_permissions(self):
        if self.request.method in _SAFE:
            return [AllowAny()]
        return [IsAdminUser()]


class GaleriaViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        repo = GaleriaRepository()
        if self.request.user.is_staff:
            return repo.all()
        return repo.active()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return GaleriaSerializer
        return GaleriaWriteSerializer

    def get_permissions(self):
        if self.request.method in _SAFE:
            return [AllowAny()]
        return [IsAdminUser()]


class DocumentoViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        repo = DocumentoRepository()
        categoria = self.request.query_params.get('categoria')
        if categoria:
            return repo.by_category(categoria)
        return repo.all()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return DocumentoSerializer
        return DocumentoWriteSerializer

    def get_permissions(self):
        if self.request.method in _SAFE:
            return [AllowAny()]
        return [IsAdminUser()]


class ProjetoViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        repo = ProjetoRepository()
        status = self.request.query_params.get('status')
        if status:
            return repo.by_status(status)
        return repo.all()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return ProjetoSerializer
        return ProjetoWriteSerializer

    def get_permissions(self):
        if self.request.method in _SAFE:
            return [AllowAny()]
        return [IsAdminUser()]


class LinhaOrcamentariaViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        repo = LinhaOrcamentariaRepository()
        projeto_id = self.request.query_params.get('projeto')
        if projeto_id:
            return repo.by_projeto(projeto_id)
        return repo.all()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return LinhaOrcamentariaReadSerializer
        return LinhaOrcamentariaWriteSerializer

    def get_permissions(self):
        if self.request.method in _SAFE:
            return [AllowAny()]
        return [IsAdminUser()]


class ProtocoloViewSet(viewsets.ModelViewSet):
    filter_backends = [SearchFilter]
    search_fields   = ['numero', 'descricao', 'aprovado_por']

    def get_queryset(self):
        return ProtocoloRepository().all()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return ProtocoloSerializer
        return ProtocoloWriteSerializer

    def get_permissions(self):
        if self.request.method in _SAFE:
            return [AllowAny()]
        return [IsAdminUser()]


class ExcecaoViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        repo = ExcecaoRepository()
        status = self.request.query_params.get('status')
        tipo   = self.request.query_params.get('tipo')
        if status:
            return repo.by_status(status)
        if tipo:
            return repo.by_tipo(tipo)
        return repo.all()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return ExcecaoSerializer
        return ExcecaoWriteSerializer

    def get_permissions(self):
        if self.request.method in _SAFE:
            return [AllowAny()]
        return [IsAdminUser()]
