import os

WTF_CSRF_ENABLED = True
SECRET_KEY = 'THE PUGS ARE SERIOUSLY INVADING!'
ROOTDIR = '/public_html'
APPDIR = '/BINST/'
if True:
	APPDIR = '/app.cgi/'
ROOTDIR = ROOTDIR + APPDIR
BASEDIR = os.path.abspath(os.path.dirname(__file__))
SENDEMAILS = True
RUNNINGGUNICORN = False
POSTGRES = False

ONHEROKU = False
if os.environ.get('DATABASE_URL') is None:
	SQLALCHEMY_DATABASE_URI = ('sqlite:///' + os.path.join(BASEDIR, 'biiinstdata.db'))
	print(SQLALCHEMY_DATABASE_URI)
else:
	SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
	print("Using heroku database - {}".format(SQLALCHEMY_DATABASE_URI))
	ONHEROKU = True

if ONHEROKU:
	ROOTDIR = '/'
	APPDIR = ''
	ROOTDIR = ROOTDIR + APPDIR
	RUNNINGGUNICORN = True
	POSTGRES = True
	REDIS_URL = os.environ.get("REDIS_URL")
else:
	REDIS_URL = "redis://:@localhost:6379/0"

SQLALCHEMY_MIGRATE_REPO = os.path.join(BASEDIR,'db_repository')

UPLOAD_FOLDER = os.path.join(BASEDIR,'files')
MAX_CONTENT_PATH = 100000000

SEND_FILE_MAX_AGE_DEFAULT = 3600

# Email configuration
MAIL_SERVER = '127.0.0.1'
MAIL_PORT = 0
MAIL_USE_TLS = True
MAIL_USE_SSL = False
MAIL_USERNAME = ''
MAIL_PASSWORD = ''

# Administrators list
ADMINS = ['daimonsewell@gmail.com'] # Because you're worth it!


