"""replace users table with profiles table

Revision ID: 15047aba1e93
Revises: 97607267c233
Create Date: 2025-10-16 12:42:48.893439

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '15047aba1e93'
down_revision: Union[str, Sequence[str], None] = '97607267c233'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop old users table (with Integer id)
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')

    # Create new profiles table with UUID id that references auth.users
    op.create_table(
        'profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['id'], ['auth.users.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_profiles_id'), 'profiles', ['id'], unique=False)
    op.create_index(op.f('ix_profiles_email'), 'profiles', ['email'], unique=True)

    # Enable Row Level Security
    op.execute('ALTER TABLE profiles ENABLE ROW LEVEL SECURITY')

    # Create trigger function to automatically create profile when user signs up
    op.execute("""
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (id, email, name, created_at, updated_at)
            VALUES (
                new.id,
                new.email,
                COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
                now(),
                now()
            );
            RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)

    # Create trigger on auth.users (use CREATE OR REPLACE for idempotency)
    op.execute("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users")
    op.execute("""
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
    """)

    # Backfill profiles for existing users in auth.users
    op.execute("""
        INSERT INTO public.profiles (id, email, name, created_at, updated_at)
        SELECT
            id,
            email,
            COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name'),
            created_at,
            updated_at
        FROM auth.users
        ON CONFLICT (id) DO NOTHING
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop trigger and function
    op.execute('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users')
    op.execute('DROP FUNCTION IF EXISTS public.handle_new_user()')

    # Drop profiles table
    op.drop_index(op.f('ix_profiles_email'), table_name='profiles')
    op.drop_index(op.f('ix_profiles_id'), table_name='profiles')
    op.drop_table('profiles')

    # Recreate old users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
