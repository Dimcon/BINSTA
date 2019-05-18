from flask import Markup, render_template, flash, redirect, session, send_from_directory, url_for, request, g, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app import app, rootdir, appdir, db, lm, mail
from .models import User
import os, sys, time, datetime, io
from werkzeug.utils import secure_filename
from flask_mail import Message

from flask_weasyprint import HTML, render_pdf

import ftplib

##############################  Index
@app.route('/')
@app.route('/index')
@login_required
def index():
	return redirect('/home')
#########################################

############################    Sign out
@app.route('/logout')
@login_required
def logout():
	logout_user()
	flash('Goodbye cruel world.')
	return redirect('/login')
##########################################

###################################   Login manager functions
@app.before_request
def before_request():
	g.user = current_user

	#if g.user is None:
		#return redirect('{}home'.format(rootdir))

@lm.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))
#####################################################

