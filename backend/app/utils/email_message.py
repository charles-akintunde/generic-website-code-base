

from typing import Optional
from app.utils.app_config import app_config

import base64

def convert_image_to_base64(image_path):
    with open(image_path, "rb") as img_file:
        base64_string = base64.b64encode(img_file.read()).decode('utf-8')
    return base64_string

base64_logo = convert_image_to_base64("app/static/assets/gw-logo.png")


def email_html_content(
    confirmation_link: str,
    button_text: str,
    message: str,
):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                line-height: 1.6;
                color: #333;
            }}

            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }}

            .header {{
                background-color: #0073e6;
                color: #ffffff;
                text-align: center;
                padding: 20px 10px;
            }}

            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: bold;
            }}

            .content {{
                padding: 20px 30px;
                text-align: center;
            }}

            .content p {{
                font-size: 16px;
                color: #555;
                margin: 20px 0;
            }}

            .button {{
                display: inline-block;
                background-color: #28a745;
                color: #ffffff !important;
                padding: 15px 30px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }}

            .button:hover {{
                background-color: #218838;
            }}

            .plain-link {{
                display: block;
                color: #0073e6;
                font-size: 14px;
                word-wrap: break-word;
                margin-top: 15px;
            }}

            .footer {{
                text-align: center;
                padding: 20px 10px;
                background-color: #f8f9fa;
                font-size: 12px;
                color: #888;
            }}

            .footer a {{
                color: #0073e6;
                text-decoration: none;
            }}

            .footer a:hover {{
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{app_config['company_name']}</h1>
            </div>
            <div class="content">
                <p>{message}</p>
                <a href="{confirmation_link}" class="button">{button_text}</a>
                <p>Or copy and paste this link into your browser:</p>
                <a href="{confirmation_link}" class="plain-link">{confirmation_link}</a>
                <p>If you did not request this email, please ignore it.</p>
            </div>
            <div class="footer">
                <p>{app_config['company_name']} | <a href="{app_config['frontend_url']}">{app_config['frontend_url']}</a></p>
            </div>
        </div>
    </body>
    </html>
    """
