"""
Schemas for the User model.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Any, Optional
import uuid
from app.models.enums import E_Status, E_UserRole

class StandardResponse(BaseModel):
    content: str
    status_code: str


