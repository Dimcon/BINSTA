from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
connections = Table('connections', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('user1id', INTEGER),
    Column('user2id', INTEGER),
    Column('connectiontype', INTEGER),
)

connection = Table('connection', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('user1id', Integer),
    Column('user2id', Integer),
    Column('connectiontype', Integer),
)

seen = Table('seen', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('userid', Integer),
    Column('itemid', Integer),
    Column('itemtype', Integer),
)

post = Table('post', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('userid', Integer),
    Column('details', String(length=128)),
    Column('posttype', Integer),
    Column('dataid', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['connections'].drop()
    post_meta.tables['connection'].create()
    post_meta.tables['seen'].create()
    post_meta.tables['post'].columns['dataid'].create()
    post_meta.tables['post'].columns['posttype'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['connections'].create()
    post_meta.tables['connection'].drop()
    post_meta.tables['seen'].drop()
    post_meta.tables['post'].columns['dataid'].drop()
    post_meta.tables['post'].columns['posttype'].drop()
