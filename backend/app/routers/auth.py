"""
API endpoints for user authentication.
"""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.schemas.user_info import PasswordResetConfirm, PasswordResetRequest, Token, UserCreate, User as UserSchema, UserLogin
from app.services.auth import authenticate_user, confirm_password_reset, logout_user, register_user, request_password_reset, resend_confirmation_token
from app.database import get_db
from app.crud.user_info import user_crud
from app.utils.response import success_response, error_response
from app.core.auth import create_access_token, create_refresh_token, verify_token
from app.models.enums import E_Status, E_UserRole
from app.schemas.response import StandardResponse

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
@router.post("/password-reset", response_model=StandardResponse)
async def request_password_reset_endpoint(
    request: PasswordResetRequest, 
    db: Session = Depends(get_db)) -> JSONResponse:
    """
    Request passowrd reset.

    Args:
        request (PasswordResetRequest): Password reset request schema.
        db (Session): Database session.

    Returns:
        Str: message for password reset.
    """
    try:
       await request_password_reset(
           db, 
           request.UI_Email)
       return success_response(
           message="Password reset email sent")
    except HTTPException as e:
        return error_response(
            message=e.detail, 
            status_code=e.status_code)
    
@router.post("/password-reset/confirm", response_model=StandardResponse)
async def confirm_password_reset_endpoint(confirm: PasswordResetConfirm, db: Session = Depends(get_db)):
    """
    Confirm password reset.

    Args:
        request (PasswordResetConfirm): Password reset confirm schema.
        db (Session): Database session.

    Returns:
        Str: message for password reset.
        """
    try: 
        confirm_password_reset(
            db=db, 
            token=confirm.token, 
            new_password=confirm.new_password)
        return success_response(
            message="Password updated successfully")
    except HTTPException as e:
        return error_response(
            message=e.detail, 
            status_code=e.status_code)


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
async def logi_endpoint(response: Response, user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token.

    Args:
        user_login (UserLogin): User login information.
        db (Session): Database session.

    Returns:
        Token: JWT token.
    """

    try:
        token = authenticate_user(db=db, email=user_login.UI_Email, password=user_login.UI_Password, response=response)
        return success_response("Login successful", data=token.dict())
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)

@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(
    response:Response,
    refresh_token: str, 
    db: Session = Depends(get_db)):
    """
    Refresh the JWT access token using a refresh token.

    Args:
        refresh_token (str): JWT refresh token.
        db (Session): Database session.

    Returns:
        Token: New JWT access and refresh tokens.
    """

    payload = verify_token(token=refresh_token,db=db)
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
    
    user=user_crud.get_user_by_email(db=db, email=email)

    token_data = {
        "sub": user.UI_Email,
        "firstname": user.UI_FirstName,
        "lastname": user.UI_LastName,
        "role": user.UI_Role.value,
        "status": user.UI_Status.value,
        "Id": user.UI_ID
    }

    new_access_token = create_access_token(data=token_data)
    new_refresh_token = create_refresh_token(data=token_data)

    response.set_cookie(key="access_token", value=new_access_token, httponly=True)
    response.set_cookie(key="refresh_token", value=new_refresh_token, httponly=True)

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
    payload = verify_token(token=token,db=db)
    email = payload.get("sub") # type: ignore
    if email is None:
        return error_response("Invalid or expired token", status.HTTP_400_BAD_REQUEST)
    
    db_user = user_crud.get_user_by_email(db, email=email)
    if not db_user:
        return error_response("User not found", status.HTTP_404_NOT_FOUND)
    
    if db_user.UI_Status == E_Status.Active: # type: ignore
        return success_response("Email already confirmed")
    
    db_user.UI_Status, db_user.UI_Role = E_Status.Active, E_UserRole.User # type: ignore
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

@router.post("/logout", response_model=StandardResponse)
async def logout(response: Response, db: Session = Depends(get_db), access_token: str = Depends(oauth2_scheme), refresh_token: str = Depends(oauth2_scheme)):
    """
    Logout the user by blacklisting the JWT tokens.

    Args:
        response (Response): FastAPI response object to clear cookies.
        db (Session): Database session.
        access_token (str): JWT access token to be blacklisted.
        refresh_token (str): JWT refresh token to be blacklisted.

    Returns:
        dict: Confirmation of logout.
    """
    try:
        blacklisted_token = logout_user(access_token, refresh_token, db)
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")
        return success_response(message="Logout successful.")
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)