import os

from app.config import settings

class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ASSET_IMAGE_PATH = os.path.join(BASE_DIR, 'assets', 'logo-white.png')


app_config = {
    "app_logo_url": Config.ASSET_IMAGE_PATH,  
    "company_name": settings.FRONTEND_URL,
    "frontend_url": settings.FRONTEND_URL,

}

