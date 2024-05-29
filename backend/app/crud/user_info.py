"""
CRUD operations for User model.
"""

from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.models.user_info import T_UserInfo
from app.schemas.user_info import UserCreate
import uuid

class UserCRUD:
    def get_user_by_email(self, db: Session, email: EmailStr) -> T_UserInfo:
        """
        Get a user by email.

        Args:
            db (Session): Database session.
            email (str): User's email.

        Returns:
            User: User object if found, otherwise None.
        """
        return db.query(T_UserInfo).filter(T_UserInfo.UI_Email == email).first()
    
    def create_user(self, db: Session, user: UserCreate) -> T_UserInfo:
        """
        Create a new user.

        Args:
            db (Session): Database session.
            user (UserCreate): User creation schema.

        Returns:
            User: Created user object.
        """
        db_user = T_UserInfo(
            UI_ID=uuid.uuid4(),
            UI_Email=user.UI_Email,
            UI_PasswordHash=user.UI_Password,
            UI_FirstName=user.UI_FirstName,
            UI_LastName=user.UI_LastName,
            UI_ConfirmationTokenHash=user.UI_ConfirmationTokenHash
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
user_crud = UserCRUD()