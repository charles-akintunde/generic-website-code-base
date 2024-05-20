"""
Users router for the User Management Service.
This module defines the API endpoints for user-related operations.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/users")
def read_users():
    """
    Retrieve a list of users.
    """
    return {"message": "List of users"}