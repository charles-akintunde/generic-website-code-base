"""
Application model definition for the User Management Service.
This module defines the Application model and its table configuration.
"""

import uuid
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from .base import Base

class Application(Base):
    """
    Represents an application in the system.

    Attributes:
        application_id (UUID): Primary key for the applications table.
    """
    __tablename__ = "applications"
    application_id = Column(pgUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)

