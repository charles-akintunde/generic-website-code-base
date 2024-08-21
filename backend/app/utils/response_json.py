""""
    Response Json 
"""


from datetime import datetime
from typing import Any, Dict, List, Optional, Union,Tuple

from uuid import UUID
from app.models.user_info import T_UserInfo
from app.schemas.page_content import PC_PageContentImgResponse, PageContentResponse
from app.models.page_content import T_PageContent
from app.models.page import T_Page
from app.schemas.page import PG_PagesResponse, PageResponse, PageSingleContent, Page
from app.schemas.user_info import UserPartial, UserResponse, UsersResponse


def build_page_content_json(page_content : T_PageContent,user: T_UserInfo,page_name:Optional[str]=None) -> Union[PageContentResponse, Any]:
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
    PG_Name=page_name,
    UI_FirstName=str(user.UI_FirstName),
    UI_LastName=str(user.UI_LastName),
    PC_ResourceURL=str(page_content.PC_DisplayURL) if page_content.PC_DisplayURL else None, # type: ignore
    PC_ThumbImgURL=str(page_content.PC_ThumbImgURL) if page_content.PC_ThumbImgURL else None, # type: ignore
    PC_Content=page_content.PC_Content, # type: ignore
    PC_DisplayURL=str(page_content.PC_DisplayURL),
    PC_CreatedAt=page_content.PC_CreatedAt.isoformat() if page_content.PC_CreatedAt else None,  # type: ignore
    PC_LastUpdatedAt=page_content.PC_LastUpdatedAt.isoformat() if page_content.PC_LastUpdatedAt else None, # type: ignore
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

def create_user_response(user: T_UserInfo)  -> UserResponse:
    return UserResponse(
    UI_ID=str(user.UI_ID),
    UI_FirstName=str(user.UI_FirstName),
    UI_LastName=str(user.UI_LastName),
    UI_Email=str(user.UI_Email),
    UI_Role=user.UI_Role.value,
    UI_Status=user.UI_Status.value,
    UI_RegDate=str(user.UI_RegDate),
    UI_PhotoURL=user.UI_PhotoURL, # type: ignore
    UI_City=user.UI_City, # type: ignore
    UI_PhoneNumber=user.UI_PhoneNumber, # type: ignore
    UI_PostalCode=user.UI_PostalCode, # type: ignore
    UI_Country=user.UI_Country, # type: ignore
    UI_Province=user.UI_Province, # type: ignore
    UI_Organization=user.UI_Organization, # type: ignore
    UI_About= user.UI_About, # type: ignore
    UI_MemberPosition= user.UI_MemberPosition.value
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