import base64

from flask import Blueprint, Markup, render_template, flash, redirect, session, url_for, request, g, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app import app

from .models import *
import os, sys, time, datetime, io

from helpers import *

pilltakerbp = Blueprint('pilltaker', __name__)

home = "/home"


@pilltakerbp.route('/pilltaker', methods=['GET', 'POST'])
def pilltakerdef():
	if 'pillname' in request.form:
		name = request.form['pillname']
		add = request.form['additional']
		pt = Pilltaken(
			userid=current_user.id,
			datetime=datetime.datetime.now(),
			name=name,
			additional=add
		)
		dbputandcommit(pt)
	pills = Pilltaken.query.filter_by(userid=current_user.id)
	pills = sorted(pills, key=lambda p: p.datetime)
	types = {p.name:p.additional for p in pills}
	return render_template('pilltaker.html',pills=pills, types=types,
	                       title='Binst - Login')
# rootdir=rootdir)