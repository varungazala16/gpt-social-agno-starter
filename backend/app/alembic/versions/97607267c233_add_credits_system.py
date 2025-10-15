"""add_credits_system

Revision ID: 97607267c233
Revises: 241987608c6a
Create Date: 2025-10-14 12:56:00.353181

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils


# revision identifiers, used by Alembic.
revision: str = '97607267c233'
down_revision: Union[str, Sequence[str], None] = '241987608c6a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create credit_transactions table
    op.create_table('credit_transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('amount', sa.Integer(), nullable=False),
    sa.Column('balance_after', sa.Integer(), nullable=False),
    sa.Column('transaction_type', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_credit_transactions_id'), 'credit_transactions', ['id'], unique=False)
    op.create_index(op.f('ix_credit_transactions_user_id'), 'credit_transactions', ['user_id'], unique=False)
    
    # Create user_credits table
    op.create_table('user_credits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('balance', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_credits_id'), 'user_credits', ['id'], unique=False)
    op.create_index(op.f('ix_user_credits_user_id'), 'user_credits', ['user_id'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop user_credits table
    op.drop_index(op.f('ix_user_credits_user_id'), table_name='user_credits')
    op.drop_index(op.f('ix_user_credits_id'), table_name='user_credits')
    op.drop_table('user_credits')
    
    # Drop credit_transactions table
    op.drop_index(op.f('ix_credit_transactions_user_id'), table_name='credit_transactions')
    op.drop_index(op.f('ix_credit_transactions_id'), table_name='credit_transactions')
    op.drop_table('credit_transactions')
