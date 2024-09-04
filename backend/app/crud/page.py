"""
    Manages CRUD operations for pages.
"""

from typing import Any, List

from fastapi import HTTPException, status
from sqlalchemy import func
from app.schemas.page import  Page, PageCreate, PageResponse
from app.models.page import T_Page
from sqlalchemy.orm import Session, load_only
from app.crud.page_content import page_content_crud
from app.models.enums import E_PageType, E_UserRole
from app.crud import page_content
from app.models.user_info import T_UserInfo
from app.schemas.page_content import PageContent, PageContentCreateRequest
from app.crud.page_content import page_content_crud
from urllib.parse import unquote


# class PageContent(BaseModel):
#     UI_ID: str
#     PG_ID: str
#     PC_Title: str
#     PC_Content: Optional[Dict]
#     PC_DisplayURL: Optional[str] = None
#     PC_ThumbImgURL: Optional[str] = None
#     PC_IsHidden: bool
#     PC_CreatedAt: Optional[str] = None
#     PC_LastUpdatedAt: Optional[str] = None


# class Page(BaseModel):
#     PG_ID: Optional[str] = None
#     PG_Type: E_PageType
#     PG_Name: str 
#     PG_Permission: List[E_UserRole]

class PageCRUD:

    async def create_page(self, db: Session, page: PageCreate, current_user: T_UserInfo):
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

        if page.PG_Type == E_PageType.SinglePage:
            single_page_content = PageContentCreateRequest(
                UI_ID=str(current_user.UI_ID),
                PG_ID=str(db_page.PG_ID),
                PC_Title=str(db_page.PG_Name),
                PC_IsHidden=False,
                PC_Content={
                    "PC_Content": [
                        {
                            "id": "1",
                            "type": "p",
                            "children": [{"text": f"Enter Content for this page"}],
                        }
                    ]
                }
            )

            page_content_crud.create_page_content(
                    db,
                    single_page_content)

  
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
    
    
    
    def get_page_by_display_url(self, db: Session, pg_display_url: str) -> T_Page:
        """
        Gets page with page display url.

        Args:
            db (Session): Database session.
            pg_display_url (str): Page Display URL.

        Returns:
            Page (T_Page): Existing page object.
        """
        
        return db.query(T_Page).filter(func.lower(T_Page.PG_DisplayURL) == func.lower(unquote(pg_display_url))).first()
    
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
    
    def get_total_pages_count(self, db: Session) -> int:
            """
            Get the total count of pages.

            Args:
                db (Session): Database session.

            Returns:
                int: Total count of pages.
            """
            return db.query(T_Page).count()

    def get_pages(self, db: Session) -> List[T_Page]:
        """
        Get pages for menu items, excluding page content and others.
        """
        return db.query(T_Page).options(load_only(T_Page.PG_ID, T_Page.PG_Type, T_Page.PG_Name, T_Page.PG_Permission)).all() # type: ignore

    def get_pages_with_offset(self, db: Session, pg_page_number: int = 1, pg_page_limit: int = 10) -> List[PageResponse]:
        """
        Get pages with offset.
        """
        offset = (pg_page_number - 1) * pg_page_limit
        query = db.query(
            T_Page.PG_ID,
            T_Page.PG_Name,
            T_Page.PG_Permission,
            T_Page.PG_Type,
            T_Page.PG_DisplayURL
        )
        page_rows = query.offset(offset).limit(pg_page_limit).all()
        return [PageResponse(
            PG_ID=str(row.PG_ID),
            PG_Name=row.PG_Name ,
            PG_Permission=[permission.value for permission in row.PG_Permission],
            PG_Type=row.PG_Type.value,
            PG_DisplayURL=str(row.PG_DisplayURL)
        ) for row in page_rows]

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
