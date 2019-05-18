from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
accessgrant = Table('accessgrant', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('userlist', Text),
    Column('backreftype', Integer),
    Column('backrefid', Integer),
)

radialfence = Table('radialfence', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('userid', Integer),
    Column('coordid', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['accessgrant'].create()
    post_meta.tables['radialfence'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['accessgrant'].drop()
    post_meta.tables['radialfence'].drop()
