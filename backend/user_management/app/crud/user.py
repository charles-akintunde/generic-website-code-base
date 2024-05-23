"""
CRUD operations for User model.
"""

from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
import uuid

class UserCRUD:
    def get_user_by_email(self, db: Session, email: str):
        """
        Get a user by email.

        Args:
            db (Session): Database session.
            email (str): User's email.

        Returns:
            User: User object if found, otherwise None.
        """
        return db.query(User).filter(User.email == email).first()
    
    def create_user(self, db: Session, user: UserCreate):
        """
        Create a new user.

        Args:
            db (Session): Database session.
            user (UserCreate): User creation schema.

        Returns:
            User: Created user object.
        """
        db_user = User(
            user_id=uuid.uuid4(),
            username=user.username,
            email=user.email,
            password_hash=user.password_hash,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            is_active=user.is_active,
            is_blocked=user.is_blocked,
            is_confirmed=user.is_confirmed,
            confirmation_token=user.confirmation_token
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
user_crud = UserCRUD()