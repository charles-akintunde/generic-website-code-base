import uuid
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.models.enums import E_PageType, E_Status, E_UserRole


class PageTypeAnnotation:
    PG_ID: uuid.UUID
    PG_Type: E_PageType
    PG_Name: str 
    PG_Permission: List[E_UserRole] 
    PG_Other: Optional[str] 
