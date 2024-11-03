""""
    Response Json 
"""


from datetime import datetime
from typing import Any, Dict, List, Optional, Union,Tuple

from uuid import UUID
from app.models.user_info import T_UserInfo
from app.schemas.page_content import PC_PageContentImgResponse, PageContentResponse, PageContentUsers, UserPageContentResponse
from app.models.page_content import T_PageContent
from app.models.page import T_Page
from app.schemas.page import PG_PagesResponse, PageResponse, PageSingleContent, Page
from app.schemas.user_info import UserPartial, UserResponse, UsersResponse
from app.utils.utils import estimate_reading_time, get_excerpt
from app.models.enums import E_PageType


def build_page_content_json(page_content : T_PageContent,user: T_UserInfo,page:T_Page) -> Union[PageContentResponse, Any]:
    """
    Build page content json.
    """
    if page_content is None:
        return None
    return PageContentResponse(
    UI_ID=str(page_content.UI_ID),
    PG_ID=str(page_content.PG_ID),
    PC_ID=str(page_content.PC_ID),
    PC_Title=str(page_content.PC_Title),
    PG_Name=str(page.PG_Name),
    PG_DisplayURL=str(page.PG_DisplayURL),
    UI_FirstName=str(user.UI_FirstName),
    UI_LastName=str(user.UI_LastName),
    PC_ResourceURL=str(page_content.PC_DisplayURL) if page_content.PC_DisplayURL else None, # type: ignore
    PC_ThumbImgURL=str(page_content.PC_ThumbImgURL) if page_content.PC_ThumbImgURL else None, # type: ignore
  #  PC_Excerpt = get_excerpt(page_content.PC_Content["PC_Content"]), # type: ignore
    PC_Content=page_content.PC_Content, # type: ignore
    PC_DisplayURL=str(page_content.PC_DisplayURL),
    PC_CreatedAt=page_content.PC_CreatedAt.isoformat() if page_content.PC_CreatedAt else None,  # type: ignore
    PC_LastUpdatedAt=page_content.PC_LastUpdatedAt.isoformat() if page_content.PC_LastUpdatedAt else None, # type: ignore
    PC_IsHidden=bool(page_content.PC_IsHidden),
    PC_UsersPageContents = [PageContentUsers(
        UI_ID=str(user.UI_ID),
        UI_FullName=f"{user.UI_FirstName} {user.UI_LastName}"

    )  for user in page_content.PC_UsersPageContents]
  
    )


def build_user_page_content_json(page_content: T_PageContent) -> UserPageContentResponse:
    if page_content is None:
        return None
    
    PC_Excerpt = PC_Excerpt = get_excerpt(page_content.PC_Content["PC_Content"]) if page_content.PC_Content and "PC_Content" in page_content.PC_Content else '' # type: ignore
    PC_ReadingTime =  PC_ReadingTime = estimate_reading_time(page_content.PC_Content["PC_Content"]) if page_content.PC_Content and "PC_Content" in page_content.PC_Content else 0  # type: ignore

    return UserPageContentResponse(
        PC_ID=str(page_content.PC_ID),
        PC_Title=str(page_content.PC_Title),
        PC_DisplayURL=str(page_content.PC_DisplayURL),
        PC_ThumbImgURL=str(page_content.PC_ThumbImgURL) if page_content.PC_ThumbImgURL else None, # type: ignore
        PC_Excerpt=PC_Excerpt,
        PC_ReadingTime=PC_ReadingTime,
        PC_CreatedAt=page_content.PC_CreatedAt.isoformat() if page_content.PC_CreatedAt else None, # type: ignore
        PC_LastUpdatedAt=page_content.PC_LastUpdatedAt.isoformat() if page_content.PC_LastUpdatedAt else None, # type: ignore
        PC_IsHidden=bool(page_content.PC_IsHidden)
    )




def build_page_content_json_with_excerpt(page_content: T_PageContent, user: T_UserInfo, page: T_Page) -> Union[PageContentResponse, Any]:
    """
    Build page content json.
    """
    if page_content is None:
        return None
    
    PC_Excerpt = ''
    PC_ReadingTime = 0

    if str(page.PG_Type) == str(E_PageType.PageList):
        PC_Excerpt = get_excerpt(page_content.PC_Content["PC_Content"]) if page_content.PC_Content and "PC_Content" in page_content.PC_Content else '' # type: ignore
        PC_ReadingTime = estimate_reading_time(page_content.PC_Content["PC_Content"]) if page_content.PC_Content and "PC_Content" in page_content.PC_Content else 0  # type: ignore
    return PageContentResponse(
        UI_ID=str(page_content.UI_ID),
        PG_ID=str(page_content.PG_ID),
        PC_ID=str(page_content.PC_ID),
        PC_Title=str(page_content.PC_Title),
        PG_Name=str(page.PG_Name),
        PG_DisplayURL=str(page.PG_DisplayURL),
        UI_FirstName=str(user.UI_FirstName),
        UI_LastName=str(user.UI_LastName),
        PC_ResourceURL=str(page_content.PC_DisplayURL) if page_content.PC_DisplayURL else None,  # type: ignore
        PC_ThumbImgURL=str(page_content.PC_ThumbImgURL) if page_content.PC_ThumbImgURL else None,  # type: ignore
        PC_Excerpt=PC_Excerpt,
        PC_ReadingTime=PC_ReadingTime,
        PC_Content=page_content.PC_Content,  # type: ignore
        PC_DisplayURL=str(page_content.PC_DisplayURL),
        PC_CreatedAt=page_content.PC_CreatedAt.isoformat() if page_content.PC_CreatedAt else None,  # type: ignore
        PC_LastUpdatedAt=page_content.PC_LastUpdatedAt.isoformat() if page_content.PC_LastUpdatedAt else None,  # type: ignore
        PC_IsHidden=bool(page_content.PC_IsHidden)
    )



