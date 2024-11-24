import uuid
from datetime import datetime, timezone
from sqlalchemy import ARRAY, JSON, Column, String, Enum, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pydantic import EmailStr 
from sqlalchemy.ext.declarative import declarative_base
from typing import Optional, List
from app.types.user_info import UserInfoTypeAnnotations
from .enums import E_MemberPosition, E_Status, E_UserRole
from . import Base 
from .associations import T_UsersPageContents

class T_UserInfo(Base):
    """User information table."""
    __tablename__ = 'T_UserInfo'

    __annotations__ = UserInfoTypeAnnotations.__annotations__
   
    UI_ID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    UI_FirstName = Column(String(50), nullable=False)
    UI_LastName = Column(String(50), nullable=False)
    UI_Email = Column(String(100), nullable=False, unique=True)
    UI_PasswordHash = Column(String(255), nullable=False)
    UI_Role = Column(ARRAY(Enum(E_UserRole)), nullable=False, default=[E_UserRole.Public])
    UI_Status = Column(Enum(E_Status), nullable=False, default=E_Status.Unauthenticated)
    UI_City = Column(String(100))
    UI_Province = Column(String(100))
    UI_Country = Column(String(100))
    UI_PostalCode = Column(String(20))
    UI_PhotoURL = Column(String(255))
    UI_PhoneNumber = Column(String(20)) 
    UI_Organization = Column(String(100))
    UI_RegDate = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    UI_Other = Column(String(255))
    UI_About = Column(JSON, nullable=True)
    UI_MemberPosition = Column(Enum(E_MemberPosition), nullable=True)

    UI_UsersPageContents = relationship("T_PageContent", secondary=T_UsersPageContents,back_populates="PC_UsersPageContents")
    UI_PageContents = relationship("T_PageContent", back_populates="PC_UserInfo")

    def __repr__(self):
        return f"<T_UserInfo(UI_ID={self.UI_ID}, UI_FirstName={self.UI_FirstName}, UI_LastName={self.UI_LastName})>"
