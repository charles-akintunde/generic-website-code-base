"""
    Business logic to handle page content creation.
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.crud.user_info import user_crud
from app.crud.page import page_crud
from app.crud.page_content import page_content_crud
from app.schemas.page_content import PageContentCreateRequest, PageContentResponse, PageContentUpdateRequest
from app.utils.utils import is_admin
from app.models.user_info import T_UserInfo
from app.utils.response_json import build_page_content_json, build_page_json_with_single_content
from app.schemas.page import PageResponse, PageSingleContent
from app.models.page_content import T_PageContent
from app.utils.file_utils import delete_and_save_file, delete_file, extract_path_from_url, save_file
from app.config import settings
from app.models.enums import E_PageType

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


    existing_page_content = page_content_crud.get_page_content(
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
            thumbnail_url=await save_file(page_content.PC_ThumbImg, settings.THUMBNAILS_FILE_PATH)
            page_content.PC_ThumbImgURL = str(thumbnail_url) 
    delattr(page_content, "PC_ThumbImg")

    if page_content.PC_Resource:
            resource_url=await save_file(page_content.PC_Resource, settings.RESOURCE_FILE_PATH)
            page_content.PC_DisplayURL = str(resource_url) 
    delattr(page_content, "PC_Resource")

    new_page_content = page_content_crud.create_page_content(
        db=db,
        page_content= page_content)
    
    if page_content is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating page content"
        )
    
    return build_page_content_json(
        page_content=new_page_content,
        user=user
    )

def get_page_content_by_title(
        db: Session,
        page_content_title: str,
        page_name: str) -> PageSingleContent:
    """
    Handles retrieving page content.

    Args:
        db (Session): Database session.
        page_content_title (str): Page content title.
        page_id (str): Page ID.

    Returns:
        PageSingleContent: Page content response.
    """
    page = page_crud.get_page_by_name(db=db, page_name=page_name)
    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Page with ({page_name}) name not found"
        )

    page_content = page_content_crud.get_page_content_by_title(
        db=db,
        page_content_title=page_content_title,
        page_id=str(page.PG_ID)
    )
    if page_content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"This page does not have content with title '{page_content_title}'."
        )

    page_content_creator = user_crud.get_user_by_id(
        db=db,
        user_id=str(page_content.UI_ID)
    )

    page_content_json = build_page_content_json(
        page_content=page_content,
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
            page_content_update.PC_DisplayURL = await delete_and_save_file(
                str(existing_page_content.PC_DisplayURL),
                page_content_update.PC_Resource,
                folder=settings.RESOURCE_FILE_PATH
            )
            delattr(page_content_update, 'PC_Resource')

    if page_content_update.PC_ThumbImg:
        page_content_update.PC_ThumbImgURL = await delete_and_save_file(
            str(existing_page_content.PC_ThumbImgURL),
            page_content_update.PC_ThumbImg,
            folder=settings.THUMBNAILS_FILE_PATH
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
    
    page_content_json = build_page_content_json(
        page_content=updated_page_content,
        user=user
    )

    return page_content_json

def delete_page_content(db: Session, page_content_id: str) -> bool:
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
    
    success = page_content_crud.delete_page_content(db, page_content_to_delete)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page content not found"
        )

    return success








    

