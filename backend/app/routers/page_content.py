"""
Applications router for the User Management Service.
This module defines the API endpoints for application-related operations.
"""

from datetime import datetime
import json
from typing import List, Optional
from urllib.parse import unquote
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session
from app.services.page_content import create_page_content, delete_page_content, get_page_content_by_display_url, update_page_content
from app.schemas.page_content import PageContentCreateRequest, PageContentUpdateRequest
from app.schemas.response import StandardResponse
from app.core.auth import get_current_user, get_current_user_without_exception
from app.models.user_info import T_UserInfo
from app.database import get_db
from app.utils.response import error_response, success_response
from app.utils.file_utils import save_file, save_file_to_azure, validate_image_file
from app.config import settings
from app.utils.response_json import create_page_content_img_response


router = APIRouter()

@router.post("", response_model=StandardResponse)
async def create_page_content_endpoint(
    UI_ID: str = Form(...),
    PG_ID: str = Form(...),
    PC_Title: str = Form(...),
    PC_DisplayURL: Optional[str] = Form(None),
    PC_Content: Optional[str] = Form(None), 
    PC_CreatedAt: Optional[str] = Form(None),
    PC_ThumbImg: Optional[UploadFile] = File(None),
    PC_Resource: Optional[UploadFile] = File(None),
    PC_IsHidden: bool = Form(...),
    PC_UsersId: Optional[str] = Form(None),  
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user)
):
    """
    Create a new page content.

    Args:
        page_content (PageContentCreateRequest): The page content to create.
        db (Session): Database session.
        current_user (T_UserInfo): The current authenticated user.

    Returns:
        StandardResponse: The response indicating the result of the create operation.
    """
    try:
        user_ids = json.loads(PC_UsersId) if PC_UsersId else []
        if not isinstance(user_ids, list):
            raise ValueError("PC_UsersId should be a list.")
        



        page_content_data = PageContentCreateRequest(
            UI_ID=UI_ID,
            PG_ID=PG_ID,
            PC_Title=PC_Title,
            PC_CreatedAt=PC_CreatedAt,
            PC_Content=json.loads(PC_Content) if PC_Content else None,  # Convert JSON string to dict
            PC_IsHidden=PC_IsHidden,
            PC_ThumbImg=PC_ThumbImg,
            PC_Resource=PC_Resource,
            PC_DisplayURL=PC_DisplayURL,
            PC_UsersId=user_ids  
        )

        print(page_content_data,"page_content_data")
        
        new_page_content = await create_page_content(
            db=db,
            user=current_user,
            page_content=page_content_data
        )
        
        return success_response("Page content created successfully", data=new_page_content.model_dump())
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.get("/{page_display_url}/{page_content_display_url}", response_model=StandardResponse)
async def get_page_content_by_display_url_endpoint(
    page_content_display_url: str,
    page_display_url: str,
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user_without_exception)
):
    """
    Get page content by title.

    Args:
        postTitle (str): The title of the page content to retrieve.
        db (Session): Database session.

    Returns:
        StandardResponse: The response containing the page content.
    """
    try:
        decoded_page_content_display_url = unquote(page_content_display_url)
        decoded_page_display_url = unquote(page_display_url)
        page_content = get_page_content_by_display_url(
            db=db, 
            page_content_display_url=decoded_page_content_display_url,
            page_display_url=decoded_page_display_url,
            current_user=current_user)
        return success_response(message="Page content fetched successfully", data=page_content.model_dump())
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
# @router.get("/{page_display_url}/{page_content_display_url}", response_model=StandardResponse)
# async def get_page_content_by_display_url_with_offset_endpoint(
#     page_content_display_url: str,
#     page_display_url: str,
#     pg_page_number: int = Query(1),
#     pg_page_limit: int = Query(5, gt = 0),
#     db: Session = Depends(get_db)):
#     """
#     Get page content by title.

#     Args:
#         postTitle (str): The title of the page content to retrieve.
#         db (Session): Database session.delete

