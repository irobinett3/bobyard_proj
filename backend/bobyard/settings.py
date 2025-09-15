from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # project root

# dev-only flags
SECRET_KEY = 'django-insecure-fuq44k(cx#08&b&5kso6@y9c$2(n5r8b0-m#p01-c-mp-oqi=f'  # dev key
DEBUG = True
ALLOWED_HOSTS = []  # add hosts in prod

# apps
INSTALLED_APPS = [
    "django.contrib.admin","django.contrib.auth","django.contrib.contenttypes",
    "django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles",
    "rest_framework","corsheaders",
    "comments",  # local app
]

# middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # keep near top
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True  # dev OK

ROOT_URLCONF = 'bobyard.urls'

# templates
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

WSGI_APPLICATION = 'bobyard.wsgi.application'

# db
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "bobyard",
        "USER": "bobyard",
        "PASSWORD": "<the password you set>",  # local env
        "HOST": "127.0.0.1",
        "PORT": "5432",
    }
}

# auth validators
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# i18n
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# static
STATIC_URL = 'static/'

# ids
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


LOGGING = {
  "version": 1,
  "handlers": {"console": {"class": "logging.StreamHandler"}},
  "root": {"handlers": ["console"], "level": "DEBUG"},
}

# drf
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "comments.pagination.CommentCursorPagination",
    "PAGE_SIZE": 50,
}