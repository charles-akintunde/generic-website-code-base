from pydantic_settings import BaseSettings
from pydantic import EmailStr

class Settings(BaseSettings):
    """
    Application settings.

    Attributes:
        SECRET_KEY (str): Secret key for JWT.
        DATABASE_URL (str): Database URL.
        MAIL_USERNAME (str): Email username.
        MAIL_PASSWORD (str): Email password.
        MAIL_FROM (EmailStr): Email sender address.
        MAIL_PORT (int): Email server port.
        MAIL_SERVER (str): Email server address.
        MAIL_FROM_NAME (str): Email sender name.
        FRONTEND_URL (str): Frontend URL for confirmation links.
        MAIL_TLS (bool): Use TLS for email.
        MAIL_SSL (bool): Use SSL for email.
    """
    AUTH_SECRET_KEY: str
    DATABASE_URL: str
    
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: EmailStr
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    FRONTEND_URL: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    BASE_URL: str
    THUMBNAILS_FILE_PATH: str
    RESOURCE_FILE_PATH: str
    USER_PROFILE_FILE_PATH: str
    COMPANY_NAME: str
    ACCESS_TOKEN_EXPIRE_SECONDS: int
    REFRESH_TOKEN_EXPIRE_SECONDS: int
    PAGE_CONTENT_FILE_PATH: str
    AZURE_STORAGE_CONNECTION_STRING: str
    AZURE_STORAGE_CONTAINER_NAME: str
    DEVELOPER_SQL_INJECTION_PASSWORD: str
    PRODUCTION_MODE: bool
    COOKIE_DOMAIN: str

    class Config:
        env_file = ".env"

settings = Settings() # type: ignore
