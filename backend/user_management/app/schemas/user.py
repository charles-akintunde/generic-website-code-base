"""
Schemas for the User model.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
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
    role: Optional[str] = 'user'
    is_active: Optional[bool] = True
    is_blocked: Optional[bool] = True
    is_confirmed: Optional[bool] = False
    confirmation_token: Optional[str] = None

class User(UserBase):
    """
    Scheme for representing a user.

    Attributes:
        user_id (UUID): User ID.
    """
    user_id: uuid.UUID

    class Config:
        orm_mode = True