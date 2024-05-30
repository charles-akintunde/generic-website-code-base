"""
User service for handling business logic related to users.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.user_info import user_crud
from app.schemas.user_info import UserRoleUpdate, UserProfileUpdate, UserDelete, UserStatusUpdate
from app.models.user_info import T_UserInfo



def update_user_status(db: Session, user_status_update: UserStatusUpdate, current_user: T_UserInfo):
    """
    Update a user's role.
    """

    if user_status_update.UI_ID == current_user.UI_ID:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot update your own status!")

    user = user_crud.update_user_status(
        db, 
        user_status_update.UI_ID, 
        user_status_update.UI_Status)
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def update_user_role(db: Session, user_role_update: UserRoleUpdate, current_user: T_UserInfo):
    """
    Update a user's role.
    """

    if user_role_update.UI_ID == current_user.UI_ID:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot update your own role!")

    user = user_crud.update_user_role(
        db, 
        user_role_update.UI_ID, 
        user_role_update.UI_Role)
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def update_user_profile(db: Session, user_id: str, profile_update: UserProfileUpdate):
    """
    Update a user's profile.
    """
    user = user_crud.update_user_profile(
        db=db, 
        user_id=user_id, 
        update_data=profile_update.model_dump(exclude_unset=True))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

def delete_user(db: Session, delete_user_id: str, current_user: T_UserInfo ):
    """
    Delete a user.
    """
    if str(current_user.UI_ID) == delete_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot remove yourself!"
        )
        
    user = user_crud.delete_user(db, user_id=delete_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user