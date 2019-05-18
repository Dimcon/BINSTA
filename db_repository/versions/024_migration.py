from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
datahash = Table('datahash', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('hashkey', Text),
    Column('lastupdatedAt', Text),
)

kvpair = Table('kvpair', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('hashid', Integer),
    Column('key', Text),
    Column('value', Text),
    Column('indexed', Integer),
)

net_instance = Table('net_instance', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('hashkey', Text),
    Column('coordid', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['datahash'].create()
    post_meta.tables['kvpair'].create()
    post_meta.tables['net_instance'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['datahash'].drop()
    post_meta.tables['kvpair'].drop()
    post_meta.tables['net_instance'].drop()
