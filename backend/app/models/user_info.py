import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from typing import Optional, List
from .enums import E_Status, E_UserRole
from . import Base 

class T_UserInfo(Base):
    """User information table."""
    __tablename__ = 'T_UserInfo'
    UI_ID: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    UI_FirstName: str = Column(String(50), nullable=False)
    UI_LastName: str = Column(String(50), nullable=False)
    UI_PasswordHash: str = Column(String(255), nullable=False)
    UI_Role: E_UserRole = Column(Enum(E_UserRole), nullable=False, default=E_UserRole.Public)
    UI_Status: E_Status = Column(Enum(E_Status), nullable=False, default=E_Status.Unauthenticated)
    UI_City: Optional[str] = Column(String(100))
    UI_Province: Optional[str] = Column(String(100))
    UI_Country: Optional[str] = Column(String(100))
    UI_PostalCode: Optional[str] = Column(String(20))
    UI_PhotoURL: Optional[str] = Column(String(255))
    UI_PhoneNumber: Optional[str] = Column(String(20))
    UI_Organization: Optional[str] = Column(String(100))
    UI_RegDate: datetime = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    UI_Other: Optional[str] = Column(String(255))

    UI_PageContents = relationship("T_PageContent", back_populates="PC_UserInfo")

    def __repr__(self):
        return f"<T_UserInfo(UI_ID={self.UI_ID}, UI_FirstName={self.UI_FirstName}, UI_LastName={self.UI_LastName})>"
