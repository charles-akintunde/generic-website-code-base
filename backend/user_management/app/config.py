"""
Configuration module for the User Management Service.
This module loads configuration values from environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """
    Settings class to hold configuration values.

    Attributes:
        PROJECT_NAME (str): The name of the project.
        SQLALCHEMY_DATABASE_URL (str): The database URL.
    """
    PROJECT_NAME: str = "User Management Service"
    SQLALCHEMY_DATABASE_URL: str = os.getenv("DATABASE_URL")

settings = Settings()
