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
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                border-radius: 10px;
            }}
            .header {{
                background-color: #007bff;
                color: #fff;
                padding: 20px 0;
                text-align: center;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
            }}
            .logo {{
                max-width: 120px;
                margin-bottom: 10px;
            }}
            h1 {{
                margin-bottom: 10px;
                font-size: 24px;
            }}
            .content {{
                padding: 20px;
                text-align: center;
            }}
            p {{
                font-size: 16px;
                line-height: 1.5;
                color: #555;
            }}
            .button {{
                background-color: #28a745;
                color: white !important;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                font-size: 16px;
                margin-top: 20px;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #888;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="your-company-logo.png" alt="Your Company Logo" class="logo">
                <h1>Welcome to Your Company</h1>
            </div>
            <div class="content">
                <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
                <a href="{confirmation_link}" class="button">Verify Email Address</a>
                <p>If you did not request this email, please ignore it.</p>
            </div>
            <div class="footer">
                <p>Your Company Inc. | <a href="https://your-company-website.com" style="color: #007bff; text-decoration: none;">www.your-company-website.com</a></p>
            </div>
        </div>
    </body>
    </html>
    """

    
    message = MessageSchema(
        subject="Email Confirmation",
        recipients=[email],
        body=email_html_content(
            message="Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:",
            confirmation_link=confirmation_link,
            button_text="Verify Email Address",
            company_name=COMPANY_NAME,
            frontend_url=FRONTEND_URL,
            logo='app/assets/logo-white.png'
        ),
        subtype="html"
    )
    print(f'{cwd}/assets/logo-white.png',"PWDDDDDDDDD")
    await fm.send_message(message)

async def send_password_reset_email(email: str, token: str):
    reset_url = f"{FRONTEND_URL}/reset-password/{token}"
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email],
        body=f"Please use the following link to reset your password: {reset_url}",
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