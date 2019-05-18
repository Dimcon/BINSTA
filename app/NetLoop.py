import base64

from flask import Blueprint, Markup, render_template, flash, redirect, session, url_for, request, g, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app import app

from app.models import *
import os, sys, time, datetime, io

from helpers import *

from app.betterinstagram import *

from ClientSocketUpdater import *

from app import BinstDataStructs

from app import *
from helpers import *
import json
from Gridhelpers import *

netlp = Blueprint('netloop', __name__)

home = "/home"


@naveng.route('/netloop', methods=['GET', 'POST'])
def justForShow():
	pass

@socketio.on('NetSendData',namespace='/navengine')
def requestSetData(data):
	key = data["key"]
	value = data["value"]
	indexed = data["indexed"]
	indexed = str(indexed).lower()
	payloadID = data["payloadID"]
	updatedAt = datetime.datetime.now().isoformat()
	hashkey = "dataStore" + str(payloadID) + ":"
	# dbhset will store in Redis and then the DB
	dbhset(hashkey,key,value,indexed,updatedAt)
	print("Got connection")
	emit('NetDataRecieved', {'payloadID': payloadID,'key': key})


@socketio.on('NetCreateInstance', namespace='/navengine')
def requestCreate(data):
	type = data["instanceType"]
	appid = data["applicationID"]
	datalist = data["datalist"]
	instance = NetInstance()
	dbputandcommit(instance)
	hashkey = "dataStore" + str(appid) + ":" + str(instance.id) + ":"
	dbhset(hashkey, "instanceID", instance.id, "false", datetime.datetime.now().isoformat())
	dbhset(hashkey, "instanceType", type, "false", datetime.datetime.now().isoformat())
	for key in datalist:
		if not key[-8:] == ":indexed":
			indexed = key + ":indexed" in datalist and datalist[key + ":indexed"] == "true"
			if indexed:
				indexed = "true"
			else: indexed = "false"
			dbhset(hashkey, key, datalist[key], indexed, datetime.datetime.now().isoformat())
	hashdata = redis_store.hgetall(hashkey)
	emit('instanceCreated', {'instanceID': instance.id, 'applicationID': appid, 'instanceType':type,'hashdata': hashdata})

@socketio.on('NetGetFullHash', namespace='/navengine')
def requestGetData(data):
	# TODO: Needs to be updated to work with DB in case redis is down
	payloadID = data["payloadID"]
	hashkey = "dataStore" + str(payloadID) + ":"
	hashdata = dbhgetall(hashkey)
	emit('FullHashResult', {'payloadID': payloadID, 'data': hashdata})


@socketio.on('NetPollHashChanged', namespace='/navengine')
def PollForData(data):
	# TODO: Updated to work with DB in case redis is down
	lastPolledAt = data["lastPolledAt"]
	payloadID = data["payloadID"]
	hashkey = "dataStore" + str(payloadID) + ":"
	getRedisLock("Polling for Net data changed")
	try:
		lastupdatedAt = redis_store.hget(hashkey, "LastUpdatedAt")
		needsData = True
		if (lastupdatedAt is not None) and (not len(lastPolledAt) == 0):
			lastPolledAtd = datetimeFromIsoFormatString(lastPolledAt)
			lastupdatedAtd = datetimeFromIsoFormatString(lastupdatedAt)
			if (lastPolledAtd > lastupdatedAtd):
				needsData = False
		hashdata = ""
		newdata = False
		if needsData:
			hashdata = redis_store.hgetall(hashkey)
			newdata = True
	finally:
		releaseRedisLock()
	emit('NetPollResult', {'payloadID': payloadID,
	                       'newdata':newdata,
	                       'data': hashdata,
	                       'lastPolledAt':datetime.datetime.now().isoformat()})

