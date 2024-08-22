"""
Authentication utilities.
"""

import os
from datetime import datetime, timedelta , timezone
import stat
from jose.exceptions import ExpiredSignatureError, JWTError
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import Enum
from typing_extensions import deprecated
from jose import JWTError, jwt
from typing import Dict, Optional
from dotenv import load_dotenv
from app.config import settings
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.crud.user_info import user_crud
from app.database import get_db
from app.models.user_info import T_UserInfo
from app.crud.blacklisted_token import blacklisted_token_crud
from app.schemas.user_info import Token, UIToken


SECRET_KEY = settings.AUTH_SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = settings.ACCESS_TOKEN_EXPIRE_SECONDS
CONFIRMATION_TOKEN_EXPIRY_DAYS = 10
REFRESH_TOKEN_EXPIRE_SECONDS = settings.REFRESH_TOKEN_EXPIRE_SECONDS

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
oauth2_scheme_without_auto_error = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def get_token_from_cookie(request: Request) -> UIToken:
#     access_token = request.cookies.get('access_token')
#     refresh_token = request.cookies.get('refresh_token')

#     tokens = UIToken(access_token=access_token, refresh_token=refresh_token)

#     return tokens


def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get('access_token')
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

def get_token_from_cookies_without_exception(request: Request):
    token = request.cookies.get('access_token')
    if not token:
        return None
    return token

def get_current_user_without_exception(
        token= Depends(get_token_from_cookies_without_exception),
        db: Session = Depends(get_db)) -> Optional[T_UserInfo]:
    """
    Get the currently user making request.

    Args:
        token (str): JWT access token.
        db (Session): Database session.

    Returns:
        Optional[T_UserInfo]: The current user or None if not authenticated.
    """
    if not token:
        return None
    try:
        payload = verify_token(token=token, db=db)
        if not payload:
            return None
        email = payload.get("sub")
        if email is None:
            return None
        user = user_crud.get_user_by_email(db, email=email)
        return user
    except JWTError:
        return None


def get_current_user(token: str = Depends(get_token_from_cookie), db: Session = Depends(get_db)) -> T_UserInfo:
    """
    Get the currently authenticated user.

    Args:
        token (str): JWT access token.
        db (Session): Database session.

    Returns:
    T_UserInfo: The current user.

    Raises:
        HTTPException: If the token is invalid or expired, or the user is not found.
    """
    credentails_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentails",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token_raises_error(db=db, token=token)
        if not payload:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
        email: str = str(payload.get("sub"))
        if email is None:
            raise credentails_exception
    except JWTError:
        raise credentails_exception
    
    user = user_crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentails_exception
    
    return user





def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password (str): Plain password.
        hashed_password (str): Hashed password.

    Returns:
        bool: Whether the passwords match.
    """

    return pwd_context.verify(plain_password, hashed_password)


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT refresh token.

    Args:
        data (dict): Data to encode in the token.
        expires_delta (Optional[timedelta]): Token expiration time.

    Returns:
        str: Encoded JWT token.
    """

    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(seconds=REFRESH_TOKEN_EXPIRE_SECONDS)
    to_encode.update({"exp": expire})

    # for key, value in to_encode.items():
    #     if isinstance(value, Enum):
    #         to_encode[key] = value

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


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
        expire = datetime.now(timezone.utc) + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    to_encode.update({"exp": expire})

    # for key, value in to_encode.items():
    #     if isinstance(value, Enum):
    #         to_encode[key] = value

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
    expire = datetime.now(timezone.utc) + timedelta(days=CONFIRMATION_TOKEN_EXPIRY_DAYS)
    to_encode = {"exp": expire, "sub": email}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(db: Session, token: str):
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
        if blacklisted_token_crud.is_token_blacklisted(db=db, token=token):
            return None
        return payload
    except ExpiredSignatureError:
        return None
    except JWTError:
        return None
    
def verify_token_raises_error(db: Session, token: str) -> Dict:
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
        if blacklisted_token_crud.is_token_blacklisted(db=db, token=token):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are not logged in"
            )
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
         )
    

