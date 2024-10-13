"""added blacklisted token table to db

Revision ID: 0fc37787f0a4
Revises: eff90ba76e62
Create Date: 2024-06-05 20:41:13.196833

"""
from typing import Sequence, Union
from sqlalchemy import inspect
from alembic import op

import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0fc37787f0a4'
down_revision: Union[str, None] = 'eff90ba76e62'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check if the table exists before creating it
    bind = op.get_bind()
    inspector = inspect(bind)
    if 'T_BlackListedTokens' not in inspector.get_table_names():
        op.create_table('T_BlackListedTokens',
            sa.Column('BT_ID', sa.UUID(), nullable=False),
            sa.Column('BT_AccessToken', sa.String(length=512), nullable=True),
            sa.Column('BT_RefreshToken', sa.String(length=512), nullable=True),
            sa.Column('BT_AccessTokenExp', sa.DateTime(), nullable=True),
            sa.Column('BT_RefreshTokenExp', sa.DateTime(), nullable=True),
            sa.Column('BT_TokenBlackListedTime', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('BT_ID')
        )

def downgrade() -> None:
    op.drop_table('T_BlackListedTokens')
