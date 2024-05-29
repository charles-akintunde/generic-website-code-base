import uuid
from sqlalchemy import Column, String, Enum, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from typing import List, Optional
from app.types.page import PageTypeAnnotation
from .enums import E_PageType, E_UserRole
from . import Base 

class T_Page(Base):
    """Page information table."""
    __tablename__ = 'T_Page'

    __annotations__ = PageTypeAnnotation.__annotations__

    PG_ID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    PG_Type = Column(Enum(E_PageType), nullable=False)
    PG_Name = Column(String(100), nullable=False)
    PG_Permission  = Column(ARRAY(Enum(E_UserRole)), nullable=False, default=[E_UserRole.SuperAdmin])
    PG_Other  = Column(String(255))

    PG_PageContents = relationship("T_PageContent", back_populates="PC_Page")

    def __repr__(self):
        return f"<T_Page(PG_ID={self.PG_ID}, PG_Name={self.PG_Name})>"
