"""
    Manages CRUD Operation for blacklisting.
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.blacklisted_token import T_BlackListedToken
from app.schemas.blacklisted_token import BlackListedToken

class BlackListedTokenCRUD:
    def add_token_to_blacklist(
      self,
      db: Session,
      token_data: BlackListedToken,
    ) -> T_BlackListedToken:
        """
        Adds blacklisted token to db.

        Args
            db (Session): Database Session.
            token_data (BlackListedToken): Contains token to cross refernec with db.

        Returns
            db_token (T_BlackListedToken)
        """
        
        db_token = T_BlackListedToken(**token_data.model_dump())
        db.add(db_token)
        db.commit()
        db.refresh(db_token)
        return db_token
    
    def is_token_blacklisted(
            self,
            token: str,
            db: Session) -> bool:
        """
        Checks if token is blacklisted.

        Args
            db (Session): Database Session.
            token (str): Token we want to cross reference.

        Returns
            None
        """
        return db.query(T_BlackListedToken).filter(
        (T_BlackListedToken.BT_AccessToken == token) |
        (T_BlackListedToken.BT_RefreshToken == token)
    ).first() is not None

    def remove_expired_tokens(
            self,
            db: Session,
    ):
        """
        Removes all expired token.

        Args
            db (Session): Database Session.

        Returns
            None
        """
        try:
            print("I WAS CALLED")
            current_time = datetime.now(timezone.utc)
            db.query(T_BlackListedToken).filter(
                (T_BlackListedToken.BT_AccessTokenExp < current_time) |
                (T_BlackListedToken.BT_RefreshTokenExp < current_time)
            ).delete()
            db.commit()
        except HTTPException as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e.detail
            )


blacklisted_token_crud = BlackListedTokenCRUD()