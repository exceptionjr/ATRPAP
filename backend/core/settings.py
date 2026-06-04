from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-troque-esta-chave-em-producao')

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1',
    cast=lambda v: [s.strip() for s in v.split(',')],
)

SITE_URL = config('SITE_URL', default='http://localhost:5173')

# ── Apps ──────────────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    # Jazzmin deve vir ANTES do django.contrib.admin
    'jazzmin',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_summernote',

    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ── Banco de Dados ────────────────────────────────────────────────────────────
DB_ENGINE = config('DB_ENGINE', default='django.db.backends.sqlite3')

if DB_ENGINE == 'django.db.backends.sqlite3':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
elif DB_ENGINE == 'django.db.backends.mysql':
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='3306'),
            'CONN_MAX_AGE': 0,
            'OPTIONS': {
                'charset': 'utf8mb4',
                'connect_timeout': 30,
            },
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='3306'),
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE     = 'America/Belem'
USE_I18N      = True
USE_TZ        = True

STATIC_URL  = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

MEDIA_URL  = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Django REST Framework ─────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# ── CSRF ──────────────────────────────────────────────────────────────────────
CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    default='http://localhost:5173,http://127.0.0.1:5173',
    cast=lambda v: [s.strip() for s in v.split(',')],
)

# ── CORS ──────────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://127.0.0.1:5173',
    cast=lambda v: [s.strip() for s in v.split(',')],
)

# ── Summernote (editor de texto rico) ────────────────────────────────────────
SUMMERNOTE_CONFIG = {
    'summernote': {
        'width':  '100%',
        'height': '480',
        'lang': 'pt-BR',
        'toolbar': [
            ['style',      ['style']],
            ['font',       ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
            ['fontsize',   ['fontsize']],
            ['color',      ['color']],
            ['para',       ['ul', 'ol', 'paragraph']],
            ['table',      ['table']],
            ['insert',     ['link', 'picture', 'hr']],
            ['view',       ['fullscreen', 'codeview', 'help']],
        ],
    },
    'attachment_filesize_limit': 5 * 1024 * 1024,  # 5 MB
    'attachment_upload_to': 'summernote/',
}

# ── Jazzmin (tema do painel admin) ────────────────────────────────────────────
JAZZMIN_SETTINGS = {
    # Título e marca
    'site_title':        'ATRPAP Admin',
    'site_header':       'ATRPAP',
    'site_brand':        'Painel ATRPAP',
    'welcome_sign':      'Bem-vindo ao Painel Administrativo da ATRPAP',
    'copyright':         'Associação dos Trabalhadores Rurais do PA Prata',

    # CSS personalizado
    'custom_css': 'admin/css/atrpap_admin.css',

    # Ícone do site (pode trocar por um favicon real depois)
    'site_icon': None,
    'site_logo': None,

    # Links de topo (atalhos rápidos)
    'topmenu_links': [
        {'name': 'Ver Site',    'url': SITE_URL, 'new_window': True},
        {'name': 'API Docs',    'url': '/api/',  'new_window': True},
        {'model': 'auth.User'},
    ],

    # Ícones dos modelos no menu lateral
    'icons': {
        'auth':                  'fas fa-users-cog',
        'auth.user':             'fas fa-user',
        'auth.Group':            'fas fa-users',
        'api.Noticia':           'fas fa-newspaper',
        'api.Galeria':           'fas fa-images',
        'api.Documento':         'fas fa-file-pdf',
        'api.Projeto':           'fas fa-chart-bar',
        'api.LinhaOrcamentaria': 'fas fa-list-ol',
        'api.Protocolo':         'fas fa-stamp',
        'api.Excecao':           'fas fa-exclamation-triangle',
    },

    # Ordem do menu lateral
    'order_with_respect_to': [
        'api',
        'api.Noticia',
        'api.Galeria',
        'api.Documento',
        'api.Projeto',
        'api.LinhaOrcamentaria',
        'api.Protocolo',
        'api.Excecao',
        'auth',
    ],

    # Tema Bootstrap
    'theme': 'default',
    'dark_mode_theme': None,

    # Mostrar botão de alternar tema
    'show_ui_builder': False,

    # Navegação lateral expandida por padrão
    'navigation_expanded': True,

    # Ocultar apps que não usamos no menu
    'hide_apps':   [],
    'hide_models': [],

    # Ações personalizadas de usuário
    'usermenu_links': [
        {'name': 'Ver Site', 'url': SITE_URL, 'new_window': True},
    ],

    'changeform_format': 'horizontal_tabs',
}

JAZZMIN_UI_TWEAKS = {
    'navbar_small_text':  False,
    'footer_small_text':  False,
    'body_small_text':    False,
    'brand_small_text':   False,
    'brand_colour':       'navbar-success',
    'accent':             'accent-teal',
    'navbar':             'navbar-dark',
    'no_navbar_border':   False,
    'navbar_fixed':       True,
    'layout_boxed':       False,
    'footer_fixed':       False,
    'sidebar_fixed':      True,
    'sidebar':            'sidebar-dark-success',
    'sidebar_nav_small_text':       False,
    'sidebar_disable_expand':       False,
    'sidebar_nav_child_indent':     False,
    'sidebar_nav_compact_style':    False,
    'sidebar_nav_legacy_style':     False,
    'sidebar_nav_flat_style':       False,
    'theme':              'default',
    'button_classes': {
        'primary':   'btn-primary',
        'secondary': 'btn-secondary',
        'info':      'btn-info',
        'warning':   'btn-warning',
        'danger':    'btn-danger',
        'success':   'btn-success',
    },
}
