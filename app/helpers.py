import base64

from flask import Blueprint, Markup, render_template, flash, redirect, session, url_for, request, g, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app import *
from app import db
from app.models import *
import os, sys, time, datetime, io


#def datetimeFromString(inputString):
#	return datetime.datetime.strptime(inputString.split(".")[0], '%Y-%m-%dT%H:%M:%S')


def datetimeFromIsoFormatString(inputString):
	return datetime.datetime.strptime(inputString.split(".")[0], '%Y-%m-%dT%H:%M:%S')


def query(database):
	return db.session.query(database)

def dbget(table, **kwargs):
	data = table.query.filter_by(**kwargs).first()
	if data is not None:
		return data
	else:
		args = ', '.join(['{}={!r}'.format(k, v) for k, v in kwargs.items()])
		soutd("Data error @Table: {} @Query: {}".format(table,args))
		return data

def dbgetlist(table, **kwargs):
	data = table.query.filter_by(**kwargs).all()
	if data is not None:
		return data
	else:
		args = ', '.join(['{}={!r}'.format(k, v) for k, v in kwargs.items()])
		soutd("Data error @Table: {} @Query: {}".format(table,args),1)
		return data

def dbputandcommit(item):
	db.session.add(item)
	db.session.commit()

def dbput(item):
	db.session.add(item)

def dbcommit():
	db.session.commit()


import time


def getRedisLock(reason):
	# TODO: Pretty sure there is a better way to lock redis?
	#       Is it atomic by default? Needs to be checked.
	if len(reason) == 0:
		reason = "Generic"
	if UseRedisLock:
		while (redis_store.exists(redislockKey)):
			print("REDIS LOCK CONTENTION")
			time.sleep(.100)
		redis_store.set(redislockKey, "Locked inside " + str(reason))


def releaseRedisLock():
	redis_store.delete(redislockKey)

def dbhset(hashkey, key, value, indexed, TimeUpdatedAt):
	getRedisLock("Setting Net Keys")
	hash = dbget(Datahash, hashkey=hashkey)
	if hash is None:
		hash = Datahash(hashkey=hashkey)
		dbput(hash)
	try:
		#MAKE SURE TO Ensure that a whole hash exists at a time. Otherwise redis will
		#	only pull last updated value from redis and not even look at DB
		exists = redis_store.hexists(hashkey,key)
		if not exists:
			dbvals = dbgetlist(Kvpair, hashid=hash.id)
			for item in dbvals:
				redis_store.hset(hashkey, item.key, unicode(item.value))
				if item.indexed == 1:
					redis_store.hset(hashkey, item.key + ":indexed", "true")
				else:
					redis_store.hset(hashkey, item.key + ":indexed", "false")
		redis_store.hset(hashkey, key, unicode(value))
		redis_store.hset(hashkey, key + ":indexed", unicode(indexed))
		redis_store.hset(hashkey, "LastUpdatedAt", TimeUpdatedAt)
	finally:
		releaseRedisLock()
	hash.lastupdatedAt = TimeUpdatedAt
	kvpair = dbget(Kvpair, hashid=hash.id, key=key)
	if kvpair is not None:
		kvpair.value = value
	else:
		kvpair = Kvpair(hashid=hash.id,
		                key=key,
		                value=value,
		                indexed=1 if indexed == "true" else 0)
		dbput(kvpair)
	dbcommit()


def dbhget(hashkey, key):
	# Check if redis has key. If not then use DB
	hash = dbget(Datahash, hashkey=hashkey)
	getRedisLock("Getting key")
	val = None
	if hash is None:
		return None
	try:
		exists = redis_store.hexists(hashkey,key)
		if exists:
			val = redis_store.hget(hashkey,key)
	finally:
		releaseRedisLock()
	if val is None:
		kvpair = dbget(Kvpair, hashid=hash.id, key=key)
		if kvpair is None:
			return None
		val = kvpair.value
	return val

def dbhdelete(hashkey):
	hash = dbget(Datahash, hashkey=hashkey)
	db.session.delete(hash)
	db.session.commit()
	exists = redis_store.exists(hashkey)
	if exists:
		redis_store.delete(hashkey)

def dbhgetall(hashkey):
	# TODO: Are these not meant to resort to DB as a last effort and redis as a first?
	hash = dbget(Datahash, hashkey=hashkey)
	getRedisLock("Getting key")
	vals = {}
	if hash is None:
		return None
	try:
		exists = redis_store.exists(hashkey)
		if exists:
			vals = redis_store.hgetall(hashkey)
	finally:
		releaseRedisLock()
	if len(vals) == 0:
		dbvals = dbgetlist(Kvpair,hashid=hash.id)
		for val in dbvals:
			vals[val.key] = val.value
			vals[val.key + ":indexed"] = val.indexed == 1
	return vals


class emp(object):
	pass


def sout(output):
	if bgunicorn:
		print(output)
	else:
		sys.stderr.write(output)
		sys.stderr.write("\n")


def setDebugLevel(debuglevel):
	session['debug_level'] = debuglevel


