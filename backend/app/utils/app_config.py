import os

from app.config import settings


cwd = os.getcwd()
class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ASSET_IMAGE_PATH = os.path.join(BASE_DIR, 'assets', 'logo-white.png')


app_config = {
    "app_logo_url": cwd + "/app/assets/logo-white.png",  
    "company_name": settings.FRONTEND_URL,
    "frontend_url": settings.FRONTEND_URL,

}

