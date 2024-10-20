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
 

    class Config:
        env_file = ".env"

settings = Settings()