def checkpoint(valuenum=-1):
	value = '''LMS-[CHECKPOINT-- ''' + str(valuenum) + ''' --]
	YOU NEED TO REMOVE THESE CHECKPOINT CALLS BECAUSE THEY ARE EXPLICITLY FOR
	DEBUGGING PURPOSES AND SHOULD NOT SHOW UP IN PRODUCTION CODE. THIS IS HERE SOLELY FOR LOOP
	AND FUNCTION CHECKS AND YOU ABSOLUTELY HAVE TO REMOVE THIS OUTPUT MESSAGE
	'''
	sout(value)


def soutd(output, debuglevelP=5):
	#if 'debug_level' in session:
	#	debuglevel = int(session['debug_level'])
	#else:
	debuglevel = 5
	prepends = ["", "LMS-[Error] ", "LMS-[Status] ", "LMS-[V] ", "LMS-[VV] ", "LMS-[>] "]
	output = str(prepends[debuglevelP]) + str(output)
	if debuglevelP <= debuglevel:
		if bgunicorn:
			print(output)
		else:
			sys.stderr.write(output)
			sys.stderr.write("\n")

# 5 = Step by step function logs
# 4 = Very Verbose logs
# 3 = Verbose logs
# 2 = Status logs
# 1 = Error logs
# 0 = Nothing... no output




def emailToAdmins(Subject, Data, TextData):
	admins = User.query.filter_by(userlevel=0).all()
	emails = [admin.email for admin in admins]
	send_binstmail(Subject, emails, TextData, Data)


def send_email(subject, sender, recipients, text_body, html_body):
	msg = Message(subject, sender=sender, recipients=recipients)
	msg.body = text_body
	msg.html = html_body
	if bsendemails:
		mail.send(msg)
	else:
		sout("Emails are disabled in config.py - Request to send:")
		sout(html_body)
		sout("To {}".format(recipients))


def sendWithAttachment(subject, sender, recipients, text_body, html_body, filename, filedata):
	msg = Message(subject, sender=sender, recipients=recipients)
	msg.body = text_body
	msg.html = html_body
	msg.attach(filename, 'application/pdf', filedata)
	if app.config['SENDEMAILS']:
		mail.send(msg)


def sendLMSMailWithAttachment(subject, recipients, text_body, html_body, filename, filedata):
	sendWithAttachment(subject, 'WEARETHEPEOPLE@Binst.com', recipients, text_body, html_body, filename, filedata)


def reqemaildata(bruid):
	Bruce = User.query.filter_by(id=bruid).first()
	data = Markup('''''')
	return data


def send_binstmail(subject, recipients, text_body, html_body):
	send_email(subject, 'WEARETHEPEOPLE@Binst.com', recipients, text_body, html_body)


def cleanuser(user):
	if user.userident is None: user.userident = ""
	if user.email is None: user.email = ""
	if user.name is None: user.name = ""
	if user.middlename is None: user.middlename = ""
	if user.lastname is None: user.lastname = ""
	if user.password is None: user.password = ""


def sendNewUserEmail(userid):
	admins = User.query.filter_by(userlevel=0).all()
	user = User.query.filter_by(id=userid).first()
	cleanuser(user)
	data = ''' '''
	emails = [admin.email for admin in admins]
	textdata = ''''''
	send_binstmail("BINST - You're new, aren't you?", emails, textdata, data)

#def getFileFromForm(form):
#	image = form['file']
#	if image:
#		imgdata = base64.b64decode(image[image.find("base64,") + 7:])  # TODO: setting the offset to 23 is going to fail for extensions shorter or longer than 4 chars
#		return imgdata
#	return None


def getBinaryFromBase64(inputAsBase64):
	file = inputAsBase64
	if file:
		truncedimage = file[file.find("base64,") + 7:]
		filebinary = base64.b64decode(truncedimage)  # TODO: setting the offset to 23 is going to fail for extensions shorter or longer than 4 chars
		return filebinary
	return None


def getResizedImageBase64ToBinary(imageAsBase64, maxWidth, maxheight):
	# Returns Byte array
	from PIL import Image
	from io import BytesIO
	imagedata = getBinaryFromBase64(imageAsBase64)
	im = Image.open(BytesIO(imagedata))
	width, height = im.width, im.height
	imgscale = 1.00

	if width > maxWidth:
		imgscale = float(maxWidth) / float(width)
	if height * imgscale > maxheight:
		imgscale = float(maxheight) / float(height)

	newimage = im.resize((int(imgscale * width), int(imgscale * height)), box=None)

	imgByteArr = io.BytesIO()
	newimage.save(imgByteArr, format='PNG')
	imgByteArr = imgByteArr.getvalue()
	return imgByteArr

def getResizedImageBinary(imageAsBinary,maxWidth, maxheight):
	# Returns Byte array
	from PIL import Image
	from io import BytesIO
	imagedata = imageAsBinary #GetBytesFromBase64(imageAsBase64)
	im = Image.open(BytesIO(imagedata))
	width, height = im.width, im.height
	imgscale = 1.00

	if width > maxWidth:
		imgscale = float(maxWidth) / float(width)
	if height * imgscale > maxheight:
		imgscale = float(maxheight) / float(height)

	newimage = im.resize((int(imgscale * width), int(imgscale * height)), box=None)

	imgByteArr = io.BytesIO()
	newimage.save(imgByteArr, format='PNG')
	imgByteArr = imgByteArr.getvalue()
	return imgByteArr



sout("[i] The helpers are helping. Confirmed.")