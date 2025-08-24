"""Add performance indexes

Revision ID: performance_indexes
Revises: 5240790c327b
Create Date: 2025-08-21 08:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'performance_indexes'
down_revision: Union[str, Sequence[str], None] = '5240790c327b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add performance indexes."""
    # Index for created_at ordering (most common query)
    op.create_index('ix_analyses_created_at', 'analyses', ['created_at'])
    
    # Index for overall_score ordering
    op.create_index('ix_analyses_overall_score', 'analyses', ['overall_score'])
    
    # Composite index for source_type and created_at
    op.create_index('ix_analyses_source_type_created_at', 'analyses', ['source_type', 'created_at'])
    
    # Index for files table
    op.create_index('ix_files_created_at', 'files', ['created_at'])


def downgrade() -> None:
    """Remove performance indexes."""
    op.drop_index('ix_analyses_created_at', table_name='analyses')
    op.drop_index('ix_analyses_overall_score', table_name='analyses')
    op.drop_index('ix_analyses_source_type_created_at', table_name='analyses')
    op.drop_index('ix_files_created_at', table_name='files')