def build_page_json_with_single_content(
        page : T_Page,
        page_content: PageContentResponse) -> PageSingleContent:
    """
    Build page with single content.

    Args
        page (T_Page)
        page_content: (PageContentResponse)

    Returns
        page (PageSingleContent)
    """
    return PageSingleContent(
        PG_ID=str(page.PG_ID),
        PG_Type=page.PG_Type.value,
        PG_Name=str(page.PG_Name),
        PG_DisplayURL=str(page.PG_DisplayURL),
        PG_Permission=[role.value for role in page.PG_Permission],
        PG_PageContent=page_content
    )

def build_multiple_page_response(page: T_Page) -> PageResponse:
    """
    Build page with response.

    Args
        page (T_Page)

    Returns
        page (PageResponse)
    """
    return PageResponse(
        PG_ID=str(page.PG_ID),
        PG_Type=page.PG_Type.value,  # Assuming you want the enum's value as a string
        PG_Name=str(page.PG_Name),
        PG_DisplayURL=str(page.PG_DisplayURL),
        PG_Permission=[perm.value for perm in page.PG_Permission]  # Convert enum list to string list
    )

def create_users_response(users: List[UserPartial], total_users_count: int ,new_last_key: Optional[Tuple[str, str, str]]) -> UsersResponse:
    return UsersResponse(
        users=users,
        last_first_name=new_last_key[0] if new_last_key else None, # type: ignore
        last_last_name=new_last_key[1] if new_last_key else None, # type: ignore
        last_uuid=new_last_key[2] if new_last_key else None, # type: ignore
        total_users_count= total_users_count
    )

def create_user_response(user: T_UserInfo, page_contents : Optional[List[PageContentResponse]] = None) -> UserResponse:
    return UserResponse(
        UI_ID=str(user.UI_ID),
        UI_FirstName=str(user.UI_FirstName),
        UI_LastName=str(user.UI_LastName),
        UI_Email=str(user.UI_Email),
        UI_Role=[role.value for role in user.UI_Role],
        UI_Status=user.UI_Status.value,
        UI_RegDate=str(user.UI_RegDate),
        UI_PhotoURL=user.UI_PhotoURL if user.UI_PhotoURL is not None else None, # type: ignore
        UI_City=user.UI_City if user.UI_City is not None else None, # type: ignore
        UI_PhoneNumber=user.UI_PhoneNumber if user.UI_PhoneNumber is not None else None, # type: ignore
        UI_PostalCode=user.UI_PostalCode if user.UI_PostalCode is not None else None, # type: ignore
        UI_Country=user.UI_Country if user.UI_Country is not None else None, # type: ignore
        UI_Province=user.UI_Province if user.UI_Province is not None else None, # type: ignore
        UI_Organization=user.UI_Organization if user.UI_Organization is not None else None, # type: ignore
        UI_About=user.UI_About if user.UI_About is not None else None, # type: ignore
        UI_MemberPosition=user.UI_MemberPosition.value if user.UI_MemberPosition is not None else None,
        UI_UserPageContents=page_contents if page_contents is not None else None
    )



def create_page_with_offset_response(pages: List[PageResponse], total_page_count: int) -> PG_PagesResponse:
    return PG_PagesResponse(
        PG_Pages=pages,
        PG_PageCount=total_page_count
    )

def create_page_content_img_response(pc_img_url: str)  -> PC_PageContentImgResponse:
    return PC_PageContentImgResponse(
        PC_PageContentURL=pc_img_url
    )



def transform_page_to_response(page: T_Page) -> PageResponse:
    """
    Helper function to transform a T_Page object into a PageResponse schema.
    
    Args:
        page (T_Page): The T_Page object to transform.
    
    Returns:
        PageResponse: The transformed data in the response format.
    """
    return PageResponse(
        PG_ID=str(page.PG_ID),
        PG_Type=page.PG_Type.value, 
        PG_Name=str(page.PG_Name),
        PG_DisplayURL=str(page.PG_DisplayURL),
        PG_Permission=[perm.value for perm in page.PG_Permission]  
    )
