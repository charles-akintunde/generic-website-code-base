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
from app.models.enums import E_Status
from app.models.associations import T_UsersPageContents

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
    
    def update_user_role_status(self,db: Session, user_id: str, update_data: dict):
        """
        Update the user's role.
        """
        user = db.query(T_UserInfo).filter(T_UserInfo.UI_ID == user_id).first()
        if user:
            for key, value in update_data.items():
                if value is None:
                    continue
                setattr(user, key, value)
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
    
    def get_users_with_assigned_positions(self, db: Session) -> List[UserPartial]:
        """
        Get users with assigned member positions.

        Args:
            db (Session): Database session.

        Returns:
            list: List of User objects with assigned member positions.
        """
        users = db.query(T_UserInfo).filter(T_UserInfo.UI_MemberPosition.isnot(None)).all()

    
        return [UserPartial(
            UI_ID=str(row.UI_ID),
            UI_FirstName=str(row.UI_FirstName),
            UI_LastName=str(row.UI_LastName),
            UI_Email=str(row.UI_Email),
            UI_Role=[str(role.value) for role in row.UI_Role], 
            UI_Status=str(row.UI_Status.value),
            UI_RegDate=row.UI_RegDate.isoformat(),
            UI_PhotoURL=str(row.UI_PhotoURL) if row.UI_PhotoURL else None, # type: ignore
            UI_MemberPosition=str(row.UI_MemberPosition.value) if row.UI_MemberPosition else None, # type: ignore
            UI_Country = str(row.UI_Country) if row.UI_Country else None # type: ignore

        ) for row in users]

    
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
    
    def get_users_by_ids(self, db: Session, user_ids: List[str]) -> Optional[List[T_UserInfo]]:
        """
        Retrieve a list of users based on their IDs.
        
        Args:
            db (Session): The database session.
            user_ids (List[UUID]): A list of user IDs to retrieve.
        
        Returns:
            Optional[List[T_UserInfo]]: A list of T_UserInfo instances that match the given IDs.
        """
        return db.query(T_UserInfo).filter(T_UserInfo.UI_ID.in_(user_ids)).all()

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
            T_UserInfo.UI_PhotoURL,
            T_UserInfo.UI_MemberPosition
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
            UI_Role=[role for role in row.UI_Role], 
            UI_Status=row.UI_Status,
            UI_RegDate=row.UI_RegDate.isoformat(),
            UI_PhotoURL=row.UI_PhotoURL,
            UI_MemberPosition=row.UI_MemberPosition if row.UI_MemberPosition else row.UI_MemberPosition

        ) for row in results]
    
    def add_users_to_page_content(self, db: Session, page_content_id: str, user_ids: List[str]) -> None:
        """
        Add users to a page content.

        Args:
            db (Session): Database session.
            page_content (T_PageContent): Page content .
            user_ids (List[str]): List of user IDs to add.
        """
        for user_id in user_ids:
            association_exists = db.query(T_UsersPageContents).filter_by(UI_ID=user_id, PC_ID=page_content_id).first()
            if not association_exists:
                db.execute(
                    T_UsersPageContents.insert().values(UI_ID=user_id, PC_ID=page_content_id)
                )
    
    def update_user_page_contents(self, db: Session, page_content_id: str, updated_user_ids: List[str]) -> None:
        """
        Update users assigned to a page content.

        Args:
            db (Session): Database session.
            page_content_id (str): Page content ID.
            user_ids (List[str]): List of user IDs to update.
        """

    
        current_user_ids = {
        association.UI_ID for association in db.query(T_UsersPageContents).filter_by(PC_ID=page_content_id)
        }

        new_user_ids = set(updated_user_ids)  - current_user_ids
        removed_user_ids = current_user_ids - set(updated_user_ids)

        for user_id in removed_user_ids:
            db.query(T_UsersPageContents).filter_by(UI_ID=user_id, PC_ID=page_content_id).delete()

        self.add_users_to_page_content(db, page_content_id, list(new_user_ids))

    
user_crud = UserCRUD()
