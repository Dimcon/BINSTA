from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
positionhistory = Table('positionhistory', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('backreftype', Integer),
    Column('backrefid', Integer),
    Column('backrefid2', Integer),
    Column('positiontrack', Text),
    Column('latestpos', String(length=1024)),
    Column('time', DateTime),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['positionhistory'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['positionhistory'].drop()
