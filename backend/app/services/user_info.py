"""
User service for handling business logic related to users.
"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from app.crud.user_info import user_crud
from app.crud import  page
from app.schemas.user_info import  UserRoleStatusUpdate, UserProfileUpdate, UserDelete, UserStatusUpdate, UsersResponse
from app.models.user_info import T_UserInfo
from app.config import settings
from app.utils.file_utils import  delete_and_save_file_azure, delete_file_from_azure, save_file_to_azure
from app.utils.response_json import build_page_content_json_with_excerpt, build_transform_user_to_partial_json, build_user_page_content_json, create_user_page_content_response, create_user_response, create_users_response
from app.models.enums import E_MemberPosition, E_UserRole
from app.core.auth import get_current_user
from app.utils.utils import generate_unique_url, is_super_admin
from app.crud import page



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
    existing_user = db.query(T_UserInfo).filter(T_UserInfo.UI_ID == user_role_status_update.UI_ID).first()
    if user_role_status_update.UI_Role and E_UserRole.SuperAdmin in user_role_status_update.UI_Role:
        existing_superadmin = db.query(T_UserInfo).filter(T_UserInfo.UI_Role.any(E_UserRole.SuperAdmin)).first()
        if existing_superadmin and existing_superadmin.UI_ID != user_role_status_update.UI_ID:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="There is already an existing SuperAdmin in the system."
            )
        
    if user_role_status_update.UI_MemberPosition == E_MemberPosition.DIRECTOR:
        existing_director = db.query(T_UserInfo).filter(T_UserInfo.UI_MemberPosition == E_MemberPosition.DIRECTOR).first()
        if existing_director and existing_director.UI_ID != user_role_status_update.UI_ID:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="There is already an existing Director in the system."
            )

    if (
        user_role_status_update.UI_Role 
        and E_UserRole.Member in user_role_status_update.UI_Role 
        and not user_role_status_update.UI_MemberPosition
    ):
        if not existing_user.UI_MemberPosition:
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

    if user_role_status_update.UI_Role and E_UserRole.Alumni in user_role_status_update.UI_Role:
        user_role_status_update.UI_Role = [E_UserRole.Alumni]


    # Prepare update data
    update_data = user_role_status_update.model_dump(exclude_unset=True)
    update_data = {k: v for k, v in update_data.items() if v is not None}

    if user_role_status_update.UI_Role and (
        E_UserRole.User in user_role_status_update.UI_Role 
        or E_UserRole.Public in user_role_status_update.UI_Role
    ):
        update_data["UI_MemberPosition"] = None

    print(user_role_status_update,"user_role_status_update")
    
    user = user_crud.update_user_role_status(
        db, 
        user_role_status_update.UI_ID, 
        update_data
    )
    
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

    if "UI_FirstName" in update_data or "UI_LastName" in update_data:
        first_name = update_data.get("UI_FirstName", existing_user.UI_FirstName)
        last_name = update_data.get("UI_LastName", existing_user.UI_LastName)

        update_data["UI_UniqueURL"] = generate_unique_url(
            db=db,
            first_name=first_name,
            last_name=last_name
        )

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
    
    return build_transform_user_to_partial_json(updated_user)

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

def get_users(db: Session, page: int = 1, limit: int = 10, current_user: T_UserInfo = Depends(get_current_user)):
    #is_super_admin(current_user)
    
    
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



def get_user_by_id(db: Session, user_id, pg_offset: Optional[int] = 8, pg_page_number: Optional[int] = 1):
    """
    Retrieve a user by their ID from the database.
    """
    pg_offset = pg_offset or 8
    pg_page_number = pg_page_number or 1

    user_fetched = user_crud.get_user_by_url(db=db, user_id=user_id)
    
    if not user_fetched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with ID {user_id} not found.'
        )
    
    user_page_contents = user_fetched.UI_UsersPageContents
    transformed_user_page_contents = []

    # start_index = (pg_page_number - 1) * pg_offset
    # end_index = start_index + pg_offset
    
    #paginated_user_page_contents = user_page_contents[start_index:end_index]
    
    for user_page_content in user_page_contents:
        user = user_crud.get_user_by_id(db=db, user_id=user_page_content.UI_ID)
        existing_page = page.page_crud.get_page_by_id(db=db, page_id=user_page_content.PG_ID)
        transformed_user_page_content = build_page_content_json_with_excerpt(
            user_page_content, user, page=existing_page
        )
        transformed_user_page_contents.append(transformed_user_page_content)

    return create_user_response(user=user_fetched, page_contents=transformed_user_page_contents)



def get_user_by_url(db: Session, user_url, pg_offset: Optional[int] = 10, pg_page_number: Optional[int] = 1):
    """
    Retrieve a user by their URL from the database.
    """
    pg_offset = pg_offset or 8
    pg_page_number = pg_page_number or 1

    # Fetch user from the database
    user_fetched = user_crud.get_user_by_url(db=db, user_url=user_url)
    if not user_fetched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with URL {user_url} not found.'
        )
    
    user_page_contents = user_fetched.UI_UsersPageContents
    total_page_content_count = len(user_page_contents)

    total_pages = (total_page_content_count + pg_offset - 1) // pg_offset  # Ceiling division

    if pg_page_number > total_pages:
        # Option 1: Return an empty response
        return create_user_page_content_response(
            total_page_content=total_page_content_count,
            user_response=create_user_response(user=user_fetched, page_contents=[])
        )
        # Option 2: Raise an error (uncomment if preferred)
        # raise HTTPException(
        #     status_code=status.HTTP_400_BAD_REQUEST,
        #     detail=f'Page number {pg_page_number} exceeds total pages {total_pages}.'
        # )

    start_index = (pg_page_number - 1) * pg_offset
    end_index = start_index + pg_offset
    paginated_user_page_contents = user_page_contents[start_index:end_index]

    transformed_user_page_contents = []
    for user_page_content in paginated_user_page_contents:
        user = user_crud.get_user_by_id(db=db, user_id=user_page_content.UI_ID)
        existing_page = page.page_crud.get_page_by_id(db=db, page_id=user_page_content.PG_ID)
        transformed_content = build_page_content_json_with_excerpt(
            user_page_content, user, page=existing_page
        )
        transformed_user_page_contents.append(transformed_content)

    user_response = create_user_response(user=user_fetched, page_contents=transformed_user_page_contents)

    return create_user_page_content_response(
        total_page_content=total_page_content_count,
        user_response=user_response
    )
