import uuid
from sqlalchemy import Column, String, Enum, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from typing import List, Optional
from .enums import E_PageType, E_UserRole
from . import Base 

class T_Page(Base):
    """Page information table."""
    __tablename__ = 'T_Page'
    PG_ID: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    PG_Type: E_PageType = Column(Enum(E_PageType), nullable=False)
    PG_Name: str = Column(String(100), nullable=False)
    PG_Permission: List[E_UserRole] = Column(ARRAY(Enum(E_UserRole)), nullable=False, default=[E_UserRole.SuperAdmin])
    PG_Other: Optional[str] = Column(String(255))

    PG_PageContents = relationship("T_PageContent", back_populates="PC_Page")

    def __repr__(self):
        return f"<T_Page(PG_ID={self.PG_ID}, PG_Name={self.PG_Name})>"
