"""
    Schema for blacklisted tokens.
"""

from datetime import datetime
from pydantic import BaseModel


class BlackListedToken(BaseModel):
    BT_AccessToken: str
    BT_RefreshToken: str
    BT_AccessTokenExp: datetime
    BT_RefreshTokenExp: datetime
    BT_TokenBlackListedTime: datetime

    class Config:
        form_attributes = True