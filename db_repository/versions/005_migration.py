from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
files = Table('files', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('details', VARCHAR(length=128)),
    Column('file', BLOB),
)

file = Table('file', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('details', String(length=128)),
    Column('file', LargeBinary),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['files'].drop()
    post_meta.tables['file'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['files'].create()
    post_meta.tables['file'].drop()
