web: gunicorn --preload -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 --log-file - --error-logfile - --log-level debug app:app
init: python db_create.py
upgrade: python db_upgrade.py
populate: python populatedatabase.py
debug: export FLASK_DEBUG=1
udebug: export FLASK_DEBUG=0