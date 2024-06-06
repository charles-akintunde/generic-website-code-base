"""
User service for handling business logic related to users.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.user_info import user_crud
from app.schemas.user_info import UserRoleUpdate, UserProfileUpdate, UserDelete, UserStatusUpdate
from app.models.user_info import T_UserInfo
from app.config import settings
from app.utils.file_utils import delete_and_save_file, delete_file, extract_path_from_url, save_file



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

async def update_user_profile(db: Session, user_id: str, profile_update: UserProfileUpdate):
    """
    Update a user's profile.
    """
    existing_user = user_crud.get_user_by_id(
        db=db,
        user_id=user_id
    )

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if profile_update.UI_Photo:
        if existing_user.UI_PhotoURL: # type: ignore
            profile_update.UI_PhotoURL=await delete_and_save_file(
                file_url=str(existing_user.UI_PhotoURL),
                file=profile_update.UI_Photo,
                folder=settings.USER_PROFILE_FILE_PATH
            )
        else:
          profile_update.UI_PhotoURL=await save_file(
                profile_update.UI_Photo,
                folder=settings.USER_PROFILE_FILE_PATH
            )
        del profile_update.UI_Photo  # Remove the photo from the update data

    update_data = profile_update.model_dump(exclude_unset=True)
    update_data = {k: v for k, v in update_data.items() if v is not None}

    updated_user = user_crud.update_user_profile(
        db=db, 
        user=existing_user, 
        update_data=update_data
    )

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
    
    return updated_user

def delete_user(db: Session, delete_user_id: str, current_user: T_UserInfo ):
    """
    Delete a user.
    """
    if str(current_user.UI_ID) == delete_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot remove yourself!"
        )
    
    existing_user = user_crud.get_user_by_id(
        db=db,
        user_id=delete_user_id
    )

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if existing_user.UI_PhotoURL: # type: ignore
        delete_file(extract_path_from_url(str(existing_user.UI_PhotoURL)))
    
    user = user_crud.delete_user(db, user_to_delete=existing_user)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user