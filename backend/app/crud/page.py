"""
    Manages CRUD operations for pages.
"""

from typing import Any

from fastapi import HTTPException, status
from app.schemas.page import PageCreate
from app.models.page import T_Page
from sqlalchemy.orm import Session
from app.crud.page_content import page_content_crud
from app.models.enums import E_UserRole
from app.crud import page_content


class PageCRUD:

    def create_page(self, db: Session, page: PageCreate):
        """
        Create a new page.

        Args:
            db (Session): Database session.
            page (PageCreate): Page creation schema.

        Returns:
            User: Created page object.
        """

        db_page = T_Page(**page.model_dump())
        db.add(db_page)
        db.commit()
        db.refresh(db_page)
        return db_page
    
    def get_page_by_name(self, db: Session, page_name: str) -> T_Page:
        """
        Gets page with page name.

        Args:
            db (Session): Database session.
            page_name (str): Page name.

        Returns:
            Page (T_Page): Existing page object.
        """

        return db.query(T_Page).filter(T_Page.PG_Name == page_name).first()
    
    def get_page_by_name_and_id(self, db: Session, page_name: str, page_id: str) -> T_Page:
        """
        Gets page with page name and id.

        Args:
            db (Session): Database session.
            page_name (str): Page name.
            page_id (str)L Page Id

        Returns:
            Page (T_Page): Existing page object.
        """

        return db.query(T_Page).filter(
            T_Page.PG_Name == page_name,
            T_Page.PG_ID == page_id).first()
    
    def get_page_by_id(self, db: Session, page_id: str) -> T_Page:
        """
        Get page by id.
        """
        return db.query(T_Page).filter(T_Page.PG_ID == page_id).first()
    
    def remove_page_content(self, db: Session, page: T_Page):
        """
        Remove page content from db.
        """
        for page_content in page.PG_PageContents:
            page_content_crud.delete_page_content(db=db,page_content_to_delete=page_content)
  
    def update_page(self, db: Session, page_id, page_data) -> T_Page:
        """"
        Update page.
        """
        page = self.get_page_by_id(db, page_id)

        if page:
            for key, value in page_data.items():
                setattr(page, key, value)
            page.PG_Permission.append(E_UserRole.SuperAdmin)
            permissions = set(page.PG_Permission) # type: ignore
            page.PG_Permission = list(permissions) # type: ignore
            db.commit()
            db.refresh(page)
        return page
    
    def delete_page(self, db: Session, page: T_Page):
        """
        Delete page
        """
        try:
            self.remove_page_content(db=db, page=page)
            db.delete(page)
            db.commit()
            return True
        except HTTPException as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e.detail
            )



    

page_crud = PageCRUD()
