"""
API endpoints for user registration and login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.schemas.user_info import UserCreate, User as UserSchema
from app.services.user import register_user, resend_confirmation_token
from app.database import get_db
from app.crud.user_info import user_crud
from app.utils.response import success_response, error_response
from app.core.auth import verify_confirmation_token

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
    email = verify_confirmation_token(token)
    if email is None:
        return error_response("Invalid or expired token", status.HTTP_400_BAD_REQUEST)
    
    db_user = user_crud.get_user_by_email(db, email=email)
    if not db_user:
        return error_response("User not found", status.HTTP_404_NOT_FOUND)
    
    if db_user.is_confirmed:
        return success_response("Email already confirmed")
    
    db_user.is_confirmed = True
    db.commit()
    db.refresh(db_user)
    
    return success_response("Email confirmed successfully")

@router.post("/resend-confirmation", response_class=JSONResponse)
def resend_confirmation_endpoint(email: str, db: Session = Depends(get_db)):
    """
    Resend confirmation email.

    Args:
        email (str): User's email.
        db (Session): Database session.

    Returns:
        JSONResponse: Confirmation message.
    """
    error = resend_confirmation_token(db, email)
    if error:
        return error_response(error, status.HTTP_400_BAD_REQUEST)
    
    return success_response("Confirmation email resent successfully")