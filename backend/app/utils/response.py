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


def error_response(message: str, status_code: int, detail: str = None) -> JSONResponse:  # type: ignore
    """
    Create a standardized error response.

    Args:
        message (str): Error message.
        status_code (int): HTTP status code.
        details (str): Additional details about the error.

    Returns:
        JSONResponse: Standardized error response.
    """
    response_content = {
        "success": False,
        "message": message
    }
    if detail:
        response_content["detail"] = detail

    return JSONResponse(content=response_content, status_code=status_code)
     
