"""
    Utils to handle deletion and addtion of files.
"""

from multiprocessing import connection
import os 
from azure.storage.blob import BlobServiceClient, ContentSettings
from typing import Optional
from urllib.parse import unquote, urlparse
import uuid
from fastapi import HTTPException, UploadFile, status, FastAPI, File
from app.config import settings
from app.utils.response import error_response

connection_string = settings.AZURE_STORAGE_CONNECTION_STRING
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
azure_storage_container_name = settings.AZURE_STORAGE_CONTAINER_NAME
container_name = "uploads"

url = f"{settings.BASE_URL}/"
file_url_for_dev = f"{url}static/uploads"
is_production = settings.PRODUCTION_MODE
cwd = os.getcwd()


async def save_file_to_azure(file: UploadFile, delimiter: str = '-') -> str:
    """
    Save the uploaded file to Azure Blob Storage and return the file URL.

    Args:
        file (UploadFile): The uploaded file.
        delimiter (str): The delimiter to use in the unique filename.

    Returns:
        str: The URL of the saved file.

    Raises:
        HTTPException: If there's an error during the upload process.
    """
    try:
        if is_production:
            unique_filename = f"{uuid.uuid4()}{delimiter}{file.filename}"
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=unique_filename)
            
            content_type = file.content_type
            
            blob_client.upload_blob(
                await file.read(),
                content_settings=ContentSettings(content_type=content_type)
            )
            
            file_url = blob_client.url

            return file_url
        else:
            return await save_file(file)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error saving file: {e}")


async def delete_file_from_azure(file_url: str) -> None:
    """
    Deletes the specified file from Azure Blob Storage.

    Args:
        file_url (str): The URL of the file to be deleted.

    Raises:
        HTTPException: If there's an error deleting the file or if the file doesn't exist.
    """
    try:
        if is_production:
            parsed_url = urlparse(file_url)
            file_path = parsed_url.path.lstrip('/')  
            
            blob_name = file_path.split('/', 1)[1]  
            decoded_blob_name = unquote(blob_name)
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=decoded_blob_name)
            
            blob_client.delete_blob()
        else:
            delete_file(file_url)
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Error deleting file: {e}")




async def save_file(file: UploadFile, folder: str = 'static/uploads', delimiter: str = '-') -> str:
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
    file_path = os.path.join(cwd,'app',folder, unique_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    file_url  = f'{file_url_for_dev}/{unique_filename}' 
    return file_url

def extract_path_from_url(file_url: str) -> str:
    """
    Converts a file URL to a local file path on the server.

    Args:
        file_url (str): The URL of the file.

    Returns:
        str: The full local file path corresponding to the file URL.
    """
    try:
        parsed_url = urlparse(file_url)
        file_path = parsed_url.path

        if file_path.startswith("/"):
            file_path = file_path[1:]

        local_path = os.path.join("app", file_path)
        return local_path
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting file path: {e}")




def delete_file(file_url: str) -> None:
    """Deletes the specified file.

    Args:
        file_path (str): The full path to the file to be deleted.

    Raises:
        HTTPException: If there's an error deleting the file or if the file doesn't exist.
    """
    try:
        file_path = extract_path_from_url(file_url)
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            raise FileNotFoundError("File not found")
    except (FileNotFoundError, PermissionError, OSError) as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Error deleting file: {e}")


async def delete_and_save_file(file_url: Optional[str], file: UploadFile, folder: str) -> Optional[str]:
        if file_url:
            delete_file(extract_path_from_url(file_url))
        return await save_file(file, folder=folder)


async def delete_and_save_file_azure(file_url_to_delete: Optional[str], file_to_upload: UploadFile) -> Optional[str]:
    if file_url_to_delete:
        await delete_file_from_azure(file_url_to_delete)
    return await save_file_to_azure(file_to_upload)


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
    

