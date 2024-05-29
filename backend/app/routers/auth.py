"""
API endpoints for user registration and login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.schemas.user_info import Token, UserCreate, User as UserSchema, UserLogin
from app.services.auth import authenticate_user, register_user, resend_confirmation_token
from app.database import get_db
from app.crud.user_info import user_crud
from app.utils.response import success_response, error_response
from app.core.auth import create_access_token, create_refresh_token, verify_token
from app.models.enums import E_Status

router = APIRouter()

@router.get("/users")
def read_users():
    """
    Retrieve a list of users.
    """
    return {"message": "List of users"}

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def register_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user and send a confirmation email.

    Args:
        user (UserCreate): User creation schema.
        db (Session): Database session.

    Returns:
        User: Created user object.
    """

    new_user, error = await register_user(db, user)
    if error:
        return error_response(error, status.HTTP_400_BAD_REQUEST)
    
    return success_response("User registered successfully. Please check your email for confirmation.", {"user": new_user})


@router.post("/login", response_model=Token)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token.

    Args:
        user_login (UserLogin): User login information.
        db (Session): Database session.

    Returns:
        Token: JWT token.
    """

    try:
        token = authenticate_user(db, user_login.UI_Email, user_login.UI_Password)
        return success_response("Login successful", data=token.dict())
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)

@router.post("/refresh", response_model=Token)
async def refresh_toekn(refresh_token: str, db: Session = Depends(get_db)):
    """
    Refresh the JWT access token using a refresh token.

    Args:
        refresh_token (str): JWT refresh token.
        db (Session): Database session.

    Returns:
        Token: New JWT access and refresh tokens.
    """

    payload = verify_token(refresh_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    new_access_token = create_access_token(data={"sub": email})
    new_refresh_token = create_refresh_token(data={"sub": email})

    return success_response("Token refreshed", data={
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    })

@router.get("/confirm/{token}", response_class=JSONResponse)
def confirm_email_endpoint(token: str, db: Session = Depends(get_db)):
    """
    Confirm user's email address.

    Args:
        token (str): Confirmation token.
        db (Session): Database session.

    Returns:
        JSONResponse: Confirmation message.
    """
    payload = verify_token(token)
    email = payload.get("sub") # type: ignore
    if email is None:
        return error_response("Invalid or expired token", status.HTTP_400_BAD_REQUEST)
    
    db_user = user_crud.get_user_by_email(db, email=email)
    if not db_user:
        return error_response("User not found", status.HTTP_404_NOT_FOUND)
    
    if db_user.UI_Status == E_Status.Active: # type: ignore
        return success_response("Email already confirmed")
    
    db_user.UI_Status = E_Status.Active # type: ignore
    db.commit()
    db.refresh(db_user)
    
    return success_response("Email confirmed successfully")

@router.post("/resend-confirmation", response_class=JSONResponse)
async def resend_confirmation_endpoint(email: EmailStr, db: Session = Depends(get_db)):
    """
    Resend confirmation email.

    Args:
        email (str): User's email.
        db (Session): Database session.

    Returns:
        JSONResponse: Confirmation message.
    """
    print(EmailStr,"EmailStr")
    error = await resend_confirmation_token(db, email)
    if error:
        return error_response(error, status.HTTP_400_BAD_REQUEST) # type: ignore
    
    return success_response("Confirmation email resent successfully")