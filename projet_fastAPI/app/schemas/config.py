# app/schemas/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DOMAIN_URL: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    lis_user_email_test: str
    GMAIL_SENDER: str
    GMAIL_PASSWORD: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()