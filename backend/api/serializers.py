from rest_framework import serializers
from .models import Noticia, Galeria, Documento, Projeto, LinhaOrcamentaria, Protocolo, Excecao


# ── Read serializers (public GET endpoints) ───────────────────────────────────

class NoticiaListSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model  = Noticia
        fields = ['id', 'titulo', 'resumo', 'categoria', 'data', 'imagem']

    def get_imagem(self, obj):
        if obj.imagem:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.imagem.url) if request else obj.imagem.url
        return None


class NoticiaDetailSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model  = Noticia
        fields = ['id', 'titulo', 'resumo', 'conteudo', 'categoria', 'data', 'imagem']

    def get_imagem(self, obj):
        if obj.imagem:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.imagem.url) if request else obj.imagem.url
        return None


class GaleriaSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model  = Galeria
        fields = ['id', 'imagem', 'legenda', 'ordem']

    def get_imagem(self, obj):
        if obj.imagem:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.imagem.url) if request else obj.imagem.url
        return None


class DocumentoSerializer(serializers.ModelSerializer):
    arquivo = serializers.SerializerMethodField()

    class Meta:
        model  = Documento
        fields = ['id', 'titulo', 'categoria', 'arquivo', 'tipo']

    def get_arquivo(self, obj):
        if obj.arquivo:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.arquivo.url) if request else obj.arquivo.url
        return None


class LinhaOrcamentariaSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model  = LinhaOrcamentaria
        fields = ['id', 'descricao', 'valor_aprovado', 'valor_executado', 'status', 'status_display']


class LinhaOrcamentariaReadSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    projeto_nome   = serializers.CharField(source='projeto.nome', read_only=True)

    class Meta:
        model  = LinhaOrcamentaria
        fields = ['id', 'projeto', 'projeto_nome', 'descricao', 'valor_aprovado', 'valor_executado', 'status', 'status_display']


class ProjetoSerializer(serializers.ModelSerializer):
    linhas         = LinhaOrcamentariaSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model  = Projeto
        fields = '__all__'


class ProtocoloSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Protocolo
        fields = '__all__'


class ExcecaoSerializer(serializers.ModelSerializer):
    tipo_display   = serializers.CharField(source='get_tipo_display',   read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model  = Excecao
        fields = '__all__'


# ── Write serializers (authenticated CRUD endpoints) ──────────────────────────

class NoticiaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Noticia
        fields = ['titulo', 'resumo', 'conteudo', 'categoria', 'data', 'imagem', 'publicado']


class GaleriaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Galeria
        fields = ['imagem', 'legenda', 'ordem', 'ativo']


class DocumentoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Documento
        fields = ['titulo', 'categoria', 'arquivo', 'ordem']


class ProjetoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Projeto
        fields = ['nome', 'periodo', 'valor_aprovado', 'valor_executado', 'saldo_disponivel', 'status']


class LinhaOrcamentariaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LinhaOrcamentaria
        fields = ['projeto', 'descricao', 'valor_aprovado', 'valor_executado', 'status']


class ProtocoloWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Protocolo
        fields = ['numero', 'data', 'descricao', 'aprovado_por', 'valor']


class ExcecaoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Excecao
        fields = ['data', 'tipo', 'valor', 'responsavel', 'justificativa', 'status', 'analisado_por']
