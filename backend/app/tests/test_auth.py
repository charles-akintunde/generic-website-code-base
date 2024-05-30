from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_info import Token
from app.services.auth import authenticate_user

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    token = authenticate_user(db, email=form_data.username, password=form_data.password)
    return {"access_token": token.access_token, "refresh_token": token.refresh_token, "token_type": "bearer"}
