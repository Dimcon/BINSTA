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

comms = Blueprint('comm', __name__)

home = "/home"

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


profanityWordsAndReplacements = {
	"fuck":"fudge",
	"shit":"salmon",
	"ass":"aunt"

}
def profanityCheck(sinput):
	for word in profanityWordsAndReplacements:
		if word in sinput:
			sinput.replace(word,profanityWordsAndReplacements[word])
	return sinput

#       Conversation
#               ConvoName
#
#       UserxConversation
#               User
#               Convo
#               UserRights (Add/remove, ChangeName etc)
#
#       CMessage
#               convoID
#               UserID
#               TimeStamp
#               FileIDs (If file attached)
#               SentToList (People that this message must be sent to)
#               RecievedList (People that this message has been recieved by)
#


@socketio.on('PollUpdates', namespace='/navengine')
def PollUpdates(data):
	pass

@socketio.on('NewConvo', namespace='/navengine')
def createNewConvo(data):
	# Expects: data[ParticipantEmails[]: , Name: Name of conversation]
	conn = Conversation(
		name=profanityCheck(data["Name"]),
		privacy=1
	)
	dbputandcommit(conn)
	uxc = Userxconversation(
		userid=current_user.id,
		conversationid=conn.id,
		joinstatus=1,
		userrights=0,
		userjoindate=datetime.datetime.now()
	)
	dbput(uxc)
	dbcommit()

@socketio.on('LeaveConvo', namespace='/navengine')
def LeaveConvo(data):
	convoid = data["convoid"]
	uxc = dbget(Userxconversation,userid=current_user.id,conversationid=convoid)
	uxc.joinstatus = "Left;" + str(datetime.datetime.now())
	dbcommit()
	pass

def getUserEmailssFromConvo(convoid):
	uxcs = dbgetlist(Userxconversation,convoid=int(convoid))
	usrs = []
	for u in uxcs:
		usr = dbget(User,id=u.userid)
		if usr is not None:
			usrs.append(usr.email)

@socketio.on('SendMessage', namespace='/navengine')
def SendMessage(data):
	convoid = int(data["convoid"])
	cmsg = Cmessage(
		conversationid=convoid,
		fromuserid=current_user.id,
		time=datetime.datetime.now(),
		fileids="",
		sentlist=";".join(getUserEmailssFromConvo(convoid)),
		recievedlist="",
		message=data["msg"]
	)
	dbputandcommit(cmsg)

@socketio.on('AddUsers', namespace='/navengine')
def AddUsers(data):
	usrs = data["users"]
	convoid = data["convoid"]
	for p in usrs:
		user = dbget(User, email=p)
		if user is not None:
			uxc = Userxconversation(
				userid=user.id,
				conversationid=convoid,
				joinstatus=1,
				userrights=1,
				userjoindate=datetime.datetime.now()
			)
			dbput(uxc)
	dbcommit()

@socketio.on('RemoveUsers', namespace='/navengine')
def RemoveUsers(data):
	pass

@socketio.on('GetConvoLink', namespace='/navengine')
def GetConvoLink(data):
	pass

@socketio.on('JoinConvoViaLink', namespace='/navengine')
def createNewConvo(data):
	pass


@socketio.on('ReportConvo', namespace='/navengine')
def ReportConvo(data):
	pass