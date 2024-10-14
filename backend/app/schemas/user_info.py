"""
Schemas for the User model.
"""

from datetime import datetime
from fastapi import File, UploadFile
from pydantic import BaseModel, EmailStr
from typing import Any, Dict, List, Optional
import uuid

from sqlalchemy import UUID
from app.models.enums import E_MemberPosition, E_Status, E_UserRole

class UserBase(BaseModel):
    """
    Base schema for user attributes.
    """
       
    UI_FirstName: Optional[str] = None 
    UI_LastName: Optional[str] = None 
    UI_City: Optional[str] = None
    UI_Province: Optional[str] = None 
    UI_Country: Optional[str] = None
    UI_PostalCode: Optional[str] = None
    UI_PhotoURL: Optional[str] = None
    UI_PhoneNumber: Optional[str] = None
    UI_Organization: Optional[str] = None

class UserPartial(BaseModel):
    UI_ID: str
    UI_FirstName: str
    UI_LastName: str
    UI_Email: str
    UI_Role: List[str]
    UI_Status: str
    UI_RegDate: str
    UI_PhotoURL: Optional[str] = None
    UI_MemberPosition: Optional[str] = None
    UI_Country: Optional[str] = None
    

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True

class UsersResponse(BaseModel):
    users: List[UserPartial]
    total_users_count : Optional[int] = None
    last_first_name: Optional[str] = None
    last_last_name: Optional[str] = None
    last_uuid: Optional[str] = None

class UserResponse(UserBase):
    UI_ID: str
    UI_Email: str
    UI_Role: List[int]
    UI_Status: int
    UI_RegDate: str
    UI_About: Optional[Dict] = None
    UI_MemberPosition: Optional[int] = None


class UserDelete(BaseModel):
    UI_ID: str


class UserProfileUpdate(UserBase):
    UI_ID: Optional[str] = None
    UI_Photo: Optional[UploadFile] = File(None)
    UI_About: Optional[Dict]  = None



class UserRoleStatusUpdate(BaseModel):
    UI_ID: str
    UI_Role: Optional[List[E_UserRole]] = None
    UI_Status: Optional[E_Status] = None
    UI_MemberPosition: Optional[E_MemberPosition] = None

class UserStatusUpdate(BaseModel):
    UI_ID: str
    UI_Status: E_Status

class UserLogin(BaseModel):
    UI_Email: EmailStr
    UI_Password: str

class Token(BaseModel):
    access_token: str
    refresh_token : str
    #token_type: str

class UIToken(BaseModel):
    access_token: Optional[str] = None
    refresh_token : Optional[str] = None

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
    UI_Email: Optional[EmailStr] = None
    class Config:
        form_attributes = True

class UserOut(UserBase):
    """
    Schema for outputting user data.

    Attributes:
        user_id (UUID): User ID.
    """
    UI_ID: str
    UI_Email: Optional[EmailStr] = None

    class Config:
        from_attributes = True
        form_attributes = True  # Enable ORM mode

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

class PasswordResetRequest(BaseModel):
    UI_Email: EmailStr

class BaseToken(BaseModel):
    token: str

class PasswordResetConfirm(BaseModel):
    UI_NewPassword: str
    UI_Token: str

class LogoutRequest(BaseModel):
    refresh_token: str

# class UICurrentUser(BaseModel):
#     UI_FirstName: str 
#     UI_LastName: str 
#     UI_Email: str
#     UI_Role: int
#     UI_Status: int
#     UI_Photo: Optional[str] = None