"""
    Busines logic to handle page creation.
"""


from typing import Any, List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.page import GetPageRequest, PageCreate, PageMultipleContent, PageResponse, PageUpdateRequest, PagesResponse
from app.crud.page import page_crud
from app.crud.user_info import user_crud
from app.models.enums import E_UserRole
from app.models.page import T_Page
from app.core.auth import get_current_user_without_exception
from app.utils.utils import check_page_permission, is_admin
from app.models.user_info import T_UserInfo
from app.utils.response_json import build_page_content_json, build_multiple_page_response, create_page_with_offset_response

async def create_new_page(db: Session, page: PageCreate, current_user: T_UserInfo):
    """
    Service to create new page.
    """

    existing_page = page_crud.get_page_by_name(db=db, page_name=page.PG_Name)

    if existing_page:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f'A Page with page name ({page.PG_Name}) already exists!'
        )
    page.PG_Permission.append(E_UserRole.SuperAdmin)
    permissions = set(page.PG_Permission)
    page.PG_Permission = list(permissions)
    new_page =await page_crud.create_page(db, page,current_user)
    if not new_page:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Page not created successfully"
        )

    return new_page


def get_pages_with_offset(db: Session, pg_page_number: int = 0, pg_page_limit: int = 5):
    total_page_count = page_crud.get_total_pages_count(db=db)
    total_pages = (total_page_count + pg_page_limit - 1) // pg_page_limit


    if total_page_count == 0:
        return create_page_with_offset_response(pages=[], total_page_count=0)
    
    total_pages = (total_page_count + pg_page_limit - 1)
    
    if pg_page_number > total_pages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid page number: {pg_page_number}. There are only {total_pages} pages available."
        )
    
    if pg_page_number == 0:
        pg_page_number = 1
    
    pages = page_crud.get_pages_with_offset(db, pg_page_number, pg_page_limit)
    pages_response = create_page_with_offset_response(pages=pages,total_page_count=total_page_count )
    return pages_response

def get_pages(db: Session) -> PagesResponse:
    """
    Service to create new page.

    db (Session): Database Session.
    """

    try:
        pages : List[T_Page] = page_crud.get_pages(db=db);
        pages_response = []
        for page in pages:
            pages_response.append(build_multiple_page_response(page))
        
        return PagesResponse(
            Pages=pages_response
        )
        
    except HTTPException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={e.detail}
        )

def get_page(
        db: Session,
        page_display_url: str,
        current_user: T_UserInfo,
        pg_page_number: Optional[int] = 1):
    """
    Service to fetch page with fixed pagination for infinite scroll (10 items at a time).

    Args:
        db (Session): Database session.
        page_display_url (str): Page Display URL.
        current_user (T_UserInfo): Current user info.
        pg_page_number (Optional[int]): Page number for pagination (infinite scroll).

    Returns:
        PageResponse: Page data with paginated content.
    """
    user_roles = (current_user.UI_Role if current_user else [E_UserRole.Public])

    existing_page = page_crud.get_page_by_display_url_with_offest(
        db=db,
        pg_display_url=page_display_url,
        pg_page_number=pg_page_number)
    
    if not existing_page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Page with Display URL '{page_display_url}' was not found."
        )

    page_is_accessible_to: List[E_UserRole] = existing_page.PG_Permission  # type: ignore

    check_page_permission(
        page_accessible_to=page_is_accessible_to, 
        user_roles=user_roles) # type: ignore
    
    converted_page_contents = []

    for page_content in existing_page.PG_PageContents:
        user  = user_crud.get_user_by_id(db=db,user_id=page_content.UI_ID)
        converted_page_content = build_page_content_json(page_content, user, page=existing_page)
        converted_page_contents.append(converted_page_content)
        
    existing_page = PageMultipleContent(
            PG_ID=str(existing_page.PG_ID),
            PG_Type=existing_page.PG_Type.value,  # Convert enum to its value
            PG_Name=str(existing_page.PG_Name),
            PG_DisplayURL=str(existing_page.PG_DisplayURL),
            PG_Permission=[role.value for role in existing_page.PG_Permission],   # Assuming this is already a list of E_UserRole # type: ignore
            PG_PageContents=converted_page_contents if converted_page_contents else []
        )
    return existing_page

def update_page(db: Session, page_id: str, page_update: PageUpdateRequest, user: T_UserInfo) -> PageResponse:
    """
    Service to update page.
    """
    print(page_update,"page_update")
    existing_page = page_crud.get_page_by_id(db, page_id)

    if not existing_page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    
    is_admin(
        current_user=user, 
        detail="You do not have permission to update this page")
    
    if page_update.PG_Type is not None and  page_update.PG_Type != existing_page.PG_Type:
            page_crud.remove_page_content(db=db, page=existing_page)
     
    page_data = page_update.model_dump(exclude_unset=True)
    updated_page: dict[str, Any] = page_crud.update_page(
        db, 
        page_id=page_id, 
        page_data=page_data)
    
    page_response = PageMultipleContent(
            PG_ID=str(updated_page.PG_ID),
            PG_Type=updated_page.PG_Type.value,  
            PG_Name=str(updated_page.PG_Name),
            PG_DisplayURL=str(updated_page.PG_DisplayURL),
            PG_Permission=[role.value for role in updated_page.PG_Permission],  # Convert each enum to its value
            PG_PageContents=updated_page.PG_PageContents if updated_page.PG_PageContents else None
        )
    return page_response
    
def delete_page(db: Session, page_id: str, user: T_UserInfo) -> bool:
    """
     Service to delete page.
    """

    existing_page = page_crud.get_page_by_id(db, page_id)

    if not existing_page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    
    is_admin(
        current_user=user,
        detail="You do not have permission to delete this page"
        )
    print(existing_page,"existing_page")
    is_success = page_crud.delete_page(
        db, 
        page=existing_page)
    
    if not is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete the page"
        )
    
    return is_success


