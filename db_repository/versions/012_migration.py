from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
grid = Table('grid', pre_meta,
    Column('id', BIGINT, primary_key=True, nullable=False),
    Column('gridlevel', INTEGER),
    Column('gridx', INTEGER),
    Column('gridy', INTEGER),
    Column('gridid', INTEGER),
)

grid = Table('grid', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('gridlevel', Integer),
    Column('gridx', Integer),
    Column('gridy', Integer),
    Column('gridmoreid', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['grid'].columns['gridid'].drop()
    post_meta.tables['grid'].columns['gridmoreid'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['grid'].columns['gridid'].create()
    post_meta.tables['grid'].columns['gridmoreid'].drop()
