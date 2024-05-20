"""
Main application module for the User Management Service.
This module initializes the FastAPI application and includes the routers.
"""

from fastapi import FastAPI
from app.database import engine, Base
from app.logging_config import setup_logging
from app.routers import users, teams, applications

# Setup logging configuration
setup_logging()

# Initialize FastAPI applications
app = FastAPI()


app.include_router(users.router)
app.include_router(teams.router)
app.include_router(applications.router)

# Create database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    """
    Root endpoint for the application.
    Returns a welcome message.
    """
    return {"message": "Welcome to the User Management Service"}
