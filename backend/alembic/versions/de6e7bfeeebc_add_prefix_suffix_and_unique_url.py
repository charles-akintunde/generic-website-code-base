"""Add prefix, suffix, and unique URL

Revision ID: de6e7bfeeebc
Revises: 5434a46e7a8f
Create Date: 2024-11-25 09:07:29.120606

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import shortuuid
from sqlalchemy.orm import Session


# revision identifiers, used by Alembic.
revision: str = 'de6e7bfeeebc'
down_revision: Union[str, None] = '5434a46e7a8f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '5434a46e7a8f'


def upgrade() -> None:
    # Add new columns with nullable set to True initially
    op.add_column('T_UserInfo', sa.Column('UI_Prefix', sa.String(length=10), nullable=True))
    op.add_column('T_UserInfo', sa.Column('UI_Suffix', sa.String(length=10), nullable=True))
    op.add_column('T_UserInfo', sa.Column('UI_UniqueURL', sa.String(length=150), nullable=True))  # Initially nullable

    # Get a bind to the current database session
    bind = op.get_bind()
    session = Session(bind=bind)
    shortuuid.set_alphabet("abcdefghijklmnopqrstuvwxyz")


    # Fetch all existing users to populate unique URLs
    users = session.execute(
        sa.text('SELECT "UI_ID", "UI_FirstName", "UI_LastName" FROM "T_UserInfo"')
    ).fetchall()

    for user in users:
        ui_id, first_name, last_name = user
        base_url = f"{first_name.lower().replace(' ', '-')}-{last_name.lower().replace(' ', '-')}"
        unique_url = base_url

        # Ensure the URL is unique
        while session.execute(
            sa.text('SELECT 1 FROM "T_UserInfo" WHERE "UI_UniqueURL" = :unique_url'),
            {'unique_url': unique_url}
        ).fetchone():
            unique_url = f"{base_url}-{shortuuid.ShortUUID().random(length=9).lower()}"

        # Update the user's unique URL
        session.execute(
            sa.text('UPDATE "T_UserInfo" SET "UI_UniqueURL" = :unique_url WHERE "UI_ID" = :ui_id'),
            {'unique_url': unique_url, 'ui_id': str(ui_id)}
        )

    # Commit the updates
    session.commit()

    # Set the UI_UniqueURL column to NOT NULL after population
    op.alter_column('T_UserInfo', 'UI_UniqueURL', nullable=False)

    # Create indexes for UI_UNIQUEURL
    op.create_index(op.f('ix_T_UserInfo_UI_UI_UniqueURL'), 'T_UserInfo', ['UI_UniqueURL'], unique=True)
    op.create_index('ix_user_uniqueurl', 'T_UserInfo', ['UI_UniqueURL'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_user_uniqueurl', table_name='T_UserInfo')
    op.drop_index(op.f('ix_T_UserInfo_UI_UNIQUEURL'), table_name='T_UserInfo')

    # Drop newly added columns
    op.drop_column('T_UserInfo', 'UI_UNIQUEURL')
    op.drop_column('T_UserInfo', 'UI_PREFIX')
    op.drop_column('T_UserInfo', 'UI_SUFFIX')