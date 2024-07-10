"""
    Manages CRUD operations for pages.
"""

from typing import Any, List

from fastapi import HTTPException, status
from sqlalchemy import func
from app.schemas.page import PageCreate
from app.models.page import T_Page
from sqlalchemy.orm import Session, load_only
from app.crud.page_content import page_content_crud
from app.models.enums import E_PageType, E_UserRole
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

        return db.query(T_Page).filter(func.lower(T_Page.PG_Name) == func.lower(page_name)).first()
    
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
            func.lower(T_Page.PG_Name) == func.lower(page_name),
            T_Page.PG_ID == page_id).first()
    
    def get_page_by_id(self, db: Session, page_id: str) -> T_Page:
        """
        Get page by id.
        """
        return db.query(T_Page).filter(T_Page.PG_ID == page_id).first()
    


    def get_pages(self, db: Session) -> List[T_Page]:
        """
        Get pages for menu items, excluding page content and others.
        """
        return db.query(T_Page).options(load_only(T_Page.PG_ID, T_Page.PG_Type, T_Page.PG_Name, T_Page.PG_Permission)).all() # type: ignore


    def remove_page_content(self, db: Session, page: T_Page):
        """
        Remove page content from db.
        """
        for page_content in page.PG_PageContents:
            print(page_content,"page_conetnt")
            page_content_crud.delete_page_content(db=db,page_content_to_delete=page_content)
  
    def update_page(self, db: Session, page_id, page_data) -> T_Page:
        """"
        Update page.
        """
        page = self.get_page_by_id(db, page_id)

        if page:
            for key, value in page_data.items():
                if value is None:
                    continue
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
            print(page,"THE PAGE")
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