#     Returns:
#         StandardResponse: The response containing the page content.
#     """
#     try:
#         decoded_page_content_display_url = unquote(page_content_display_url)
#         decoded_page_display_url = unquote(page_display_url)
#         page_content = get_page_content_by_display_url(
#             db=db, 
#             page_content_display_url=decoded_page_content_display_url,
#             page_display_url=decoded_page_display_url)
#         return success_response(message="Page content fetched successfully", data=page_content.model_dump())
#     except HTTPException as e:
#         return error_response(message=e.detail, status_code=e.status_code)


@router.put("/{page_content_id}", response_model=StandardResponse)
async def update_page_content_endpoint(
    page_content_id: str ,
    PC_Title: Optional[str] = Form(None),
    PC_Content: Optional[str] = Form(None),  
    PC_DisplayURL: Optional[str] = Form(None),
    PC_CreatedAt: Optional[str] = Form(None),
    PC_ThumbImg: Optional[UploadFile] = File(None),
    PC_Resource: Optional[UploadFile] = File(None),
    PC_IsHidden: Optional[bool] = Form(None),
    db: Session = Depends(get_db),
    PC_UsersId: Optional[str] = Form(None),  
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Update page content by ID.

    Args:
        page_content_id (UUID): The ID of the page content to update.
        page_content_update (PageContentUpdateRequest): The updated page content data.
        db (Session): Database session.

    Returns:
        StandardResponse: The response indicating the result of the update operation.
    """ 
    try:
        user_ids = json.loads(PC_UsersId) if PC_UsersId else []
        if not isinstance(user_ids, list):
            raise ValueError("PC_UsersId should be a list.")

        page_content_update= PageContentUpdateRequest(
        PC_Title=PC_Title,
        PC_ThumbImg=PC_ThumbImg,
        PC_Resource=PC_Resource,
        PC_CreatedAt=PC_CreatedAt,
        PC_Content=json.loads(PC_Content) if PC_Content else None,
        PC_IsHidden=PC_IsHidden,
        PC_UsersId=user_ids
        )

        if PC_DisplayURL:
            page_content_update.PC_DisplayURL = PC_DisplayURL
        
        updated_page_content = await update_page_content(
            db=db,
            page_content_id=page_content_id,
            page_content_update=page_content_update
        ) # type: ignore
        return success_response(message="Page content updated successfully",data=updated_page_content.model_dump())
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)

@router.delete("/{page_content_id}", response_model=StandardResponse)
async def delete_page_content_endpoint(
    page_content_id: str,
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Delete page content by ID.

    Args:
        pageContentId (UUID): The ID of the page content to delete.
        db (Session): Database session.

    Returns:
        StandardResponse: The response indicating the result of the delete operation.
    """ 
    try:
        success =await  delete_page_content(db=db, page_content_id=page_content_id)
        if success:
            return success_response(message="Page content deleted successfully")
        else:
            return error_response(message="Failed to delete the page content", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)


@router.post("/upload-page-content-image", response_model=StandardResponse)
async def upload_page_content_image_endpoint(
    PC_PageContentImg: UploadFile = File(...),
  # current_user: T_UserInfo = Depends(get_current_user)
):
    """
    Upload an image to be used within page content.

    This endpoint allows an authenticated super admin user to upload an image for page content.
    The image is saved to the server, and a URL to the image is returned in the response,
    which can be used in a content editor that only accepts URLs.

    Args:
        page_content_image (UploadFile): The image file to be uploaded.
        current_user (T_UserInfo): The current user, automatically injected by FastAPI.

    Returns:
        StandardResponse: A response object containing a message and the URL of the uploaded image.

    Raises:
        HTTPException: If the user is not authorized or if any other error occurs during file processing.
    """
    try:
       # is_super_admin(current_user=current_user)
        page_content_image = PC_PageContentImg
        validate_image_file(page_content_image)
        image_url = await save_file_to_azure(page_content_image)
        response = create_page_content_img_response(image_url)
        return success_response(message="Image uploaded successfully", data=response.model_dump())

    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    