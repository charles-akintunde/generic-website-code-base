"""
    Type annotation for user info. 
"""

from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import EmailStr
from app.models.enums import E_Status, E_UserRole



class UserInfoTypeAnnotations:
    UI_ID: UUID
    UI_FirstName: str
    UI_LastName: str
    UI_Email: EmailStr
    UI_PasswordHash: str
    UI_Role: E_UserRole
    UI_Status: E_Status
    UI_City: Optional[str]
    UI_Province: Optional[str]
    UI_Country: Optional[str]
    UI_PostalCode: Optional[str]
    UI_PhotoURL: Optional[str]
    UI_PhoneNumber: Optional[str]
    UI_Organization: Optional[str]
    UI_RegDate: datetime
    UI_ConfirmationTokenHash: Optional[str]
    UI_Other: Optional[str]
