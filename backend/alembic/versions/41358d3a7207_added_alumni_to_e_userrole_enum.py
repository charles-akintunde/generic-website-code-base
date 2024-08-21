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

# Define the updated enum type (with the new value)
new_enum = postgresql.ENUM(E_UserRole, name="e_userrole", create_type=False)
old_enum = sa.Enum("SuperAdmin", "Admin", "Member", "User", "Public", name="e_userrole")

def upgrade() -> None:
    # Manually add the new value to the existing enum type
    op.execute("ALTER TYPE e_userrole ADD VALUE 'Alumni'")

    # Alter the column to use the updated enum type within an ARRAY
    op.alter_column(
        'T_UserInfo', 
        'UI_Role',
        type_=sa.ARRAY(new_enum),
        postgresql_using="UI_Role::text[]::e_userrole[]"
    )

def downgrade() -> None:
    # You cannot remove values from an ENUM in PostgreSQL
    # So, you will not be able to reverse this part of the migration.
    # Handle this with a downgrade that reverts other schema changes.
    # In practice, you may just want to document that downgrading past
    # this migration requires manual intervention.

    # Revert the column change
    op.alter_column(
        'T_UserInfo', 
        'UI_Role',
        type_=sa.ARRAY(old_enum),
        postgresql_using="UI_Role::text[]::e_userrole[]"
    )