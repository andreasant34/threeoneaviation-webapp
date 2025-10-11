from pydantic_settings import BaseSettings
from django.core.management.utils import get_random_secret_key

class Settings(BaseSettings):
    DJANGO_SECRET_KEY: str = get_random_secret_key()
    DEBUG: bool = False
    DJANGO_ALLOWED_HOSTS: str = "*"
    ENFORCE_HOST: str|None = None
    CACHE_EXPIRATION: int = 3600
    ROOT_FOLDER_ID:str|None = None
    CDN_URL:str|None = None
    FEATURED_FOLDER_ID:str|None = None
    GOOGLE_SERVICE_ACCOUNT_TOKEN:str|None = None

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()