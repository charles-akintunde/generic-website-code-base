"""
CRUD operations for User model.
"""

from typing import Any, Union
from pydantic import EmailStr
from sqlalchemy import Column
from sqlalchemy.orm import Session
from app.models.user_info import T_UserInfo
from app.schemas.user_info import UserCreate
import uuid
from app.models.enums import E_Status, E_UserRole

class UserCRUD:
    def update_user_status(self,db: Session, user_id: str, new_status: E_Status):
        """
        Update the user's status.
        """
        user = db.query(T_UserInfo).filter(T_UserInfo.UI_ID == user_id).first()
        if user:
            user.UI_Status = new_status # type: ignore
            db.commit()
            db.refresh(user)
        return user
    
    def update_user_role(self,db: Session, user_id: str, new_role: E_UserRole):
        """
        Update the user's role.
        """
        user = db.query(T_UserInfo).filter(T_UserInfo.UI_ID == user_id).first()
        if user:
            user.UI_Role = new_role # type: ignore
            db.commit()
            db.refresh(user)
        return user
    
    def update_user_profile(self, db: Session, user_id: str, update_data: dict):
        """
        Update the user's profile.
        """

        user = db.query(T_UserInfo).filter(T_UserInfo.UI_ID == user_id).first()
        if user:
            for key, value in update_data.items():
                setattr(user, key, value)
            db.commit()
            db.refresh(user)
        return user
    
    def delete_user(self, db: Session, user_id: str):
        """
        Delete a user.
        """
        user = db.query(T_UserInfo).filter(T_UserInfo.UI_ID == user_id).first()
        if user:
            db.delete(user)
            db.commit()
        return user

    def update_user_password(self, db: Session, user: T_UserInfo, new_passwordhash: str):
        """
        Update the user's password.

        Args:
            db (Session): Database session.
            user (T_UserInfo): User object.
            new_password (str)L New password.

        Returns:
            T_UserInfo: Updated user object.
        """
        user.UI_PasswordHash = new_passwordhash # type: ignore
        db.commit()
        db.refresh(user)
        return user


    def get_user_by_email(self, db: Session, email: Union[EmailStr, str, Any]) -> T_UserInfo:
        """
        Get a user by email.

        Args:
            db (Session): Database session.
            email (str): User's email.

        Returns:
            User: User object if found, otherwise None.
        """
        return db.query(T_UserInfo).filter(T_UserInfo.UI_Email == email).first()
    
    def get_user_by_id(self, db: Session, user_id: str) -> T_UserInfo:
        """
        Get a user by Id.

        Args:
            db (Session): Database session.
            email (str): User's Id.

        Returns:
            User: User object if found, otherwise None.
        """
        return db.query(T_UserInfo).filter(T_UserInfo.UI_ID == user_id).first()
    
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
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
user_crud = UserCRUD()
