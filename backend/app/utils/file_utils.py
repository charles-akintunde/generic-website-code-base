"""
    Utils to handle deletion and addtion of files.
"""

import os 
import shutil
from typing import Optional
from urllib.parse import urlparse
import uuid
from fastapi import HTTPException, UploadFile, status

from app.config import settings
from app.utils.response import error_response


url = f"{settings.BASE_URL}/"

async def save_file(file: UploadFile, folder: str, delimiter: str = '***') -> str:
    """
    Save the uploaded file to the specified folder and return the file URL.

    Args:
        file (UploadFile): The uploaded file.
        folder (str): The folder to save the file in.

    Returns:
        str: The URL of the saved file.
    """
    os.makedirs(folder, exist_ok=True)
    file_name, file_extension = os.path.splitext(file.filename or '')
    unique_filename = f"{file_name}{delimiter}{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(folder, unique_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    file_url  = url + os.path.join(folder, unique_filename)
    return file_url

def extract_path_from_url(file_url: str):
    try:
        parsed_url = urlparse(file_url)
        file_path = parsed_url.path

        # Remove leading slash if present
        if file_path.startswith("/"):
            file_path = file_path[1:]

        return file_path
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting file path: {e}")




def delete_file(file_path: str) -> None:
    """Deletes the specified file.

    Args:
        file_path (str): The full path to the file to be deleted.

    Raises:
        HTTPException: If there's an error deleting the file or if the file doesn't exist.
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print("IMG Remove Successfully")
        else:
            raise FileNotFoundError("File not found")
    except (FileNotFoundError, PermissionError, OSError) as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Error deleting file: {e}")


async def delete_and_save_file(file_url: Optional[str], file: UploadFile, folder: str) -> Optional[str]:
        if file_url:
            delete_file(extract_path_from_url(file_url))
        return await save_file(file, folder=folder)


def validate_image_file(file: UploadFile):
    """
    Validates that the uploaded file is an image.

    Args:
        file (UploadFile): The file to be validated.

    Raises:
        HTTPException: If the file is not an image.
    """
    if file.content_type is None or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")