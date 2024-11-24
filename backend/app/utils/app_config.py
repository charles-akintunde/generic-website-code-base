import os

from app.config import settings


cwd = os.getcwd()
class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ASSET_IMAGE_PATH = os.path.join(BASE_DIR, 'assets', 'logo-white.png')


app_config = {
    "app_logo_url": "app/assets/logo-white.png",  
    "company_name": settings.MAIL_FROM_NAME,
    "frontend_url": settings.FRONTEND_URL,
    "super_admin_email": "icakintunde@upei.ca", # Change this to the super admin's email
    "super_admin_first_name": "Charles", # Change this to the super admin's first name
    "super_admin_last_name": "Akintunde", # Change this to tshe super admin's last

}

