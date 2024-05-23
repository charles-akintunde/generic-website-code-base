"""
Alembic configuration for database migrations.
This module sets up Alembic to use the application's SQLAlchemy models.
"""

from logging.config import fileConfig
from sqlalchemy import create_engine, engine_from_config, pool
from alembic import context
import os
import sys

# Ensure your app's root directory is in the system path
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'app')))

# Import your models here
from app.models.base import Base  # Use the correct base class
from app.models import user, team, application  # Import your models here

# This is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
fileConfig(config.config_file_name)

# Add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# Configure the database URL from the environment variable or alembic.ini
def get_url():
    return os.getenv("DATABASE_URL", config.get_main_option("sqlalchemy.url"))

def run_migrations_offline():
    """
    Run migrations in 'offline' mode.
    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well. By skipping the Engine creation
    we don't even need a DBAPI to be available.
    Calls to context.execute() here emit the given string to the script output.
    """
    url = get_url()
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """
    Run migrations in 'online' mode.
    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    configuration = config.get_section(config.config_ini_section)
    configuration['sqlalchemy.url'] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    
    url = get_url()
    if url:
        connectable = create_engine(url)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
