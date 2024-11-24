

from typing import Optional
from app.utils.app_config import app_config

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
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }}

            .container {{
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                background-color: #f4f4f4;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                border-radius: 10px;
            }}

            .header {{
                background-color: #f4f4f4;
                color: black;
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
                color: #ffffff;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                display: inline-block;
                font-size: 16px;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }}

            .button:hover {{
                background-color: #218838;
            }}

            .footer {{
                margin-top: 30px;
                font-size: 12px;
                color: #888888;
                text-align: center;
                border-top: 1px solid #eaeaea;
                padding-top: 20px;
            }}

            .footer a {{
                color: #007bff;
                text-decoration: none;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="{app_config['app_logo_url']}" alt="Your Company Logo" class="logo">
                <h1>{app_config['company_name']}</h1>
            </div>
            <div class="content">
                <p>{message}</p>
                <a href="{confirmation_link}" class="button">{button_text}</a>
                <p>If you did not request this email, please ignore it.</p>
            </div>
            <div class="footer">
                <p>{app_config['company_name']} | <a href="{app_config['frontend_url']}"> {app_config['frontend_url']}</a></p>
            </div>
        </div>
    </body>
    </html>
    """
