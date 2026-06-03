from django.contrib import admin
from django.utils.html import format_html
from django_summernote.admin import SummernoteModelAdmin
from .models import Noticia, Galeria, Documento, Projeto, LinhaOrcamentaria, Protocolo, Excecao


# ── Notícias ──────────────────────────────────────────────────────────────────

@admin.register(Noticia)
class NoticiaAdmin(SummernoteModelAdmin):
    summernote_fields = ('conteudo',)

    list_display  = ['titulo', 'categoria', 'data', 'publicado', 'preview_imagem']
    list_filter   = ['publicado', 'categoria']
    search_fields = ['titulo', 'resumo']
    date_hierarchy = 'data'
    list_per_page  = 20
    list_editable  = ['publicado']

    fieldsets = (
        ('Identificação', {
            'fields': ('titulo', 'categoria', 'data', 'publicado'),
        }),
        ('Conteúdo', {
            'fields': ('resumo', 'conteudo'),
        }),
        ('Imagem de Capa', {
            'fields': ('imagem',),
        }),
    )

    def preview_imagem(self, obj):
        if obj.imagem:
            return format_html(
                '<img src="{}" style="height:48px;border-radius:4px;object-fit:cover;" />',
                obj.imagem.url,
            )
        return '—'
    preview_imagem.short_description = 'Capa'


# ── Galeria ───────────────────────────────────────────────────────────────────

@admin.register(Galeria)
class GaleriaAdmin(admin.ModelAdmin):
    list_display  = ['preview_imagem', 'legenda', 'ordem', 'ativo']
    list_editable = ['legenda', 'ordem', 'ativo']
    list_per_page = 30
    ordering      = ['ordem']

    fieldsets = (
        (None, {
            'fields': ('imagem', 'legenda', 'ordem', 'ativo'),
        }),
    )

    def preview_imagem(self, obj):
        if obj.imagem:
            return format_html(
                '<img src="{}" style="height:60px;width:90px;object-fit:cover;border-radius:4px;" />',
                obj.imagem.url,
            )
        return '—'
    preview_imagem.short_description = 'Foto'


# ── Documentos ────────────────────────────────────────────────────────────────

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display  = ['titulo', 'categoria', 'tipo', 'ordem', 'link_arquivo']
    list_filter   = ['categoria', 'tipo']
    search_fields = ['titulo']
    list_per_page = 20
    list_editable = ['ordem']

    fieldsets = (
        (None, {
            'fields': ('titulo', 'categoria', 'arquivo', 'ordem'),
        }),
    )

    def link_arquivo(self, obj):
        if obj.arquivo:
            return format_html(
                '<a href="{}" target="_blank">📄 Abrir</a>',
                obj.arquivo.url,
            )
        return '—'
    link_arquivo.short_description = 'Arquivo'


# ── Projetos de Transparência ─────────────────────────────────────────────────

class LinhaOrcamentariaInline(admin.TabularInline):
    model         = LinhaOrcamentaria
    extra         = 1
    fields        = ('descricao', 'valor_aprovado', 'valor_executado', 'status')
    show_change_link = False


@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    list_display  = ['nome', 'periodo', 'status', 'valor_aprovado_fmt', 'valor_executado_fmt', 'barra_progresso']
    list_filter   = ['status']
    search_fields = ['nome']
    list_per_page = 20
    inlines       = [LinhaOrcamentariaInline]

    fieldsets = (
        ('Identificação', {
            'fields': ('nome', 'periodo', 'status'),
        }),
        ('Valores (R$)', {
            'fields': ('valor_aprovado', 'valor_executado', 'saldo_disponivel'),
        }),
    )

    def valor_aprovado_fmt(self, obj):
        return f'R$ {obj.valor_aprovado:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
    valor_aprovado_fmt.short_description = 'Aprovado'

    def valor_executado_fmt(self, obj):
        return f'R$ {obj.valor_executado:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
    valor_executado_fmt.short_description = 'Executado'

    def barra_progresso(self, obj):
        if not obj.valor_aprovado:
            return '—'
        pct = min(int(obj.valor_executado / obj.valor_aprovado * 100), 100)
        cor = '#4caf50' if pct < 80 else ('#ff9800' if pct < 100 else '#f44336')
        return format_html(
            '<div style="background:#e0e0e0;border-radius:4px;width:120px;height:14px;">'
            '<div style="background:{};width:{}%;height:14px;border-radius:4px;"></div>'
            '</div><small>{}%</small>',
            cor, pct, pct,
        )
    barra_progresso.short_description = 'Execução'


@admin.register(LinhaOrcamentaria)
class LinhaOrcamentariaAdmin(admin.ModelAdmin):
    list_display  = ['projeto', 'descricao', 'valor_aprovado', 'valor_executado', 'status']
    list_filter   = ['status', 'projeto']
    search_fields = ['descricao', 'projeto__nome']
    list_per_page = 30
    list_editable = ['status']


# ── Protocolos ────────────────────────────────────────────────────────────────

@admin.register(Protocolo)
class ProtocoloAdmin(admin.ModelAdmin):
    list_display   = ['numero', 'data', 'aprovado_por', 'valor_fmt']
    search_fields  = ['numero', 'descricao', 'aprovado_por']
    date_hierarchy = 'data'
    list_per_page  = 20

    fieldsets = (
        (None, {
            'fields': ('numero', 'data', 'aprovado_por', 'valor'),
        }),
        ('Descrição', {
            'fields': ('descricao',),
        }),
    )

    def valor_fmt(self, obj):
        return f'R$ {obj.valor:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
    valor_fmt.short_description = 'Valor'


# ── Exceções / Desvios ────────────────────────────────────────────────────────

@admin.register(Excecao)
class ExcecaoAdmin(admin.ModelAdmin):
    list_display   = ['data', 'tipo_badge', 'valor_fmt', 'responsavel', 'status', 'status_badge']
    list_filter    = ['tipo', 'status']
    search_fields  = ['responsavel', 'justificativa']
    date_hierarchy = 'data'
    list_per_page  = 20
    list_editable  = ['status']

    fieldsets = (
        ('Identificação', {
            'fields': ('data', 'tipo', 'valor', 'responsavel'),
        }),
        ('Análise', {
            'fields': ('justificativa', 'status', 'analisado_por'),
        }),
    )

    def tipo_badge(self, obj):
        cores = {
            'realocacao': '#1565c0',
            'extensao':   '#f57f17',
            'aquisicao':  '#6a1b9a',
        }
        cor = cores.get(obj.tipo, '#555')
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;">{}</span>',
            cor, obj.get_tipo_display(),
        )
    tipo_badge.short_description = 'Tipo'

    def status_badge(self, obj):
        cores = {
            'aprovada':  '#2e7d32',
            'pendente':  '#e65100',
            'reprovada': '#b71c1c',
        }
        cor = cores.get(obj.status, '#555')
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;">{}</span>',
            cor, obj.get_status_display(),
        )
    status_badge.short_description = 'Status'

    def valor_fmt(self, obj):
        return f'R$ {obj.valor:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
    valor_fmt.short_description = 'Valor'


# ── Personalização do cabeçalho do admin ──────────────────────────────────────
admin.site.site_header = 'ATRPAP — Painel Administrativo'
admin.site.site_title  = 'ATRPAP Admin'
admin.site.index_title = 'Gerenciamento de Conteúdo'
