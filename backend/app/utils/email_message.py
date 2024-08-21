from typing import Any


def email_html_content(confirmation_link: str, button_text: str, message: str, frontend_url: str, logo: Any, company_name: str):
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
                <h1>Welcome to {company_name}</h1>
            </div>
            <div class="content">
                <p>{message}</p>
                <a href="{confirmation_link}" class="button">{button_text}</a>
                <p>If you did not request this email, please ignore it.</p>
            </div>
            <div class="footer">
                <p>{company_name} Inc. | <a href={frontend_url} style="color: #007bff; text-decoration: none;">www.{frontend_url}</a></p>
            </div>
        </div>
    </body>
    </html>
    """
