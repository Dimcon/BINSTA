#!./flask/bin/python


from app import app, socketio

socketio.run(app,host="127.0.0.1",port=8080,use_reloader=False)
#app.run()
#from waitress import serve
#serve(app)

#from flask import Flask, render_template


