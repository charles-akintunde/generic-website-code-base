"""
Logging configuration for the User Management Service.
This module sets up logging for the application.
"""


import logging
from logging.config import dictConfig

def setup_logging():
    """
    Setup logging configuration for the application.
    """
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
            },
            "file": {
                "class": "logging.FileHandler",
                "formatter": "default",
                "filename": "app.log",
            },
        },
        "root": {
            "level": "INFO",
            "handlers": ["console", "file"],
        },
    }
    dictConfig(logging_config)
