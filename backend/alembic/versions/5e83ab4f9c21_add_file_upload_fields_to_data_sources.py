"""add file upload fields to data sources

Revision ID: 5e83ab4f9c21
Revises: 4c772b7ebe1d
Create Date: 2025-11-19 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '5e83ab4f9c21'
down_revision = '4c772b7ebe1d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns to data_sources table
    op.add_column('data_sources', sa.Column('source_type', sa.String(), nullable=True, comment='csv, excel, database, api'))
    op.add_column('data_sources', sa.Column('row_count', sa.Integer(), nullable=True, comment='Number of rows in uploaded file'))
    op.add_column('data_sources', sa.Column('column_count', sa.Integer(), nullable=True, comment='Number of columns in uploaded file'))
    op.add_column('data_sources', sa.Column('file_size', sa.BigInteger(), nullable=True, comment='File size in bytes'))
    op.add_column('data_sources', sa.Column('config', postgresql.JSON(astext_type=sa.Text()), nullable=True, comment='Additional configuration (columns, etc.)'))


def downgrade() -> None:
    # Remove columns from data_sources table
    op.drop_column('data_sources', 'config')
    op.drop_column('data_sources', 'file_size')
    op.drop_column('data_sources', 'column_count')
    op.drop_column('data_sources', 'row_count')
    op.drop_column('data_sources', 'source_type')

