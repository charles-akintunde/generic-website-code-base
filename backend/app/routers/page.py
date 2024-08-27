"""
Teams router for the User Management Service.
This module defines the API endpoints for team-related operations.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from httpx import request
from sqlalchemy.orm import Session
from app.schemas.response import StandardResponse
from app.schemas.page import GetPageRequest, PageCreate, PageResponse, PageUpdateRequest
from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_db
from app.core.auth import get_current_user, get_current_user_without_exception
from app.utils.utils import is_super_admin
from app.models.user_info import T_UserInfo
from app.services.page import create_new_page, delete_page, get_page, get_pages, get_pages_with_offset, update_page
from app.utils.response import error_response, success_response
from app.models.enums import E_PageType, E_UserRole


router = APIRouter()

@router.post("", response_model=StandardResponse)
async def create_page_endpoint(
    page: PageCreate, 
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user)
    ):
    """
    Create a new page

    Args
        page (PageCreate): page creation schema
        db (Session): Database session.

    Returns
        StandardResponse.
    """
    is_super_admin(current_user=current_user)
    try: 
        new_page =await create_new_page(db,page, current_user)
        return success_response("Page create successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.get("/{pg_display_url}", response_model=StandardResponse)
async def get_page_endpoint(
    pg_display_url: str, 
    db: Session = Depends(get_db), 
    current_user: Optional[T_UserInfo] = Depends(get_current_user_without_exception)):
    """
    Get an existing page.

    Args
        request (GetPageRequest): page creation schema
        db (Session): Database session.

    Returns
        StandardResponse: The response indicating the result of the operation.
    """
   
    try:
        existing_page = get_page(
            db=db, 
            pg_display_url=pg_display_url,
            current_user=current_user)
        return success_response(message="Page fetched successfully", data=existing_page.model_dump())
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.get("", response_model=StandardResponse)
async def get_pages_endpoint(
    db: Session = Depends(get_db)):
    """
    Get all pages.

    Args
        db (Session): Database session.

    Returns
        StandardResponse: The response indicating the result of the operation.
    """
   
    try:
        pages = get_pages(db=db)
        return success_response(message="Pages fetched successfully", data=pages.model_dump())
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)

@router.get("/", response_model=StandardResponse)
async def get_pages_with_offset_endpoint(
    pg_page_number: int = Query(1),
    pg_page_limit: int = Query(5, gt = 0),
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Get all pages using offset  to limit the number fetched

    Args
        db (Session): Database session.

    Returns
        StandardResponse: The response indication the result of the operation.
    """
    try:
        pages_response = get_pages_with_offset(db = db, pg_page_number=pg_page_number, pg_page_limit=pg_page_limit)
        return success_response(data = pages_response.model_dump(), message='Pages fetched successfully')
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)    

@router.put("/{page_id}", response_model=StandardResponse)
async def update_page_endpoint(
    page_id: str,
    page_update: PageUpdateRequest,
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Update an existing page.

    Args:
        page_id (str): The ID of the page to update.
        page_update (PageUpdateRequest): The updated page data.
        db (Session): Database session.
        current_user (T_UserInfo): The current authenticated user.

    Returns:
        StandardResponse: The response indicating the result of the operation.
    """
    try:
        updated_page = update_page(
            db=db, 
            page_id=page_id, 
            page_update=page_update, 
            user=current_user)
        return success_response(message="Page updated successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.delete("/{page_id}", response_model=StandardResponse)
async def delete_page_endpoint(
    page_id: str,
    db: Session = Depends(get_db),
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Delete an existing page.

    Args:
        page_id (str): The ID of the page to delete.
        db (Session): Database session.
        current_user (T_UserInfo): The current authenticated user.

    Returns:
        StandardResponse: The response indicating the result of the delete operation.
    """
    try:
        success = delete_page(db=db, page_id=page_id, user=current_user)
        if success:
            return success_response(message="Page deleted successfully")
        else:
            return error_response(message="Failed to delete the page", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
