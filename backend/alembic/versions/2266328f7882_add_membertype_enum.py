"""add MemberType enum

Revision ID: 2266328f7882
Revises: 74396326c89b
Create Date: 2024-07-29 20:51:10.638358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2266328f7882'
down_revision: Union[str, None] = '74396326c89b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
