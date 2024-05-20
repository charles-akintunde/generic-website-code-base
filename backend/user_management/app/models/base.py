"""
Base model definition for the User Management Service.
This module defines common configurations for models.
"""

import uuid
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as pgUUID

@as_declarative()
class Base:
    """
    Base class for all models.

    Attributes:
        id (Column): Primary key for all tables, using UUIDs.
    """
    id = Column(pgUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    
    @declared_attr
    def __tablename__(self,cls):
        """
        Generates __tablename__ automatically based on the class name.
        Converts the class name to lowercase.
        """
        return cls.__name__.lower()


