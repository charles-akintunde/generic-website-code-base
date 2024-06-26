"""
Email utilities.
"""

from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from app.config import settings


mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
#MAIL_TLS=settings.MAIL_TLS,
   # MAIL_SSL=settings.MAIL_SSL,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
fm = FastMail(mail_config)

async def send_confirmation_email(email: EmailStr, token: str):
    """
    Send a confirmation email to the user.

    Args:
        email (EmailStr): User's email.
        token (str): Confirmation token.
    """
    confirmation_link = f"http://localhost:8001/api/v1/users/confirm/{token}"
    message = MessageSchema(
        subject="Email Confirmation",
        recipients=[email],
        body=f"Please click the following link to confirm your email: {confirmation_link}",
        subtype="html"
    )
    await fm.send_message(message)

async def send_password_reset_email(email: str, token: str):
    reset_url = f"http://localhost:8001/api/v1/reset-password?token={token}"
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"Please use the following link to reset your password: {reset_url}",
        subtype="html"
    )
    await fm.send_message(message=message)
