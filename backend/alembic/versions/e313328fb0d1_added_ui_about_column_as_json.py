"""Added UI_About column as JSON

Revision ID: e313328fb0d1
Revises: d07995596274
Create Date: 2024-08-16 19:07:02.260263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e313328fb0d1'
down_revision: Union[str, None] = 'd07995596274'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('T_UserInfo', sa.Column('UI_About', sa.JSON(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('T_UserInfo', 'UI_About')
    # ### end Alembic commands ###