import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String,DateTime
from sqlalchemy.dialects.postgresql import UUID
from . import Base 



class T_BlackListedToken(Base):
    """Blacklisted token tables."""

    __tablename__ = "T_BlackListedTokens"

    BT_ID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    BT_AccessToken = Column(String(512), nullable=True)
    BT_RefreshToken = Column(String(512), nullable=True)
    BT_AccessTokenExp = Column(DateTime, nullable=True)
    BT_RefreshTokenExp = Column(DateTime, nullable=True)
    BT_TokenBlackListedTime = Column(DateTime, default=datetime.now(timezone.utc), nullable=True)