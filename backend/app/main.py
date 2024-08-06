"""
Main application module for the User Management Service.
This module initializes the FastAPI application and includes the routers.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.logging_config import setup_logging
from app.config import settings
from app.middleware import ExceptionHandlingMiddleware
from app.utils.response import error_response
from app.routers import page, page_content, auth, user_info
from app.tests import test_auth
from app.scheduler.token_cleaner import start_token_cleaner_scheduler
from fastapi.middleware.cors import CORSMiddleware

# Set up logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code here
    start_token_cleaner_scheduler()
    yield

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        app (FastAPI): The configured FastAPI application.
    """
    # Initialize FastAPI application with lifespan
    app = FastAPI(lifespan=lifespan)

    # Add the middleware
    app.add_middleware(ExceptionHandlingMiddleware)

    origins = [
        settings.FRONTEND_URL,  # Your Next.js frontend
       'https://localhost:3000',
        # Add other origins as needed
    ]

    app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allow_headers=[
        "Access-Control-Allow-Headers", 
        "Content-Type", 
        "Authorization", 
        "Access-Control-Allow-Origin", 
        "Set-Cookie", 
        "X-Refresh-Token"
    ],
)



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

    app.mount("/static", StaticFiles(directory="static"), name="static")

    # Include routers with common prefix
    app.include_router(test_auth.router, prefix="", tags=["tests"])
    app.include_router(auth.router, prefix=f"{service_prefix}/auth", tags=["auth"])
    app.include_router(user_info.router, prefix=f"{service_prefix}/users", tags=["users"])
    app.include_router(page.router, prefix=f"{service_prefix}/pages", tags=["page"])
    app.include_router(page_content.router, prefix=f"{service_prefix}/page-contents", tags=["page-contents"])

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

# # Example of how to use settings in an endpoint
# @app.get("/settings")
# def get_settings():
#     """
#     Endpoint to test access to application settings.
#     """
#     return {
#         "secret_key": settings.AUTH_SECRET_KEY,
#         "database_url": settings.DATABASE_URL,
#         "mail_server": settings.MAIL_SERVER,
#         "frontend_url": settings.FRONTEND_URL,
  #  }
