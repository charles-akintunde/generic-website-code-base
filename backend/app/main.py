"""
Main application module for the User Management Service.
This module initializes the FastAPI application and includes the routers.
"""

import logging
from fastapi import FastAPI, Request
from app.database import engine, Base
from app.logging_config import setup_logging
from app.routers import page
from app.config import settings
from app.middleware import ExceptionHandlingMiddleware
from app.utils.response import error_response
from app.routers import page_content
from app.routers import auth, user_info
from app.routers import user_info
from app.tests import test_auth

# Set up logging
setup_logging()
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        app (FastAPI): The configured FastAPI application.
    """
    # Initialize FastAPI application
    app = FastAPI()

    # Add the middleware
    app.add_middleware(ExceptionHandlingMiddleware)

    # Register custom exception handler
    @app.exception_handler(Exception)
    async def custom_exception_handler(request: Request, exc: Exception):
        """
        Custom exception handler for unhandled exceptions.

        Args:
            request (Request): The incoming request.
            exc (Exception): The unhandled exception.

        Returns:
            JSONResponse: A standardized error response.
        """
        return error_response(
            message="Internal Server Error",
            status_code=500,
            detail=str(exc)
        )

    # Common prefix for all routes in this microservice
    service_prefix = "/api/v1"

    # Include routers with common prefix
    app.include_router(test_auth.router,prefix=f"", tags=["tests"])
    app.include_router(auth.router, prefix=f"{service_prefix}/auth", tags=["auth"])
    app.include_router(user_info.router, prefix=f"{service_prefix}/users", tags=["users"])
    app.include_router(page.router, prefix=f"{service_prefix}/page", tags=["page"])
    app.include_router(page_content.router, prefix=f"{service_prefix}/applications", tags=["applications"])

    return app

# Create and configure the FastAPI application
app = create_app()

# Create database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    """
    Root endpoint for the application.
    Returns a welcome message.
    """
    return {"message": "Welcome to the User Management Service"}

# Example of how to use settings in an endpoint
@app.get("/settings")
def get_settings():
    """
    Endpoint to test access to application settings.
    """
    return {
        "secret_key": settings.AUTH_SECRET_KEY,
        "database_url": settings.DATABASE_URL,
        "mail_server": settings.MAIL_SERVER,
        "frontend_url": settings.FRONTEND_URL,
    }