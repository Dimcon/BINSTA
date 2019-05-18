from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
coordinate = Table('coordinate', post_meta,
    Column('id', BigInteger, primary_key=True, nullable=False),
    Column('backreftype', Integer),
    Column('backrefid', Integer),
    Column('coords', String(length=1024)),
    Column('gridid', BigInteger),
)

fence = Table('fence', post_meta,
    Column('id', BigInteger, primary_key=True, nullable=False),
    Column('coordlist', Text),
)

grid = Table('grid', post_meta,
    Column('id', BigInteger, primary_key=True, nullable=False),
    Column('gridlevel', Integer),
    Column('gridx', Integer),
    Column('gridy', Integer),
    Column('gridid', Integer),
)

profileblock = Table('profileblock', post_meta,
    Column('id', BigInteger, primary_key=True, nullable=False),
    Column('userid', Integer),
    Column('coordid', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['coordinate'].create()
    post_meta.tables['fence'].create()
    post_meta.tables['grid'].create()
    post_meta.tables['profileblock'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['coordinate'].drop()
    post_meta.tables['fence'].drop()
    post_meta.tables['grid'].drop()
    post_meta.tables['profileblock'].drop()
