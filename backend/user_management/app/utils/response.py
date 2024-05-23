"""
Utility for handling standardized responses.
"""

from typing import Any, Dict
from fastapi import status
from fastapi.responses import JSONResponse

def success_response(message: str, data: Dict[str, Any] = {}, status_code: int = status.HTTP_200_OK):
    """
    Create a standardized success response.

    Args:
        message (str): Success message.
        data (dict, optional): Additional data to include in the response. Defaults to None.
        status_code (int, optional): HTTP status code. Defaults to status.HTTP_200_OK.

    Returns:
        JSONResponse: Standardized success response.
    """
    response_content = {
         "success": True,
         "message": message
    }
    if data:
        response_content["data"] = data

    return JSONResponse(content=response_content, status_code=status_code)


def error_response(message: str, status_code: int, details: str = None):
    """
    Create a standardized error response.

    Args:
        message (str): Error message.
        status_code (int): HTTP status code.

    Returns:
        JSONResponse: Standardized error response.
    """
    response_content = {
        "success": False,
        "message": message
    }
    if details:
        response_content["details"] = details

    return JSONResponse(content=response_content, status_code=status_code)
     
