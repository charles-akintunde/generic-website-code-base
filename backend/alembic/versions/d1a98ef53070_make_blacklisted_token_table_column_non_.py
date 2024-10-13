"""make blacklisted token table column non-nullable

Revision ID: d1a98ef53070
Revises: 0fc37787f0a4
Create Date: 2024-06-05 20:42:25.090660

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect



# revision identifiers, used by Alembic.
revision: str = 'd1a98ef53070'
down_revision: Union[str, None] = '0fc37787f0a4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
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

def downgrade():
    op.drop_table('T_BlackListedTokens')