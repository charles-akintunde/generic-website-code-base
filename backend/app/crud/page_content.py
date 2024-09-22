""""
    Manages CRUD Operations for Page Contents.
"""

from datetime import datetime, timezone
from typing import Dict
from urllib.parse import unquote
from uuid import uuid4
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.schemas.page_content import PageContentCreateRequest, PageContentUpdateRequest
from app.models.page_content import T_PageContent
from app.models.page import T_Page
from app.models.page_content import T_PageContent
from app.utils.file_utils import delete_file, extract_path_from_url


class PageContentCRUD:
 def create_page_content(
        self,
        db: Session,
        page_content: PageContentCreateRequest,
    ):
    """
    Handles CRUD operation for creating page content.

    Args:
        db (Session): Database Session.
        page_content (PageContentCreateRequest): Contains the content the user wants to create.

    Returns:
        Page content object created.
    """
    page_content_data = page_content.model_dump(exclude_unset=True)

    # Create a database model instance
    db_page_content = T_PageContent(**page_content_data)
    
    # Add to session and commit
    db.add(db_page_content)
    db.commit()
    db.refresh(db_page_content)
    
    return db_page_content
 
 def get_page_content_by_id(
        self,
        page_content_id: str,
        db: Session):
    """
    Handles CRUD operation for fetching page content.

    Args:
        db (Session): Database Session.
        page_id (str): Page content Id.


    Returns:
        Page content object fetched.
    """
    return db.query(T_PageContent).filter(
        T_PageContent.PC_ID == page_content_id
    ).first()

 def get_page_content(
        self,
        page_id: str,
        page_content_title: str,
        db: Session):
    """
    Handles CRUD operation for fetching page content.

    Args:
        db (Session): Database Session.
        page_id (str): Name of the page the that hosts the content.
        content_title (str): Page content title.

    Returns:
        Page content object created.
    """
    return db.query(T_PageContent).filter(
        T_PageContent.PG_ID == page_id,
        func.lower(T_PageContent.PC_Title) == func.lower(page_content_title)
    ).first()
 
 def get_page_content_by_title(
       self, 
       db: Session, 
       page_id: str,
       page_content_title: str,
       ) -> T_PageContent:
    """
    Handles CRUD operation for fetching page content.

    Args:
        db (Session): Database Session.
        page_id (str): Id of the page the that hosts the content.
        content_title (str): Page content title.

    Returns:
        Page content object created.
    """
    return db.query(T_PageContent).filter(
       func.lower(T_PageContent.PC_Title) == func.lower(page_content_title), 
       T_PageContent.PG_ID == page_id).first()
 
 def get_page_content_by_display_url(
       self, 
       db: Session, 
       page_id: str,
       page_content_display_url: str,
       ) -> T_PageContent:
        """
        Handles CRUD operation for fetching page content.

        Args:
            db (Session): Database Session.
            page_id (str): Id of the page the that hosts the content.
            content_title (str): Page content title.

        Returns:
            Page content object created.
        """
       
        return db.query(T_PageContent).filter(
        func.lower(T_PageContent.PC_DisplayURL) == func.lower(page_content_display_url), 
        T_PageContent.PG_ID == page_id).first()


 def update_page_content(
    self,
    db: Session,
    page_content_id: str,
    page_content_update: PageContentUpdateRequest
):
    """
    Handles CRUD operation for updating page content.

    Args:
        db (Session): Database Session.
        page_content_id (str): Id of the page content that is to be updated.
    Returns:
        db_page_content (T_PageContent) Page content object updated.
    """
    db_page_content = self.get_page_content_by_id(
        db=db,
        page_content_id=page_content_id
    )
    if not db_page_content:
        return None
        
    update_data = page_content_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if value is None:
            continue 
        setattr(db_page_content, key, value)
    
    db_page_content.PC_LastUpdatedAt = datetime.now(timezone.utc)  # type: ignore
    db.commit()
    db.refresh(db_page_content)
    return db_page_content
 
 def delete_page_content(
       self,
       db: Session, 
       page_content_to_delete: T_PageContent):
    
    """
    Deletes page content.

    Args
        db (Session): database Session.
        page_content_id (str): Unique Identifier for pagecontent id.
    """
    try:
        if page_content_to_delete:
            # if page_content_to_delete.PC_DisplayURL: # type: ignore
            #     delete_file(extract_path_from_url(page_content_to_delete.PC_DisplayURL)) # type: ignore
            if page_content_to_delete.PC_ThumbImgURL: # type: ignore
                delete_file(extract_path_from_url(page_content_to_delete.PC_ThumbImgURL)) # type: ignore
            db.delete(page_content_to_delete)
            db.commit()
            return True
    except HTTPException as e:
        raise HTTPException(
          status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
          detail=e.detail)

       






page_content_crud = PageContentCRUD()