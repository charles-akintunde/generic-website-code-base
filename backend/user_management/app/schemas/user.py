"""
Schemas for the User model.
"""

from pydantic import BaseModel, EmailStr
from typing import Any, Optional
import uuid

class UserBase(BaseModel):
    """
    Base schema for user attributes.

    Attributes:
        username (str): Username of the user.
        email (EmailStr): Email of the user.
        first_name (str): First name of the user.
        last_name (str): Last name of the user.
        role (str): Role of the user.
        is_active (bool): Whether the user is active.
        is_blocked (bool): Whether the user is blocked.
        is_confirmed (bool): Whether the user's email is confirmed.
        confirmation_token (str): Token for email confirmation.
    """
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    role: Optional[str] = 'USER'
    is_active: Optional[bool] = True
    is_blocked: Optional[bool] = False
    is_confirmed: Optional[bool] = False
    confirmation_token: Optional[str] = None
    password_hash: Optional[str] = None

class UserCreate(UserBase):
    """
    Schema for creating a new user.

    Attributes:
        password (str): Password for the user.
    """
    password: str

class User(UserBase):
    """
    Schema for representing a user.

    Attributes:
        user_id (UUID): User ID.
    """
    user_id: uuid.UUID
    class Config:
        orm_mode = True

class UserOut(UserBase):
    """
    Schema for outputting user data.

    Attributes:
        user_id (UUID): User ID.
        role (str): Role of the user.
        is_active (bool): Whether the user is active.
        is_blocked (bool): Whether the user is blocked.
    """
    user_id: str
    role: str
    is_active: bool
    is_blocked: bool

    class Config:
        orm_mode = True
        from_attributes = True

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
