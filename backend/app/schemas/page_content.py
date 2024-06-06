""""
    Schema to handle page management
"""

from datetime import datetime
from typing import Any, Dict, List
from fastapi import File, UploadFile
from pydantic import BaseModel, Field, HttpUrl
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
    PC_IsHidden: bool

class PageContentCreateRequest(PageContent):
    PC_Resource: Optional[UploadFile] = None
    PC_ThumbImg: Optional[UploadFile] = None
    pass

class PageContentResponse(PageContent):
    PC_ID: str
    UI_FirstName: str
    UI_LastName: str
    PC_ThumbImgURL: Optional[str] = None
    # PC_DisplayURL: str

class PageContentUpdateRequest(BaseModel):
    PC_Title: Optional[str] = None
    PC_ThumbImgURL: Optional[str] = None
    PC_ThumbImg: Optional[UploadFile] = None
    PC_Resource: Optional[UploadFile] = None
    PC_Content: Optional[Dict] = None
    PC_DisplayURL: Optional[str] = None
    PC_IsHidden: Optional[bool] = None