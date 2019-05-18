from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
#from flask_socketio import SocketIO, emit
from flask_redis import FlaskRedis


app = Flask(__name__)
from flask_socketio import SocketIO, emit

#app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

app.debug = True
app.config.from_object('config')
rootdir=app.config['ROOTDIR']
appdir = app.config['APPDIR']
basedir = app.config['BASEDIR']
bsendemails = app.config['SENDEMAILS']
bgunicorn = app.config['RUNNINGGUNICORN']
bpostgres = app.config['POSTGRES']
bonheroku = app.config['ONHEROKU']
db = SQLAlchemy(app)
mail = Mail(app)

# Setup Redis
# If not using heroku, run redis from within the app
#if bonheroku and True:
#	REDIS_URL = "redis://:password@localhost:6379/0"
#else:
#	redis_store = FlaskRedis(app)


redis_store = FlaskRedis(app)
redis_store.set('potato',"[R] Redis is operational")
print(redis_store.get("potato"))
redislockKey = "NAVIGATOR_REDIS_LOCK"
redis_store.delete(redislockKey)
redis_store.flushall()
UseRedisLock = True


lm = LoginManager()
lm.init_app(app)
lm.login_view = '/login'

from app.WidgetClasses import *
BinstDataStructs = getDataStructures()

from app.betterinstagram import binst
from app.navengine import naveng
from app.NetLoop import netlp
app.register_blueprint(binst)
app.register_blueprint(netlp)
app.register_blueprint(naveng)


from app import views, models