import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from typing import Optional

from app.types.page_content import PageContentTypeAnnotations
from . import Base 

class T_PageContent(Base):
    """Page content table."""
    __tablename__ = 'T_PageContent'


    __annotations__ = PageContentTypeAnnotations.__annotations__

    PC_ID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    UI_ID = Column(UUID(as_uuid=True), ForeignKey('T_UserInfo.UI_ID'), nullable=False)
    PG_ID = Column(UUID(as_uuid=True), ForeignKey('T_Page.PG_ID'), nullable=False)
    PC_Title = Column(String(200), nullable=False)
    PC_ThumbImgURL = Column(String(255), nullable=True)
    PC_Content = Column(JSON, nullable=False)
    PC_CreatedAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    PC_LastUpdatedAt = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    PC_DisplayURL = Column(String(255), nullable=True)
    PC_IsHidden = Column(Boolean, default=False)
    PC_Other = Column(String(255), nullable=True)

    PC_UserInfo = relationship("T_UserInfo", back_populates="UI_PageContents")
    PC_Page = relationship("T_Page", back_populates="PG_PageContents")

    def __repr__(self):
        return f"<T_PageContent(PC_ID={self.PC_ID}, PC_Title={self.PC_Title})>"
