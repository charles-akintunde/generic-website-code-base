"""
Logging configuration for the User Management Service.
This module sets up logging for the application.
"""

import logging

def setup_logging():
    """
    Sets up the logging configuration.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
