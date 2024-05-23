"""
User service for handling business logic related to users.
"""

from sqlalchemy.orm import Session
from app.schemas.user import User, UserCreate
from app.crud.user import  user_crud
from passlib.context import CryptContext
from app.core.auth import create_confirmation_token
from app.core.email import send_confirmation_email
from app.schemas.user import UserOut

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def register_user(db: Session, user: UserCreate) -> str:
    """
    Register a new user and send a confirmation emial.

    Args:
        db (Session): Database session.
        user (UserCreate): User creation schema.

    Returns:
        dict: Newly created user object.
    """
    db_user = user_crud.get_user_by_email(db=db,email=user.email)
    if db_user:
        return None,  "Email already registered"
    
    user.password_hash = pwd_context.hash(user.password)
    confirmation_token = create_confirmation_token(user.email)
    user.confirmation_token = confirmation_token

    new_user = user_crud.create_user(db=db, user=user)

    await send_confirmation_email(user.email, confirmation_token)

    user_out_data = new_user.__dict__
    user_out_data['user_id'] = str(user_out_data['user_id'])
    user_out_data.pop('password_hash', None)
    user_out_data.pop('confirmation_token', None)
    user_out = UserOut(**user_out_data)
    user_out = user_out.model_dump()

    return user_out, None

def resend_confirmation_token(db: Session, email: str) -> str:
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
    
    if db_user.is_confirmed:
        return "Email already confirmed"
    
    confirmation_token = create_confirmation_token(email)
    db_user.confirmation_token = confirmation_token
    db.commit()

    send_confirmation_email(email, confirmation_token)
    return None

    
