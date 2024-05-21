"""
User model definition for the User Management Service.
This module defines the User model and its table configuration.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID as pgUUID
import uuid
from app.enums import UserRole
from .base import Base


class User(Base):
    """
    User model for the User Management Service.

    Attributes:
        id (UUID): Unique identifier for each user.
        username (str): Unique username for the user.
        email (str): Unique email address for the user.
        password_hash (str): Hashed password for the user.
        first_name (str): First name of the user.
        last_name (str): Last name of the user.
        role (UserRole): Role of the user in the system.
        is_active (bool): Indicates if the user account is active.
        is_blocked (bool): Indicates if the user account is blocked.
        created_at (datetime): Timestamp when the user account was created.
        updated_at (datetime): Timestamp when the user account was last updated.
    """

    __tablename__ = "users"

    user_id = Column(
        pgUUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
    )
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(
        Enum(UserRole), default=UserRole.USER, nullable=False
    )  # Using the enum
    is_active = Column(Boolean, default=True)
    is_blocked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    confirmation_token = Column(String, nullable= True)

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}', role='{self.role.value}')>"
