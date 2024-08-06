"""
API endpoints for user profile updates.
"""

from typing import List, Optional, Tuple
from uuid import UUID
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import get_current_user
from app.schemas.response import StandardResponse
from app.schemas.user_info import UserDelete, UserProfileUpdate, UserRoleStatusUpdate, UserStatusUpdate
from app.utils.utils import is_super_admin
from app.models.user_info import T_UserInfo
from app.services.user_info import delete_user, get_user_by_id, get_users, get_users_assigned_with_positions, update_user_profile, update_user_role_status, update_user_status
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

@router.put("/role-status", response_model=StandardResponse)
async def update_user_role_status_endpoint(
    user_role_status_update: UserRoleStatusUpdate, 
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
        update_user_role_status(db=db,user_role_status_update=user_role_status_update,current_user=current_user)
        return success_response("User role update successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.put("/{UI_ID}", response_model=StandardResponse)
async def update_user_profile_endpoint(
    UI_ID: str,
    UI_Photo: Optional[UploadFile] = File(None),
    UI_FirstName: Optional[str] = Form(None),
    UI_LastName: Optional[str] = Form(None),
    UI_City: Optional[str] = Form(None),
    UI_Province: Optional[str] = Form(None),
    UI_Country: Optional[str] = Form(None),
    UI_PostalCode: Optional[str] = Form(None),
    UI_PhoneNumber: Optional[str] = Form(None),
    UI_Organization: Optional[str] = Form(None),
    UI_About: Optional[str] = Form(None),
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
            UI_About=UI_About
        )

        print(profile_update,"profile_update")
        user = await update_user_profile(db, str(current_user.UI_ID), profile_update)
        return success_response("User profile updated successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.delete("/{user_id}", response_model=StandardResponse)
async def delete_user_endpoint(
    user_id: str, 
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
        delete_user(db=db, delete_user_id=user_id,current_user=current_user)
        return success_response("User deleted successfully")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)

# @router.get("/", response_model=StandardResponse)
# async def get_users_endpoint(
#     last_first_name: Optional[str] = Query(None),
#     last_last_name: Optional[str] = Query(None),
#     last_uuid: Optional[str] = Query(None),
#     limit: int = Query(5, gt=0),
#     db: Session = Depends(get_db)):
#     try: 
#         last_key: Optional[Tuple[str, str, str]] = None
#         if last_first_name and last_last_name and last_uuid:
#             last_key =  (last_first_name, last_last_name, last_uuid) 
        
#         users_response = get_users(db=db, last_key=last_key, limit=limit)
#         return success_response(data = users_response.model_dump(), message='Users fetched successfully')
#     except HTTPException as e:
#         return error_response(message=e.detail, status_code=e.status_code)

@router.get("/", response_model=StandardResponse)
async def get_users_endpoint(
    page: int = Query(1),
    limit: int = Query(5, gt=0),
    db: Session = Depends(get_db)):
    try: 
        users_response = get_users(db=db, page=page, limit=limit)
        return success_response(data = users_response.model_dump(), message='Users fetched successfully')
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.get('/members', response_model=StandardResponse)
async def get_member_users_endpoint(
    request: Request,
    db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    print(token,"TOKENNNNNNNNNNNNNNNNNNnn")
    try:
        users_response = get_users_assigned_with_positions(db=db)
        return success_response(data = users_response.model_dump(), message='Users fetched successfully')
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)
    
@router.get("/{user_id}", response_model=StandardResponse)
async def get_user_endpoint( user_id: str, db: Session = Depends(get_db)):
    """
    Fetch user details by user ID.

    This endpoint retrieves user details from the database based on the provided user ID.

    Args:
        user_id (str): The ID of the user to be retrieved.
        db (Session, optional): The database session dependency.

    Returns:
        StandardResponse: A response object containing the user data and a success message.

    Raises:
        HTTPException: If the user is not found or any other error occurs.
    """
    try:
        user_response = get_user_by_id(db=db,user_id=user_id)
        return success_response(data= user_response.model_dump(), message="User fetched successfully.")
    except HTTPException as e:
        return error_response(message=e.detail,status_code=e.status_code)

