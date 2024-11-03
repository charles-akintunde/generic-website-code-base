import os

from app.config import settings


cwd = os.getcwd()
class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ASSET_IMAGE_PATH = os.path.join(BASE_DIR, 'assets', 'logo-white.png')


app_config = {
    "app_logo_url": "app/assets/logo-white.png",  
    "company_name": settings.FRONTEND_URL,
    "frontend_url": settings.FRONTEND_URL,
    "super_admin_email": "admin@example.com", # Change this to the super admin's email
    "super_admin_first_name": "Super First Name", # Change this to the super admin's first name
    "super_admin_last_name": "Super Last Name", # Change this to the super admin's last

}

