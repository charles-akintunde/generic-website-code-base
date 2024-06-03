"""
Applications router for the User Management Service.
This module defines the API endpoints for application-related operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.services.page_content import create_page_content, delete_page_content, get_page_content_by_title, update_page_content
from app.schemas.page_content import PageContentCreateRequest, PageContentUpdateRequest
from app.schemas.response import StandardResponse
from app.core.auth import get_current_user
from app.models.user_info import T_UserInfo
from app.database import get_db
from app.utils.response import error_response, success_response

router = APIRouter()

@router.post("", response_model=StandardResponse)
async def create_page_content_endpoint(
    page_content: PageContentCreateRequest,
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user)):
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
        new_page_content = create_page_content(
            db=db,
            user = current_user,
            page_content=page_content
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
    page_content_id,
    page_content_update: PageContentUpdateRequest,
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

    try:
        updated_page_content = update_page_content(
            db=db,
            page_content_id=page_content_id,
            page_content_update=page_content_update
        )
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
