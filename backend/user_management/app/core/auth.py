"""
Authentication utilities.
"""

import os
from datetime import datetime, timedelta , timezone
from jose import JWTError, jwt
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token.

    Args:
        data (dict): Data to encode in the token.
        expires_delta (Optional[timedelta]): token expiration time.

    Returns:
        str: Encoded JWT token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode_jwt


def create_confirmation_token(email: str):
    """
    Create a JWT confirmation token for emial verification.

    Args:
        email (str): User's email to include in the token.

    Returns:
    str: Encoded JWT token.
    """
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode = {"exp": expire, "sub": email}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_confirmation_token(token: str):
    """
    Verify a JWT confirmation token.

    Args:
        token (str): JWT token to verify.

    Returns:
        str: email contained in the token if valid.
    
    Raises:
        JWTError: If the token is invliad or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        return None
    
