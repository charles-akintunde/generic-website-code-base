from fastapi import APIRouter, FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db# Import your get_db function

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings

router = APIRouter()

SECRET_PASSWORD = settings.DEVELOPER_SQL_INJECTION_PASSWORD

class SQLQuery(BaseModel):
    query: str
    password: str  

@router.post("/run-sql/")
def run_sql(sql_query: SQLQuery, db: Session = Depends(get_db)):
    if sql_query.password != SECRET_PASSWORD:
        raise HTTPException(status_code=403, detail="Invalid password")
    
    try:
        query = sql_query.query.strip().lower()
        
        if query.startswith("select"):
            result = db.execute(text(sql_query.query))
            rows = result.fetchall()  # Fetch all rows
            result_dicts = [dict(row._mapping) for row in rows]
            return {"result": result_dicts}
        else:
            db.execute(text(sql_query.query))
            db.commit()  
            return {"result": "Query executed successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))