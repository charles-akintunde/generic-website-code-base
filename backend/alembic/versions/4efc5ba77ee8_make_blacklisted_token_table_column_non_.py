"""make blacklisted token table column non-nullable

Revision ID: 4efc5ba77ee8
Revises: d1a98ef53070
Create Date: 2024-06-05 20:43:48.406471

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = '4efc5ba77ee8'
down_revision: Union[str, None] = 'd1a98ef53070'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check if the table already exists before creating it
    bind = op.get_bind()
    inspector = inspect(bind)
    if 'T_BlackListedTokens' not in inspector.get_table_names():
        op.create_table(
            'T_BlackListedTokens',
            sa.Column('BT_ID', sa.UUID(), nullable=False),
            sa.Column('BT_AccessToken', sa.String(length=512), nullable=False),
            sa.Column('BT_RefreshToken', sa.String(length=512), nullable=False),
            sa.Column('BT_AccessTokenExp', sa.DateTime(), nullable=False),
            sa.Column('BT_RefreshTokenExp', sa.DateTime(), nullable=False),
            sa.Column('BT_TokenBlackListedTime', sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint('BT_ID')
        )


def downgrade() -> None:
    # Drop the table if it exists
    bind = op.get_bind()
    inspector = inspect(bind)
    if 'T_BlackListedTokens' in inspector.get_table_names():
        op.drop_table('T_BlackListedTokens')