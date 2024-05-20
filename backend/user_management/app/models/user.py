"""
User model definition for the User Management Service.
This module defines the User model and its table configuration.
"""

import uuid
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from .base import Base

class User(Base):
    """
    Represents a user in the system.

    Attributes:
        user_id (UUID): Primary key for the users table.
    """
    __tablename__ = "users"
    user_id = Column(pgUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)


  

