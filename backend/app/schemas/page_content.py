""""
    Schema to handle page management
"""

from datetime import datetime
from typing import Dict
from fastapi import File, UploadFile
from pydantic import BaseModel
from typing import Optional

from sqlalchemy import JSON, Boolean


class PageContent(BaseModel):
    UI_ID: str
    PG_ID: str
    PC_Title: str
    PC_Content: Optional[Dict]
    PC_DisplayURL: Optional[str] = None
    PC_ThumbImgURL: Optional[str] = None
    PC_IsHidden: bool
    PC_CreatedAt: Optional[str] = None
    PC_LastUpdatedAt: Optional[str] = None


class GetPageContentWithDisplayURL(BaseModel):
    PG_DisplayURL: str
    PC_DisplayURL: str


class PageContentCreateRequest(PageContent):
    PC_Resource: Optional[UploadFile] = None
    PC_ThumbImg: Optional[UploadFile] = None
    pass

class PageContentResponse(PageContent):
    PC_ID: str
    UI_FirstName: str
    UI_LastName: str
    PC_ThumbImgURL: Optional[str] = None
    PC_ResourceURL: Optional[str] = None
    PG_Name: Optional[str] = None
    PG_DisplayURL: Optional[str] = None
    PC_Excerpt:  Optional[str] = None
    PC_ReadingTime: Optional[int] = None
    # PC_DisplayURL: str

class PageContentUpdateRequest(BaseModel):
    PC_Title: Optional[str] = None
    PC_ThumbImgURL: Optional[str] = None
    PC_ThumbImg: Optional[UploadFile] = None
    PC_Resource: Optional[UploadFile] = None
    PC_Content: Optional[Dict] = None
    PC_DisplayURL: Optional[str] = None
    PC_IsHidden: Optional[bool] = None

class PC_PageContentImgResponse(BaseModel):
    PC_PageContentURL: str