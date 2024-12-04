"""create super admin

Revision ID: 22401bd0b1d7
Revises: b766b82bdb19
Create Date: 2024-11-02 17:16:20.658164

"""
from typing import Sequence, Union

from alembic import op
from requests import Session
import shortuuid
import sqlalchemy as sa
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.enums import E_Status, E_UserRole
from app.models.user_info import T_UserInfo
from app.utils.app_config import app_config



# revision identifiers, used by Alembic.
revision: str = '22401bd0b1d7'
down_revision: Union[str, None] = 'de6e7bfeeebc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = 'de6e7bfeeebc'


def upgrade():
    bind = op.get_bind()
    session = Session(bind=bind)
    shortuuid.set_alphabet("abcdefghijklmnopqrstuvwxyz")


    base_url = f"{app_config['super_admin_first_name'].lower().replace(' ', '-')}-{app_config['super_admin_last_name'].lower().replace(' ', '-')}"
    unique_url = base_url


    while session.execute(
            sa.text('SELECT 1 FROM "T_UserInfo" WHERE "UI_UniqueURL" = :unique_url'),
            {'unique_url': unique_url}
        ).fetchone():
            unique_url = f"{base_url}-{shortuuid.ShortUUID().random(length=9).lower()}"

    super_admin = T_UserInfo(
        UI_ID=uuid4(),
        UI_FirstName=app_config['super_admin_first_name'], # Change this to the super admin's first name
        UI_LastName=app_config['super_admin_last_name'], # Change this to the super admin's last
        UI_Email=app_config['super_admin_email'], # Change this to the super admin's email
        UI_PasswordHash="", 
        UI_Role=[E_UserRole.SuperAdmin],
        UI_Status=E_Status.Active,
        UI_RegDate=datetime.now(timezone.utc),
        UI_UniqueURL=unique_url
    )

    session.add(super_admin)
    session.commit()
    session.close()

def downgrade():
    bind = op.get_bind()
    session = Session(bind=bind)

    session.query(T_UserInfo).filter(T_UserInfo.UI_Email == app_config['super_admin_first_name']).delete()
    session.commit()
    session.close()