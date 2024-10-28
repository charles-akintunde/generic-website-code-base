"""Update cascade behavior for T_UsersPageContents

Revision ID: b766b82bdb19
Revises: 21de4ac8c14f
Create Date: 2024-10-28 03:52:39.373965

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b766b82bdb19'
down_revision: Union[str, None] = '21de4ac8c14f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Drop existing foreign key constraints without CASCADE
    op.drop_constraint('fk_t_userspagecontents_ui_id', 'T_UsersPageContents', type_='foreignkey')
    op.drop_constraint('fk_t_userspagecontents_pc_id', 'T_UsersPageContents', type_='foreignkey')

    # Recreate foreign keys with ON DELETE CASCADE
    op.create_foreign_key(
        'fk_t_userspagecontents_ui_id', 'T_UsersPageContents', 'T_UserInfo',
        ['UI_ID'], ['UI_ID'], ondelete='CASCADE'
    )
    op.create_foreign_key(
        'fk_t_userspagecontents_pc_id', 'T_UsersPageContents', 'T_PageContent',
        ['PC_ID'], ['PC_ID'], ondelete='CASCADE'
    )

def downgrade():
    # Drop the cascading foreign key constraints
    op.drop_constraint('fk_t_userspagecontents_ui_id', 'T_UsersPageContents', type_='foreignkey')
    op.drop_constraint('fk_t_userspagecontents_pc_id', 'T_UsersPageContents', type_='foreignkey')

    # Recreate the original foreign keys without ON DELETE CASCADE
    op.create_foreign_key(
        'T_UsersPageContents_UI_ID_fkey', 'T_UsersPageContents', 'T_UserInfo',
        ['UI_ID'], ['UI_ID']
    )
    op.create_foreign_key(
        'T_UsersPageContents_PC_ID_fkey', 'T_UsersPageContents', 'T_PageContent',
        ['PC_ID'], ['PC_ID']
    )
