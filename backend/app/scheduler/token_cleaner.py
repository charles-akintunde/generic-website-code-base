"""
    Scheduler to clean invalidated tokens.
"""

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud.blacklisted_token import blacklisted_token_crud



def remove_expired_tokens_job():
    """
    Job function to remove expired tokens using a new DB session.
    """
    db: Session = next(get_db())
    try:
        blacklisted_token_crud.remove_expired_tokens(db)
    finally:
        db.close()

def start_token_cleaner_scheduler():
    """
    Start the background scheduler for token cleaning.
    """
    scheduler = BackgroundScheduler()
    scheduler.add_job(remove_expired_tokens_job, 'interval', hours=24)
    scheduler.start()

    if __name__ == "__main__":
        start_token_cleaner_scheduler()



