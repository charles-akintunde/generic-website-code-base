"""
User service for handling business logic related to users.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.user_info import user_crud
from app.schemas.user_info import  UserRoleStatusUpdate, UserProfileUpdate, UserDelete, UserStatusUpdate, UsersResponse
from app.models.user_info import T_UserInfo
from app.config import settings
from app.utils.file_utils import  delete_and_save_file_azure, delete_file_from_azure, save_file_to_azure
from app.utils.response_json import create_user_response, create_users_response
from app.models.enums import E_UserRole



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

def update_user_role_status(db: Session, user_role_status_update: UserRoleStatusUpdate, current_user: T_UserInfo):
    """
    Update a user's role.
    """

    if user_role_status_update.UI_Role and E_UserRole.Member in user_role_status_update.UI_Role and not user_role_status_update.UI_MemberPosition:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A position must be assigned to a member user."
        )
    
    if user_role_status_update.UI_Role and not E_UserRole.Member in user_role_status_update.UI_Role and len(user_role_status_update.UI_Role) > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many roles assigned. A user can only have multiple roles if one of them is 'Member'."
        )
    
    if user_role_status_update.UI_Role and E_UserRole.Member in user_role_status_update.UI_Role and len(user_role_status_update.UI_Role) > 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many roles assigned. Even for a 'Member', the maximum allowed roles are two."
        )


    if user_role_status_update.UI_ID == current_user.UI_ID:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot update your own role!")

    if  user_role_status_update.UI_Role and E_UserRole.Alumni in  user_role_status_update.UI_Role:
        user_role_status_update.UI_Role = [E_UserRole.Alumni]


    update_data = user_role_status_update.model_dump(exclude_unset=True)
    update_data = {k: v for k, v in update_data.items() if v is not None}
    
    user = user_crud.update_user_role_status(
        db, 
        user_role_status_update.UI_ID, 
        update_data)
    
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
            profile_update.UI_PhotoURL=await delete_and_save_file_azure(
                file_url_to_delete=str(existing_user.UI_PhotoURL),
                file_to_upload=profile_update.UI_Photo,
            )
        else:
          profile_update.UI_PhotoURL=await save_file_to_azure(
                profile_update.UI_Photo
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

async def delete_user(db: Session, delete_user_id: str, current_user: T_UserInfo ):
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
        await delete_file_from_azure(file_url =str(existing_user.UI_PhotoURL))
    
    user = user_crud.delete_user(db, user_to_delete=existing_user)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

# def get_users(db: Session, last_key: Optional[Tuple[str, str, str]] = None, limit: int = 10) -> UsersResponse:
#     users = user_crud.get_users(db, last_key, limit)
#     total_user_count = user_crud.get_total_user_count(db=db)
#     if users:
#         last_user = users[-1]
#         new_last_key = (last_user.UI_FirstName, last_user.UI_LastName, last_user.UI_ID)
#     else:
#         new_last_key = None
#     users_response = create_users_response(users, total_user_count,new_last_key)
#     return users_response

def get_users(db: Session, page: int = 1, limit: int = 10):
    total_user_count = user_crud.get_total_user_count(db=db)
    total_pages = (total_user_count + limit - 1) 

    if total_user_count == 0:
        return create_users_response(users=[], total_users_count=total_user_count, new_last_key=None)

    if page > total_pages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid page number: {page}. There are only {total_pages} pages available."
        )
    users = user_crud.get_users(db, page, limit)
    users_response = create_users_response(users, total_user_count,None)
    return users_response

def get_users_assigned_with_positions(db: Session):
    """
        Retrieve users that have been assigned a member position.
    """

    users = user_crud.get_users_with_assigned_positions(db=db)
    total_user_count = len(users)

    return create_users_response(users=users, total_users_count=total_user_count,new_last_key=None)



def get_user_by_id(db: Session, user_id):
    """
        Retrieve a user by their ID from the database.
    """
    user = user_crud.get_user_by_id(db=db, user_id=user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with ID {user_id} not found.'
        )
    
    
    return create_user_response(user=user)