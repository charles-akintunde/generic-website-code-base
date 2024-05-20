"""
Applications router for the User Management Service.
This module defines the API endpoints for application-related operations.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/applications")
def read_applications():
    """
    Retrieve a list of applications.
    """
    return {"message": "List of applications"}
