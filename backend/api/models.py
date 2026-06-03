from django.db import models


class Noticia(models.Model):
    CATEGORIAS = [
        ('assinaturas',  'Assinaturas'),
        ('construcao',   'Construção'),
        ('producao',     'Produção'),
        ('credito',      'Crédito'),
        ('eventos',      'Eventos'),
        ('geral',        'Geral'),
    ]

    titulo    = models.CharField('Título', max_length=200)
    resumo    = models.TextField('Resumo')
    conteudo  = models.TextField('Conteúdo (HTML)')
    categoria = models.CharField('Categoria', max_length=100, choices=CATEGORIAS, default='geral')
    data      = models.DateField('Data de Publicação')
    imagem    = models.ImageField('Imagem de Capa', upload_to='noticias/', blank=True, null=True)
    publicado = models.BooleanField('Publicado', default=True)
    criado_em = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        verbose_name        = 'Notícia'
        verbose_name_plural = 'Notícias'
        ordering            = ['-data']

    def __str__(self):
        return self.titulo


class Galeria(models.Model):
    imagem  = models.ImageField('Foto', upload_to='galeria/')
    legenda = models.CharField('Legenda / Alt text', max_length=200, blank=True)
    ordem   = models.PositiveIntegerField('Ordem de exibição', default=0)
    ativo   = models.BooleanField('Visível no site', default=True)

    class Meta:
        verbose_name        = 'Foto da Galeria'
        verbose_name_plural = 'Galeria de Fotos'
        ordering            = ['ordem']

    def __str__(self):
        return self.legenda or f'Foto #{self.pk}'


class Documento(models.Model):
    CATEGORIAS = [
        ('ata',       'Ata'),
        ('contrato',  'Contrato'),
        ('mapa',      'Mapa'),
        ('relatorio', 'Relatório'),
        ('outro',     'Outro'),
    ]

    titulo    = models.CharField('Título', max_length=200)
    categoria = models.CharField('Categoria', max_length=100, choices=CATEGORIAS, default='outro')
    arquivo   = models.FileField('Arquivo (PDF)', upload_to='documentos/')
    tipo      = models.CharField(max_length=20, default='pdf', editable=False)
    ordem     = models.PositiveIntegerField('Ordem', default=0)

    class Meta:
        verbose_name        = 'Documento'
        verbose_name_plural = 'Documentos'
        ordering            = ['categoria', 'ordem']

    def save(self, *args, **kwargs):
        if self.arquivo:
            self.tipo = self.arquivo.name.rsplit('.', 1)[-1].lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo


class Projeto(models.Model):
    STATUS_CHOICES = [
        ('em_andamento', 'Em Andamento'),
        ('concluido',    'Concluído'),
        ('planejado',    'Planejado'),
    ]

    nome             = models.CharField('Nome do Projeto', max_length=200)
    periodo          = models.CharField('Período', max_length=100)
    valor_aprovado   = models.DecimalField('Valor Aprovado (R$)',  max_digits=12, decimal_places=2)
    valor_executado  = models.DecimalField('Valor Executado (R$)', max_digits=12, decimal_places=2)
    saldo_disponivel = models.DecimalField('Saldo Disponível (R$)', max_digits=12, decimal_places=2)
    status           = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='em_andamento')

    class Meta:
        verbose_name        = 'Projeto de Transparência'
        verbose_name_plural = 'Projetos de Transparência'
        ordering            = ['nome']

    def __str__(self):
        return self.nome


class LinhaOrcamentaria(models.Model):
    STATUS_CHOICES = [
        ('concluido',    'Concluído'),
        ('em_andamento', 'Em Andamento'),
        ('planejado',    'Planejado'),
    ]

    projeto         = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='linhas', verbose_name='Projeto')
    descricao       = models.CharField('Descrição', max_length=200)
    valor_aprovado  = models.DecimalField('Valor Aprovado (R$)',  max_digits=12, decimal_places=2)
    valor_executado = models.DecimalField('Valor Executado (R$)', max_digits=12, decimal_places=2)
    status          = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='planejado')

    class Meta:
        verbose_name        = 'Linha Orçamentária'
        verbose_name_plural = 'Linhas Orçamentárias'

    def __str__(self):
        return f'{self.projeto.nome} — {self.descricao}'


class Protocolo(models.Model):
    numero      = models.CharField('Número', max_length=50, unique=True)
    data        = models.DateField('Data')
    descricao   = models.TextField('Descrição')
    aprovado_por = models.CharField('Aprovado por', max_length=200)
    valor       = models.DecimalField('Valor (R$)', max_digits=12, decimal_places=2)

    class Meta:
        verbose_name        = 'Protocolo'
        verbose_name_plural = 'Protocolos'
        ordering            = ['-data']

    def __str__(self):
        return self.numero


class Excecao(models.Model):
    TIPOS = [
        ('realocacao', 'Realocação de Fundos'),
        ('extensao',   'Extensão de Prazo'),
        ('aquisicao',  'Aquisição Emergencial'),
    ]
    STATUS = [
        ('aprovada',   'Aprovada'),
        ('pendente',   'Pendente'),
        ('reprovada',  'Reprovada'),
    ]

    data         = models.DateField('Data')
    tipo         = models.CharField('Tipo', max_length=50, choices=TIPOS)
    valor        = models.DecimalField('Valor (R$)', max_digits=12, decimal_places=2)
    responsavel  = models.CharField('Responsável', max_length=200)
    justificativa = models.TextField('Justificativa')
    status       = models.CharField('Status', max_length=20, choices=STATUS, default='pendente')
    analisado_por = models.CharField('Analisado por', max_length=200, blank=True)

    class Meta:
        verbose_name        = 'Exceção / Desvio'
        verbose_name_plural = 'Exceções / Desvios'
        ordering            = ['-data']

    def __str__(self):
        return f'{self.get_tipo_display()} — {self.data}'
