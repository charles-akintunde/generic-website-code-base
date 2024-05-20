"""
Team model definition for the User Management Service.
This module defines the Team model and its table configuration.
"""

import uuid
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from .base import Base

class Team(Base):
    """
    Represents a team in the system.

    Attributes:
        team_id (UUID): Primary key for the teams table.
    """
    __tablename__ = "teams"
    team_id = Column(pgUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)

    