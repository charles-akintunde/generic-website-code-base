"""
Email utilities.
"""
import os 
from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from app.config import settings
from app.utils.email_message import email_html_content
import inspect

FRONTEND_URL = settings.FRONTEND_URL
COMPANY_NAME = settings.COMPANY_NAME
cwd = os.getcwd() 
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
    confirmation_link = f"{FRONTEND_URL}/confirm-user/account-creation/{token}"
    
    message = MessageSchema(
        subject="Email Confirmation",
        recipients=[email],
        body=email_html_content(
            message="Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:",
            confirmation_link=confirmation_link,
            button_text="Verify Email Address",
        ),
        subtype="html"
    )

    await fm.send_message(message)

async def send_password_reset_email(email: str, token: str):
    reset_url = f"{FRONTEND_URL}/reset-password/{token}"
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body = email_html_content(
        message="We received a request to reset your password. If you did not make this request, please ignore this email. Otherwise, you can reset your password by clicking the button below:",
        confirmation_link=reset_url,
        button_text="Reset Password",
    )
,
        subtype="html"
    )
    await fm.send_message(message=message)

def get_logo_path():
    # Get the frame object for the current function call
    frame = inspect.currentframe()

    # Check if the frame exists (to avoid errors)
    if frame is not None:
        # Get the filename of the current frame
        current_file_name = inspect.getfile(frame)

        # Get the absolute path of the current file
        current_file_path = os.path.abspath(current_file_name)

        # Determine the project root (go up one level from 'app')
        project_root = os.path.dirname(current_file_path)

        # Construct the absolute path to the logo
        return os.path.join(project_root, "assets", "logo-white.png")
    else:
        # Handle the case where frame is None (this shouldn't happen normally)
        raise RuntimeError("Unable to get current frame for logo path calculation")