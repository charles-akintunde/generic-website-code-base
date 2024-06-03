""""
    Schema to handle page management
"""

from datetime import datetime
from typing import Any, Dict, List
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional

from sqlalchemy import JSON, Boolean


class PageContent(BaseModel):
    UI_ID: str
    PG_ID: str
    PC_Title: str
    PC_Content: Dict
    PC_ThumbImgURL: Optional[HttpUrl] = None
    PC_DisplayURL: HttpUrl
    PC_IsHidden: bool
    PC_CreatedAt: Optional[str] = None
    PC_LastUpdatedAt: Optional[str] = None
    PC_IsHidden: bool

class PageContentCreateRequest(PageContent):
    pass

class PageContentResponse(PageContent):
    PC_ID: str
    UI_FirstName: str
    UI_LastName: str
    PC_ThumbImgURL: Optional[str] = None
    PC_DisplayURL: str

class PageContentUpdateRequest(BaseModel):
    PC_Title: Optional[str]
    PC_ThumbImgURL: Optional[HttpUrl]
    PC_Content: Optional[Dict]
    PC_DisplayURL: Optional[HttpUrl]
    PC_IsHidden: Optional[bool]