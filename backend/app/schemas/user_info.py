"""
Schemas for the User model.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Any, Optional
import uuid
from app.models.enums import E_Status, E_UserRole

class UserBase(BaseModel):
    """
    Base schema for user attributes.
    """
       
    UI_FirstName: str 
    UI_LastName: str 
    UI_Email: Optional[EmailStr] = None
    UI_Role: Optional[E_UserRole] = None 
    UI_Status: Optional[E_Status] = None
    UI_City: Optional[str] = None
    UI_Province: Optional[str] = None 
    UI_Country: Optional[str] = None
    UI_PostalCode: Optional[str] = None
    UI_PhotoURL: Optional[str] = None
    UI_PhoneNumber: Optional[str] = None
    UI_Organization: Optional[str] = None
    UI_RegDate: Optional[datetime] = None 
    UI_Other: Optional[str] = None
    UI_ConfirmationTokenHash: Optional[str] = None

class UserLogin(BaseModel):
    UI_Email: EmailStr
    UI_Password: str

class Token(BaseModel):
    access_token: str
    refresh_token : str
    #token_type: str

class E_StatusSchema:
    """
    Enumeration for user status.
    """

    Active = 0
    Unauthenticated = 1
    Disabled = 2

class UserCreate(BaseModel):
    """
    Schema for creating a new user.

    Attributes:
        password (str): Password for the user.
    """
    UI_FirstName: str 
    UI_LastName: str 
    UI_Email: EmailStr
    UI_Password: str 
    UI_ConfirmationTokenHash: Optional[str] = None
   
class User(UserBase):
    """
    Schema for representing a user.

    Attributes:
        UI_ID (UUID): User ID.
    """
    UI_ID: uuid.UUID
    class Config:
        orm_mode = True

class UserOut(UserBase):
    """
    Schema for outputting user data.

    Attributes:
        user_id (UUID): User ID.
    """
    UI_ID: str

    class Config:
        from_attributes = True
        orm_mode = True  # Enable ORM mode

    @classmethod
    def from_orm(cls, obj: Any) -> 'UserOut':
        return cls.model_validate(obj)

    @classmethod
    def model_validate(cls, obj: Any) -> 'UserOut':
        """
        Validate and create a UserOut instance from an ORM object.

        Args:
            obj (Any): ORM object.

        Returns:
            UserOut: Validated UserOut instance.
        """
        return cls(**obj.__dict__)
