"""
Utility for handling standardized responses.
"""

from typing import Any, Dict
from xmlrpc.client import boolean
from fastapi import status
from fastapi.responses import JSONResponse

def success_response(message: str, data: Any = {}, status_code: int = status.HTTP_200_OK, headers: Any = {},is_success:boolean=True):
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
         "success": is_success,
         "message": message
    }
    if data:
        response_content["data"] = data

    return JSONResponse(content=response_content, status_code=status_code, headers=headers)


def error_response(message: str, status_code: int, detail: str = None, headers: Any = {}) -> JSONResponse:  # type: ignore
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

    return JSONResponse(content=response_content, status_code=status_code, headers=headers)
     
