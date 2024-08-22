"""Added Alumni to E_UserRole enum

Revision ID: 41358d3a7207
Revises: e313328fb0d1
Create Date: 2024-08-21 01:13:35.359771


"""
from typing import Sequence, Union
from app.models.enums import E_UserRole
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '41358d3a7207'
down_revision: Union[str, None] = 'e313328fb0d1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

new_enum = postgresql.ENUM('SuperAdmin', 'Admin', 'Member', 'User', 'Public', 'Alumni', name="e_userrole", create_type=False)

def upgrade() -> None:
    # Step 1: Manually add the new value to the existing enum type
    op.execute("ALTER TYPE e_userrole ADD VALUE 'Alumni'")

    # Step 2: Alter the column to use the updated enum type within an ARRAY
    op.alter_column(
        'T_UserInfo', 
        'UI_Role',  # The existing column to be modified
        type_=sa.ARRAY(new_enum),
        postgresql_using='ARRAY["UI_Role"]'  # Cast the current single enum to an array
    )

def downgrade() -> None:
    # Downgrading this specific change would involve complex manual steps
    # which might include data migration or recreating the table, so a simple revert is not possible.
    # You can revert the array change by converting it back to a single enum.
    
    # Step 1: Convert the array column back to a single enum type (if possible)
    op.alter_column(
        'T_UserInfo', 
        'UI_Role',
        type_=new_enum,
        postgresql_using='"UI_Role"[1]'  # Assuming the array had only one value, pick the first
    )