"""
API endpoints for user authentication.
"""

from typing import Optional
from fastapi import APIRouter, Cookie, Depends, HTTPException, Header, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.schemas.user_info import BaseToken, PasswordResetConfirm, PasswordResetRequest, Token, UserCreate, User as UserSchema, UserLogin
from app.services.auth import authenticate_user, confirm_password_reset, logout_user, register_user, request_password_reset, resend_confirmation_token, use_refresh_token
from app.database import get_db
from app.crud.user_info import user_crud
from app.utils.response import success_response, error_response
from app.core.auth import create_access_token, create_refresh_token, get_current_user_without_exception, verify_token
from app.models.enums import E_Status, E_UserRole
from app.schemas.response import StandardResponse
from app.utils.response_json import create_user_response
from app.config import settings
from app.crud import blacklisted_token

router = APIRouter()
ACCESS_TOKEN_EXPIRE_SECONDS = settings.ACCESS_TOKEN_EXPIRE_SECONDS
REFRESH_TOKEN_EXPIRE_SECONDS = settings.REFRESH_TOKEN_EXPIRE_SECONDS
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
            token=confirm.UI_Token, 
            new_password=confirm.UI_NewPassword)
        return success_response(
            message="Password has been successfully reset.")
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
    
    return success_response("Your account has been created. Go to you mail to complete verification.", {"user": new_user})

@router.post("/login", response_model=Token)
async def login_endpoint(response: Response, user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token.

    Args:
        user_login (UserLogin): User login information.
        db (Session): Database session.

    Returns:
        Response: HTTP response with JWT token set in cookie.
    """

    try:
        token = authenticate_user(db=db, email=user_login.UI_Email, password=user_login.UI_Password,response=response)
        
        response.set_cookie(
        key='access_token',
        value=token.access_token,
        httponly=True,
        samesite='none',
        secure=True,
        max_age=ACCESS_TOKEN_EXPIRE_SECONDS,
      #  domain='.generic-api-app.azurewebsites.net' 
    )

        response.set_cookie(
        key='refresh_token',
        value=token.refresh_token,
        httponly=True,
        samesite='none',
        secure=True,
        max_age=REFRESH_TOKEN_EXPIRE_SECONDS,
        #domain='.generic-api-app.azurewebsites.net'  
    )

        print(response.headers,"HEADER")
        return success_response(message='Login Successful',data=token.dict(),status_code=200,headers=response.headers)
    
    except HTTPException as e:
        return error_response(message=e.detail,status_code=e.status_code)

@router.post("/refresh-token", response_model=Token)
async def refresh_token_endpoint(
    response:Response,
    request: Request,
    db: Session = Depends(get_db)):
    """
    Refresh the JWT access token using a refresh token.

    Args:
        refresh_token (str): JWT refresh token.
        db (Session): Database session.

    Returns:
        Token: New JWT access and refresh tokens.
    """
    try:
        token = await use_refresh_token(request,db)
        response.set_cookie(
            key='access_token',
            value=token,
            httponly=True,
            samesite='none',
            secure=True,
            max_age=ACCESS_TOKEN_EXPIRE_SECONDS,
           #domain='.generic-api-app.azurewebsites.net'
        )

        return success_response(message='Token Refreshed Succesfully',status_code=200,headers=response.headers)
    except HTTPException as e:
        return error_response(message=e.detail,status_code=e.status_code)

from sqlalchemy.orm.attributes import flag_modified

@router.post("/account/confirm/", response_class=JSONResponse)
def confirm_email_endpoint(token: BaseToken, db: Session = Depends(get_db)):
    payload = verify_token(token=token.token, db=db)
    if payload is None:
        return error_response("Invalid or expired token", status.HTTP_400_BAD_REQUEST)
    email = payload.get("sub")
    if email is None:
        return error_response("Invalid or expired token", status.HTTP_400_BAD_REQUEST)
    
    db_user = user_crud.get_user_by_email(db, email=email)
    if not db_user:
        return error_response("User not found", status.HTTP_404_NOT_FOUND)
    
    if db_user.UI_Status == E_Status.Active: # type: ignore
        return error_response(message="Email already confirmed", status_code=status.HTTP_400_BAD_REQUEST)
    
    # Modify the roles
    if E_UserRole.Public in db_user.UI_Role:
        db_user.UI_Role.remove(E_UserRole.Public)  # Remove 'Public' role
    if E_UserRole.User not in db_user.UI_Role:
        db_user.UI_Role.append(E_UserRole.User)  # Add 'User' role

    # Mark the UI_Role as modified to ensure SQLAlchemy tracks the change
    flag_modified(db_user, "UI_Role")

    # Set the user's status to active
    db_user.UI_Status = E_Status.Active # type: ignore

    # Commit the changes to the database
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
    error = await resend_confirmation_token(db, email)
    if error:
        return error_response(error, status.HTTP_400_BAD_REQUEST) # type: ignore
    
    return success_response("Confirmation email resent successfully")

@router.get('/active-user', response_model=StandardResponse)
def get_active_user(
    active_user=Depends(get_current_user_without_exception)
) -> JSONResponse:
    """
    Retrieve the currently logged-in user.

    Args:
        active_user: The user currently authenticated.
        token: The current token from the authorization header.
        db: The database session.

    Returns:
        JSONResponse: Standardized response format.
    """
    try:
        
        if active_user:
            return success_response(message='User retrieved successfully', data=create_user_response(active_user).dict())
        else:
            return success_response(message='No user is currently logged in', is_success=False)
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)


@router.post("/logout", response_model=StandardResponse)
async def logout(
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Logout the user by blacklisting the JWT tokens.

    Args:
        response (Response): FastAPI response object to clear cookies.
        db (Session): Database session.

    Returns:
        dict: Confirmation of logout.
    """
    try:
        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')

        if not access_token and not refresh_token:
            return error_response(
                message="Already logged out.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        
        if access_token:
            response.delete_cookie(
                key="access_token",
                httponly=True,
                samesite='none',
                secure=True,
                domain=None
            )
        if refresh_token:
            response.delete_cookie(
                key="refresh_token",
                httponly=True,
                samesite='none',
                secure=True,
                domain=None
            )

        if access_token and refresh_token:
            blacklisted_token = logout_user(access_token=access_token,refresh_token= refresh_token,db= db)

        return success_response(message="Logout successful.", headers=response.headers)
    except HTTPException as e:
        return error_response(message=e.detail, status_code=e.status_code)