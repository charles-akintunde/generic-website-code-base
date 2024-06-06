"""
API endpoints for user profile updates.
"""

from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import get_current_user
from app.schemas.response import StandardResponse
from app.schemas.user_info import UserDelete, UserProfileUpdate, UserRoleUpdate, UserStatusUpdate
from app.utils.utils import is_super_admin
from app.models.user_info import T_UserInfo
from app.services.user_info import delete_user, update_user_profile, update_user_role, update_user_status
from app.utils.response import error_response, success_response

router = APIRouter()


@router.put("/status", response_model=StandardResponse)
async def update_user_status_endpoint(
    user_status_update: UserStatusUpdate, 
    db: Session = Depends(get_db), 
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Update user status.

    Args:
        user status update (UserStausUpdate): user role update schema.
        db (Session): Database session.
        current_user (T_UserInfo): user making the request.

    Returns:
        StandardResponse.

    """

    is_super_admin(current_user)
    try:
        update_user_status(db=db,user_status_update=user_status_update,current_user=current_user)
        return success_response("User status update successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)

@router.put("/role", response_model=StandardResponse)
async def update_user_role_endpoint(
    user_role_update: UserRoleUpdate, 
    db: Session = Depends(get_db), 
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Update user role.

    Args:
        user_role_update (UserRoleUpdate): user role update schema.
        db (Session): Database session.
        current_user (T_UserInfo): user making the request.

    Returns:
        StandardResponse: contains updated user.

    """

    is_super_admin(current_user)
    try:
        update_user_role(db=db,user_role_update=user_role_update,current_user=current_user)
        return success_response("User role update successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.put("/profile", response_model=StandardResponse)
async def update_user_profile_endpoint(
    UI_ID: Optional[str] = Form(None),
    UI_Photo: Optional[UploadFile] = File(None),
    UI_FirstName: Optional[str] = Form(None),
    UI_LastName: Optional[str] = Form(None),
    UI_City: Optional[str] = Form(None),
    UI_Province: Optional[str] = Form(None),
    UI_Country: Optional[str] = Form(None),
    UI_PostalCode: Optional[str] = Form(None),
    UI_PhoneNumber: Optional[str] = Form(None),
    UI_Organization: Optional[str] = Form(None),
    db: Session = Depends(get_db), 
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Update user profile.

    Args:
        profile_update (UserProfileUpdate): user profile update schema.
        db (Session): Database session.
        current_user (T_UserInfo): user making the request.

    Returns:
        StandardResponse: contains updated user.
    """
    try:
        profile_update = UserProfileUpdate(
            UI_ID=UI_ID,
            UI_Photo=UI_Photo,
            UI_FirstName=UI_FirstName,
            UI_LastName=UI_LastName,
            UI_City=UI_City,
            UI_Province=UI_Province, 
            UI_Country=UI_Country,
            UI_PostalCode=UI_PostalCode,
            UI_PhoneNumber=UI_PhoneNumber,
            UI_Organization=UI_Organization,
        )
        user = await update_user_profile(db, str(current_user.UI_ID), profile_update)
        return success_response("User profile updated successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.delete("/", response_model=StandardResponse)
async def delete_user_endpoint(
    user_delete: UserDelete, 
    db: Session = Depends(get_db), 
    current_user: T_UserInfo = Depends(get_current_user)):
    """
    Delete user.

    Args:
        user_delete (UserDelete): schema to delete user.
        db (Session): Database session.

    Returns:
        response (StandardResponse): Response to signify whether operation was successful or not.    
    """
    is_super_admin(current_user=current_user)
    try:
        delete_user(db=db, delete_user_id=user_delete.UI_ID,current_user=current_user)
        return success_response("User deleted successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)



