"""added member position column to db

Revision ID: 9f2477c24cfe
Revises: 2266328f7882
Create Date: 2024-07-30 13:11:32.599097

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9f2477c24cfe'
down_revision: Union[str, None] = '2266328f7882'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
