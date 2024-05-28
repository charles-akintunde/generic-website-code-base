"""
Teams router for the User Management Service.
This module defines the API endpoints for team-related operations.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/teams")
def read_teams():
    """
    Retrieve a list of teams.
    """
    return {"message": "List of teams"}