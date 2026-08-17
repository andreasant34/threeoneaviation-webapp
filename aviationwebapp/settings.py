from pathlib import Path
import os
from aviationwebapp.config import settings

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = settings.DJANGO_SECRET_KEY
DEBUG = settings.DEBUG
ALLOWED_HOSTS = settings.DJANGO_ALLOWED_HOSTS.split(",")
ADSENSE_AD_UNITS_ENABLED = settings.ADSENSE_AD_UNITS_ENABLED

if settings.ENFORCE_HOST is not None:
    ENFORCE_HOST = settings.ENFORCE_HOST

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'enforce_host.EnforceHostMiddleware',
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'aviationwebapp.urls'
WSGI_APPLICATION = 'aviationwebapp.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['aviationwebapp/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'aviationwebapp.context_processors.adsense_settings'
            ],
        },
    },
]

TIME_ZONE = 'UTC'
USE_TZ = True
LANGUAGE_CODE = 'en-us'
USE_L10N = True #Localization

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [
    BASE_DIR / "aviationwebapp/static"
]
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
