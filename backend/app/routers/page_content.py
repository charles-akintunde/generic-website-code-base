"""
Applications router for the User Management Service.
This module defines the API endpoints for application-related operations.
"""

import json
from typing import Optional, Union
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.services.page_content import create_page_content, delete_page_content, get_page_content_by_title, update_page_content
from app.schemas.page_content import PageContentCreateRequest, PageContentUpdateRequest
from app.schemas.response import StandardResponse
from app.core.auth import get_current_user
from app.models.user_info import T_UserInfo
from app.database import get_db
from app.utils.response import error_response, success_response
from app.utils.file_utils import save_file
from app.config import settings

router = APIRouter()

@router.post("", response_model=StandardResponse)
async def create_page_content_endpoint(
    UI_ID: str = Form(...),
    PG_ID: str = Form(...),
    PC_Title: str = Form(...),
    PC_Content: Optional[str] = Form(None),  # Will be received as JSON string
    PC_ThumbImg: Optional[UploadFile] = File(None),
    PC_Resource: Optional[UploadFile] = File(None),
    PC_IsHidden: bool = Form(...),
    PC_CreatedAt: Optional[str] = Form(None),
    PC_LastUpdatedAt: Optional[str] = Form(None),
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

        page_content_data = PageContentCreateRequest(
        UI_ID=UI_ID,
        PG_ID=PG_ID,
        PC_Title=PC_Title,
        PC_Content=json.loads(PC_Content) if PC_Content else None,  # Convert JSON string to dict
        PC_IsHidden=PC_IsHidden,
        PC_CreatedAt=PC_CreatedAt,
        PC_LastUpdatedAt=PC_LastUpdatedAt
    )

        if PC_ThumbImg:
            thumbnail_url=await save_file(PC_ThumbImg, settings.THUMBNAILS_FILE_PATH)
            page_content_data.PC_ThumbImgURL = str(thumbnail_url) 

        if PC_Resource:
            resource_url=await save_file(PC_Resource, settings.RESOURCE_FILE_PATH)
            page_content_data.PC_DisplayURL = str(resource_url) 

        new_page_content = create_page_content(
            db=db,
            user = current_user,
            page_content=page_content_data
        )
        return success_response("Page content created successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.get("{page_name}/{page_content_title}", response_model=StandardResponse)
async def get_page_content_by_title_endpoint(
    page_content_title: str,
    page_name: str,
    db: Session = Depends(get_db)):
    """
    Get page content by title.

    Args:
        postTitle (str): The title of the page content to retrieve.
        db (Session): Database session.

    Returns:
        StandardResponse: The response containing the page content.
    """
    try:
        page_content = get_page_content_by_title(
            db=db, 
            page_content_title=page_content_title,
            page_name=page_name)
        return success_response(message="Page content fetched successfully", data=page_content.model_dump())
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)

@router.put("/{page_content_id}", response_model=StandardResponse)
async def update_page_content_endpoint(
    page_content_id: str ,
    PC_Title: Optional[str] = Form(None),
    PC_Content: Optional[str] = Form(None),  # Will be received as JSON string
    PC_ThumbImg: Optional[UploadFile] = File(None),
    PC_Resource: Optional[UploadFile] = File(None),
    PC_IsHidden: Optional[bool] = Form(None),
    db: Session = Depends(get_db),
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
    page_content_update= PageContentUpdateRequest(
    PC_Title=PC_Title,
    PC_ThumbImg=PC_ThumbImg,
    PC_Resource=PC_Resource,
    PC_Content=json.loads(PC_Content) if PC_Content else None,
    PC_IsHidden=PC_IsHidden
    )
    try:
        updated_page_content = await update_page_content(
            db=db,
            page_content_id=page_content_id,
            page_content_update=page_content_update
        ) # type: ignore
        return success_response(message="Page content updated successfully",data=updated_page_content.model_dump())

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
        success = delete_page_content(db=db, page_content_id=page_content_id)
        if success:
            return success_response(message="Page content deleted successfully")
        else:
            return error_response(message="Failed to delete the page content", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
