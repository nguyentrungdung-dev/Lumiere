"""add_admin_and_phone_fields_to_users

Revision ID: 1fa2cf495087
Revises: d3ced8fa38fd
Create Date: 2025-10-24 00:59:27.396795

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1fa2cf495087'
down_revision = 'd3ced8fa38fd'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add phone column
    op.add_column('users', sa.Column('phone', sa.String(), nullable=True))
    
    # Add is_admin column with default False
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    # Remove columns in reverse order
    op.drop_column('users', 'is_admin')
    op.drop_column('users', 'phone')

