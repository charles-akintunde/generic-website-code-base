""""
    Schema to handle page management
"""

from typing import Any, List
from pydantic import BaseModel, Field
from typing import Optional
from app.models.page import E_PageType, E_UserRole
from app.schemas.page_content import PageContentResponse


class Page(BaseModel):
    PG_Type: E_PageType
    PG_Name: str 
    PG_Permission: List[E_UserRole]
    

class PageCreate(Page):
    pass

class GetPageRequest(BaseModel):
    PG_Name: str 

class PageResponse(BaseModel):
    PG_ID: str
    PG_Type: int
    PG_Name: str 
    PG_Permission: List[int]

class PageMultipleContent(PageResponse):
    PG_PageContents: Optional[Any]   

class PageSingleContent(PageResponse):
    PG_PageContent: PageContentResponse

class PageUpdateRequest(BaseModel):
    PG_Type: Optional[E_PageType] = None
    PG_Name: Optional[str] = None
    PG_Permission: Optional[List[E_UserRole]] = None


