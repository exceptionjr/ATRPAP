from django.db.models import Q
from .models import Noticia, Galeria, Documento, Projeto, LinhaOrcamentaria, Protocolo, Excecao


class BaseRepository:
    model = None

    def all(self):
        return self.model.objects.all()

    def get(self, pk):
        return self.model.objects.get(pk=pk)

    def filter(self, **kwargs):
        return self.model.objects.filter(**kwargs)

    def create(self, **data):
        return self.model.objects.create(**data)

    def update(self, instance, **data):
        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def delete(self, instance):
        instance.delete()


class NoticiaRepository(BaseRepository):
    model = Noticia

    def published(self):
        return self.model.objects.filter(publicado=True)

    def by_category(self, categoria):
        return self.model.objects.filter(publicado=True, categoria=categoria)


class GaleriaRepository(BaseRepository):
    model = Galeria

    def active(self):
        return self.model.objects.filter(ativo=True)


class DocumentoRepository(BaseRepository):
    model = Documento

    def by_category(self, categoria):
        return self.model.objects.filter(categoria=categoria)


class ProjetoRepository(BaseRepository):
    model = Projeto

    def by_status(self, status):
        return self.model.objects.filter(status=status)


class LinhaOrcamentariaRepository(BaseRepository):
    model = LinhaOrcamentaria

    def by_projeto(self, projeto_id):
        return self.model.objects.filter(projeto_id=projeto_id)


class ProtocoloRepository(BaseRepository):
    model = Protocolo

    def search(self, query):
        return self.model.objects.filter(
            Q(numero__icontains=query)
            | Q(descricao__icontains=query)
            | Q(aprovado_por__icontains=query)
        )


class ExcecaoRepository(BaseRepository):
    model = Excecao

    def by_status(self, status):
        return self.model.objects.filter(status=status)

    def by_tipo(self, tipo):
        return self.model.objects.filter(tipo=tipo)
