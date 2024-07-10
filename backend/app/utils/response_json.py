""""
    Response Json 
"""


from datetime import datetime
from typing import Any, Dict, Union
from app.models.user_info import T_UserInfo
from app.schemas.page_content import PageContentResponse
from app.models.page_content import T_PageContent
from app.models.page import T_Page
from app.schemas.page import PageResponse, PageSingleContent


def build_page_content_json(page_content : T_PageContent,user: T_UserInfo,page_name:str=None) -> Union[PageContentResponse, Any]:
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