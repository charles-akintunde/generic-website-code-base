"""
    Schema for blacklisted tokens.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class BlackListedToken(BaseModel):
    BT_AccessToken: Optional[str]
    BT_RefreshToken: Optional[str]
    BT_AccessTokenExp: Optional[datetime]
    BT_RefreshTokenExp: Optional[datetime]
    BT_TokenBlackListedTime: datetime

    class Config:
        form_attributes = True