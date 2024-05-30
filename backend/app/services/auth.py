"""
User service for handling business logic related to users authentication.
"""

from fastapi import HTTPException, status
from os import access
from typing import Optional
from pydantic import EmailStr
from sqlalchemy import Tuple
from sqlalchemy.orm import Session
from app.schemas.user_info import Token, User, UserCreate
from app.crud.user_info import  user_crud
from passlib.context import CryptContext
from app.core.auth import create_access_token, create_confirmation_token, create_refresh_token, verify_password, verify_token
from app.core.email import send_confirmation_email, send_password_reset_email
from app.schemas.user_info import UserOut
from app.models.enums import E_Status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def confirm_password_reset(db: Session, token: str, new_password: str):
    """
    Request password reset by generating a token and sending an email.

    Args:
        db (Session): Database session.
        token (str): JWT reset token.
        new_password (str): New password.

    Raises:
        HTTPException: If token is invalid or expired.
        HTTPException: If user is not found.
    """
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    
    email = payload.get("sub")
    user = user_crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user_crud.update_user_password(
        db=db,
        user=user,
        new_passwordhash=pwd_context.hash(new_password))


async def request_password_reset(db: Session, email: EmailStr):
    """
    Request password reset by generating a token and sending an email.
    """
    user = user_crud.get_user_by_email(db=db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emails not found")
    
    reset_token = create_confirmation_token(user.UI_Email) # type: ignore
    await send_password_reset_email(user.UI_Email, reset_token)  # type: ignore

def authenticate_user(db: Session, email: str, password: str) -> Token:
    """
    Authenticate a user and return a JWT token.

    Args:
        db (Session): Database session.
        email (str): User's email.
        password (str): User's password.

    Returns:
        Token: JWT token.

    Raises:
        HTTPException: If authentication fails.
    """
    user = user_crud.get_user_by_email(db=db, email=email)


    if not user or not verify_password(password, user.UI_PasswordHash): # type: ignore
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.UI_Status == E_Status.Unauthenticated: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email is not verified!",
        )

    if user.UI_Status == E_Status.Disabled: # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled! Contact Admin",
        )

    access_token = create_access_token(data={"sub": user.UI_Email})
    refresh_token = create_refresh_token(data={"sub": user.UI_Email})
    return Token(access_token=access_token, refresh_token=refresh_token)

async def register_user(db: Session, user: UserCreate):
    """
    Register a new user and send a confirmation emial.

    Args:
        db (Session): Database session.
        user (UserCreate): User creation schema.

    Returns:
        dict: Newly created user object.
    """
    db_user = user_crud.get_user_by_email(db=db,email=user.UI_Email)
    if db_user:
        return None,  "Email already registered"
    
    user.UI_Password = pwd_context.hash(user.UI_Password)
    confirmation_token = create_confirmation_token(user.UI_Email)
    user.UI_ConfirmationTokenHash = confirmation_token

    new_user = user_crud.create_user(db=db, user=user)

    await send_confirmation_email(user.UI_Email, confirmation_token)

    user_out = UserOut(
    UI_ID=str(new_user.UI_ID),
    UI_FirstName=str(new_user.UI_FirstName),
    UI_LastName=str(new_user.UI_LastName),
    UI_Email=str(new_user.UI_Email),
)

    return user_out.model_dump(), None

async def  resend_confirmation_token(db: Session, email: EmailStr):
    """
    Resend a confirmation token to the user's email.

    Args:
        db (Session): Database session.
        email (str): User's email.

    Returns:
        str: Error message if any, otherwise None.
    """
    db_user: User = user_crud.get_user_by_email(db, email=email)
    if not db_user:
        return "User not found"
    
    if db_user.UI_Status == E_Status.Active: # type: ignore
        return "Email already confirmed"
    
    confirmation_token = create_confirmation_token(email)
    db_user.UI_ConfirmationTokenHash = confirmation_token # type: ignore
    db.commit()

    await send_confirmation_email(email, confirmation_token)
    return None

    
