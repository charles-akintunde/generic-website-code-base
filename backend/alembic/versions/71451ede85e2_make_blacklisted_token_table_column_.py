"""make blacklisted token table column nullable

Revision ID: 71451ede85e2
Revises: 4efc5ba77ee8
Create Date: 2024-06-05 22:20:42.228480

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '71451ede85e2'
down_revision: Union[str, None] = '4efc5ba77ee8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('T_BlackListedTokens', 'BT_AccessToken',
               existing_type=sa.VARCHAR(length=512),
               nullable=True)
    op.alter_column('T_BlackListedTokens', 'BT_RefreshToken',
               existing_type=sa.VARCHAR(length=512),
               nullable=True)
    op.alter_column('T_BlackListedTokens', 'BT_AccessTokenExp',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('T_BlackListedTokens', 'BT_RefreshTokenExp',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('T_BlackListedTokens', 'BT_TokenBlackListedTime',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('T_BlackListedTokens', 'BT_TokenBlackListedTime',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('T_BlackListedTokens', 'BT_RefreshTokenExp',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('T_BlackListedTokens', 'BT_AccessTokenExp',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('T_BlackListedTokens', 'BT_RefreshToken',
               existing_type=sa.VARCHAR(length=512),
               nullable=False)
    op.alter_column('T_BlackListedTokens', 'BT_AccessToken',
               existing_type=sa.VARCHAR(length=512),
               nullable=False)
    # ### end Alembic commands ###