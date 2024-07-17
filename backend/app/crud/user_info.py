"""
CRUD operations for User model.
"""

from typing import Any, List, Optional, Union, Tuple
from uuid import UUID
from pydantic import EmailStr
from sqlalchemy import UUID, Column
from sqlalchemy.orm import Session
from app.models.user_info import T_UserInfo
from app.schemas.user_info import UserCreate, UserPartial
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
    
    def update_user_profile(self, db: Session, user: T_UserInfo, update_data: dict):
        """
        Update the user's profile.
        """
        if user:
            for key, value in update_data.items():
                if value is None:
                    continue
                setattr(user, key, value)
            db.commit()
            db.refresh(user)
        return user
    
    def delete_user(self, db: Session, user_to_delete: T_UserInfo):
        """
        Delete a user.
        """
        if user_to_delete:
            db.delete(user_to_delete)
            db.commit()
        return user_to_delete

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
    
    def get_total_user_count(self, db: Session) -> int:
            """
            Get the total count of users.

            Args:
                db (Session): Database session.

            Returns:
                int: Total count of users.
            """
            return db.query(T_UserInfo).count()

    
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
    
    # def get_users(self, db: Session,  last_key: Optional[Tuple[str, str, str]] = None, limit: int = 10) -> List[UserPartial]:
    #     query = db.query(
    #         T_UserInfo.UI_ID,
    #         T_UserInfo.UI_FirstName,
    #         T_UserInfo.UI_LastName,
    #         T_UserInfo.UI_Email,
    #         T_UserInfo.UI_Role,
    #         T_UserInfo.UI_Status,
    #         T_UserInfo.UI_RegDate,
    #         T_UserInfo.UI_PhotoURL
    #     )
    
    #     if last_key is not None:
    #         last_first_name, last_last_name, last_uuid = last_key
    #         query = query.filter(
    #             (T_UserInfo.UI_FirstName > last_first_name) |
    #             ((T_UserInfo.UI_FirstName == last_first_name) & (T_UserInfo.UI_LastName > last_last_name)) |
    #             ((T_UserInfo.UI_FirstName == last_first_name) & (T_UserInfo.UI_LastName == last_last_name) & (T_UserInfo.UI_ID > last_uuid))
    #         )
    
    #     results = query.order_by(T_UserInfo.UI_FirstName, T_UserInfo.UI_LastName, T_UserInfo.UI_ID).limit(limit).all()
    #     return [UserPartial(
    #         UI_ID=str(row.UI_ID),
    #         UI_FirstName=row.UI_FirstName,
    #         UI_LastName=row.UI_LastName,
    #         UI_Email=row.UI_Email,
    #         UI_Role=row.UI_Role, 
    #         UI_Status=row.UI_Status,
    #         UI_RegDate=row.UI_RegDate.isoformat(),
    #         UI_PhotoURL=row.UI_PhotoURL
    #     ) for row in results]
    

    def get_users(self, db: Session, page: int = 1, limit: int = 10) -> List[UserPartial]:
        offset = (page - 1) * limit
        query = db.query(
            T_UserInfo.UI_ID,
            T_UserInfo.UI_FirstName,
            T_UserInfo.UI_LastName,
            T_UserInfo.UI_Email,
            T_UserInfo.UI_Role,
            T_UserInfo.UI_Status,
            T_UserInfo.UI_RegDate,
            T_UserInfo.UI_PhotoURL
        )

        results = query.order_by(T_UserInfo.UI_FirstName, T_UserInfo.UI_LastName, T_UserInfo.UI_ID)\
                    .offset(offset)\
                    .limit(limit)\
                    .all()
        
        return [UserPartial(
            UI_ID=str(row.UI_ID),
            UI_FirstName=row.UI_FirstName,
            UI_LastName=row.UI_LastName,
            UI_Email=row.UI_Email,
            UI_Role=row.UI_Role, 
            UI_Status=row.UI_Status,
            UI_RegDate=row.UI_RegDate.isoformat(),
            UI_PhotoURL=row.UI_PhotoURL
        ) for row in results]
    
user_crud = UserCRUD()
