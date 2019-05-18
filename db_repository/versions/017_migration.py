from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
coordinate = Table('coordinate', pre_meta,
    Column('id', BIGINT, primary_key=True, nullable=False),
    Column('backreftype', INTEGER),
    Column('backrefid', INTEGER),
    Column('coords', VARCHAR(length=1024)),
    Column('squaresize', VARCHAR(length=1024)),
    Column('grididnum', INTEGER),
)

coordinate = Table('coordinate', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('backreftype', Integer),
    Column('backrefid', Integer),
    Column('coords', String(length=1024)),
    Column('squaresize', String(length=1024)),
    Column('gridid', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['coordinate'].columns['grididnum'].drop()
    post_meta.tables['coordinate'].columns['gridid'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['coordinate'].columns['grididnum'].create()
    post_meta.tables['coordinate'].columns['gridid'].drop()
