from typing import Optional, Dict
from uuid import UUID
from datetime import datetime

class PageContentTypeAnnotations:
    PC_ID: UUID
    UI_ID: UUID
    PG_ID: UUID
    PC_Title: str
    PC_ThumbImgURL: Optional[str]
    PC_Content: Optional[Dict]
    PC_CreatedAt: datetime
    PC_LastUpdatedAt: datetime
    PC_DisplayURL: Optional[str]
    PC_IsHidden: bool
    PC_Other: Optional[str]