"""
    Business logic to handle page content creation.
"""
from urllib.parse import unquote
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.crud.user_info import user_crud
from app.crud.page import page_crud
from app.crud.page_content import page_content_crud
from app.schemas.page_content import PageContentCreateRequest, PageContentUpdateRequest
from app.utils.utils import check_user_role, is_admin
from app.models.user_info import T_UserInfo
from app.utils.response_json import build_page_content_json, build_page_json_with_single_content
from app.schemas.page import  PageSingleContent
from app.utils.file_utils import  delete_and_save_file_azure, save_file_to_azure
from app.config import settings
from app.models.enums import E_PageType, E_UserRole
from app.core.auth import get_current_user_without_exception
from datetime import datetime

async def create_page_content(
        db: Session,
        user: T_UserInfo,
        page_content: PageContentCreateRequest):
    
    if str(user.UI_ID) != page_content.UI_ID:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User creating content does not match authenticated user."
        )
    
    user = user_crud.get_user_by_id(
        db=db,
        user_id=page_content.UI_ID,
    )

    page = page_crud.get_page_by_id(
        db=db,
        page_id=page_content.PG_ID
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Page with pageId ({page_content.PG_ID}) not found"
        )

    is_admin(
        current_user=user,
        detail="You are not authorized to add page content"
    )

    if not page_content.PC_Title or len(page_content.PC_Title.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page content title cannot be empty."
        )
    
    if page_content.PC_DisplayURL:
        existing_page_content = page_content_crud.check_page_content__exist_by_title_or_display_url(
            page_id=page_content.PG_ID,
            page_content_title=page_content.PC_Title,
            page_content_display_url=page_content.PC_DisplayURL,
            db=db
    )
    else:
         existing_page_content = page_content_crud.get_page_content_by_title(
            page_id=page_content.PG_ID,
            page_content_title=page_content.PC_Title,
            db=db
    )
        


    if existing_page_content:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Page content with title ({page_content.PC_Title}) already exists."
        )

    if page.PG_Type == E_PageType.SinglePage and len(page.PG_PageContents) >= 1: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Single pages cannot take more than one item."
        )
    
    if page_content.PC_ThumbImg:
            thumbnail_url=await save_file_to_azure(page_content.PC_ThumbImg)
            page_content.PC_ThumbImgURL = str(thumbnail_url) 
    delattr(page_content, "PC_ThumbImg")

    if page_content.PC_Resource:
            resource_url=await save_file_to_azure(page_content.PC_Resource, settings.RESOURCE_FILE_PATH)
            page_content.PC_DisplayURL = str(resource_url) 
    delattr(page_content, "PC_Resource")

    user_ids = page_content.PC_UsersId 
    if user_ids:  
        users = user_crud.get_users_by_ids(db, user_ids)
        if users and  len(users) != len(user_ids):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or more users not found"
            )

    new_page_content = page_content_crud.create_page_content(
        db=db,
        page_content= page_content)
    
    if new_page_content is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating page content"
        )
    

    
    page = page_crud.get_page_by_id(db=db, page_id=str(page_content.PG_ID))
    
    return build_page_content_json(
        page_content=new_page_content,
        page=page,
        user=user
    )

def get_page_content_by_display_url(
        db: Session,
        page_content_display_url: str,
        page_display_url: str,
       current_user: T_UserInfo) -> PageSingleContent:
    """
    Handles retrieving page content.

    Args:
        db (Session): Database session.
        page_content_title (str): Page content title.
        page_id (str): Page ID.

    Returns:
        PageSingleContent: Page content response.
    """
    user_roles = (current_user.UI_Role if current_user else [E_UserRole.Public])
    current_time = datetime.now()
    page = page_crud.get_page_by_display_url(db=db, pg_display_url=page_display_url)
    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Page with ({page_display_url}) display URL not found"
        )

    page_content = page_content_crud.get_page_content_by_display_url(
        db=db,
        page_content_display_url=page_content_display_url,
        page_id=str(page.PG_ID)
    )
    if page_content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"This page does not have content with display URL '{page_content_display_url}'."
        )

    
    if not check_user_role(user_roles, [E_UserRole.SuperAdmin, E_UserRole.Admin]): # type: ignore
        if page_content.PC_IsHidden: # type: ignore
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="You are not authorized to access this page."
            )
        
        if page_content.PC_CreatedAt > current_time: # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Page content cannot be accessed yet."
            )
    
        pass

    page_content_creator = user_crud.get_user_by_id(
        db=db,
        user_id=str(page_content.UI_ID)
    )

    page_content_json = build_page_content_json(
        page_content=page_content,
        page= page,
        user=page_content_creator
    )


    page_response_json = build_page_json_with_single_content(
        page=page,
        page_content=page_content_json
    )

    return page_response_json

async def update_page_content(
        db: Session,
        page_content_id: str,
        page_content_update: PageContentUpdateRequest):
    """
    Handles logic for updating a page_content.

    Args:
        db (Session): Database Session.
        page_content_id (str): Unique identifier for page content.
        page_content_update (PageContentUpdateRequest): Schema for page content update request. 

    Returns:
        updated_page (T_PageContent): The updated page content.
    """

    existing_page_content = page_content_crud.get_page_content_by_id(
        db=db,
        page_content_id=page_content_id
    )
    
    if not existing_page_content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content does not exist."
        )
    

    if existing_page_content.PC_Page.PG_Type == E_PageType.ResList:
        if page_content_update.PC_Resource:
            page_content_update.PC_DisplayURL = await delete_and_save_file_azure(
                str(existing_page_content.PC_DisplayURL),
                page_content_update.PC_Resource
            )
            delattr(page_content_update, 'PC_Resource')

    if page_content_update.PC_ThumbImg:
        page_content_update.PC_ThumbImgURL = await delete_and_save_file_azure(
            str(existing_page_content.PC_ThumbImgURL),
            page_content_update.PC_ThumbImg
        )
        delattr(page_content_update, 'PC_ThumbImg')

    updated_page_content = page_content_crud.update_page_content(
        db=db,
        page_content_id=page_content_id,
        page_content_update=page_content_update
    )

    if not updated_page_content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    user = user_crud.get_user_by_id(
        db=db,
        user_id=str(updated_page_content.UI_ID)
    )
    
    page = page_crud.get_page_by_id(db=db, page_id=str(updated_page_content.PG_ID))

  
    
    return build_page_content_json(
        page_content= updated_page_content,
        page=page,
        user=user
    )


async def delete_page_content(db: Session, page_content_id: str) -> bool:
    """
    Delete page content.

    Args
        db (Session): Database Session.
        page_content_id (str): Unique Identifier for page content.
    """
    page_content_to_delete=page_content_crud.get_page_content_by_id(db=db, page_content_id=page_content_id)
    
    if not page_content_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )
    
    success =await  page_content_crud.delete_page_content(db, page_content_to_delete)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )

    return success








    

