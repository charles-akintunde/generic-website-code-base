import os

from backend.app.config import Settings

class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ASSET_IMAGE_PATH = os.path.join(BASE_DIR, 'assets', 'logo-white.png')


app_config = {
    "app_logo_url": Config.ASSET_IMAGE_PATH,  
    "company_name": Settings.FRONTEND_URL,
    "frontend_url": Settings.FRONTEND_URL,

}

