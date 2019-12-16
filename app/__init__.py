
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_redis import FlaskRedis
from passlib.context import CryptContext
import jinja2

app = Flask(__name__)
from flask_socketio import SocketIO, emit

#app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

app.debug = True

app.appName = "BINSTA"
app.globalContext = dict(
	nicesize="col-xl-3 col-lg-4 col-md-6 col-sm-12",
	ns={
		'half': "col-xl-5 col-lg-5 col-md-6 col-sm-12",
		'third': "col-xl-4 col-lg-4 col-md-12 col-sm-12"
	},
	rootdir="",
	appName="BINSTA",
	logosrc="static/",
	siteRoot="http://binsta.herokuapp.com/",
	longAppName="BINSTA",
	copywrite="Copyright &copy; 2019 - Daimon Sewell"
)

app.config.from_object('config')
rootdir=app.config['ROOTDIR']
appdir = app.config['APPDIR']
basedir = app.config['BASEDIR']
bsendemails = app.config['SENDEMAILS']
bgunicorn = app.config['RUNNINGGUNICORN']
bpostgres = app.config['POSTGRES']
bonheroku = app.config['ONHEROKU']
if not bonheroku:
	app.globalContext['siteRoot'] = "http://127.0.0.1:8080/"
db = SQLAlchemy(app)
mail = Mail(app)

pwd_context = CryptContext(
	# Replace this list with the hash(es) you wish to support.
	# Set pbkdf2_sha256 as the default,
	# with additional support for reading legacy des_crypt hashes.
	schemes=["pbkdf2_sha256", "des_crypt"],
	
	# Automatically mark all but first hasher in list as deprecated.
	# (this will be the default in Passlib 2.0)
	deprecated="auto",
	
	# Optionally, set the number of rounds that should be used.
	# Appropriate values may vary for different schemes,
	# and the amount of time you wish it to take.
	# Leaving this alone is usually safe, and will use passlib's defaults.
	## pbkdf2_sha256__rounds = 29000,
)

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
from app.Comms import comms
from app.pilltaker import pilltakerbp
from app.NLWHandlers import nlwhandlers

myviews = [
	betterinstagram.binst,
	navengine.naveng,
	NetLoop.netlp,
	Comms.comms,
	pilltaker.pilltakerbp,
	NLWHandlers.nlwhandlers,
]

blueprintfolders = [app.jinja_loader]

for v in myviews:
	app.register_blueprint(v)
	# Cheap way to get the folder for templates within modules
	folder = v.import_name.replace('.', '/') + '/templates'
	print(folder)
	blueprintfolders.append(jinja2.FileSystemLoader(folder))

my_loader = jinja2.ChoiceLoader(blueprintfolders)
app.jinja_loader = my_loader


from app import views, models