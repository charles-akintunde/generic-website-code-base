""""
    Schema to handle page management
"""

from typing import Any, List
from pydantic import BaseModel
from typing import Optional
from app.models.page import E_PageType, E_UserRole
from app.schemas.page_content import PageContentResponse


class Page(BaseModel):
    PG_ID: Optional[str] = None
    PG_Type: E_PageType
    PG_Name: str 
    PG_Permission: List[E_UserRole]
    PG_DisplayURL: Optional[str] = None


class PageResponse(BaseModel):
    PG_ID: str
    PG_Type: int
    PG_Name: str 
    PG_Permission: List[int]
    PG_DisplayURL: str

class PG_PagesResponse(BaseModel):
    PG_Pages: List[PageResponse]
    PG_PageCount: int
    
class PageCreate(Page):
    pass

class GetPageRequest(BaseModel):
    PG_Name: str 



class PageMultipleContent(PageResponse):
    PG_PageContents: Optional[Any] = None
    PG_TotalPageContents: Optional[int] = None

class PageSingleContent(PageResponse):
    PG_PageContent: PageContentResponse

class PageUpdateRequest(BaseModel):
    PG_Type: Optional[E_PageType] = None
    PG_Name: Optional[str] = None
    PG_Permission: Optional[List[E_UserRole]] = None
    PG_DisplayURL: Optional[str] = None

class PagesResponse(BaseModel):
    Pages: List[PageResponse]


