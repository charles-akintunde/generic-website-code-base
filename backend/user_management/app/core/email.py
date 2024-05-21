"""
Email utilities.
"""

from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr


conf = ConnectionConfig(
    MAIL_USERNAME="your-email@example.com",
    MAIL_PASSWORD="your-email-password",
    MAIL_FROM="your-email@example.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.example.com",
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_confirmation_email(email: EmailStr, token: str):
    """
    Send a confirmation email to the user.

    Args:
        email (EmailStr): User's email.
        token (str): Confirmation token.
    """
    confirmation_link = f"http://localhost:8000/api/v1/users/confirm/{token}"
    message = MessageSchema(
        subject="Email Confirmation",
        recipients=[email],
        body=f"Please click the following link to confirm your email: {confirmation_link}",
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)