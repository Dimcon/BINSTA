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

#################################   main navigator page
@comms.route('/loadcomms',methods=['GET','POST'])
def LoadComms():
	return render_template("Comms.html")

profanityWordsAndReplacements = {
	"fuck":"fudge",
	"shit":"salmon",
	"ass":"aunt"
}
def profanityCheck(sinput):
	for word in profanityWordsAndReplacements:
		if word in sinput:
			sinput.replace(word,profanityWordsAndReplacements[word])
	from profanity import profanity
	sinput = profanity.censor(sinput)
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


@socketio.on('CommsInit', namespace='/navengine')
def ChatInit(data):
	convos = Userxconversation.query\
		.filter_by(userid=current_user.id,joinstatus="1")\
		.order_by(Userxconversation.userjoindate.desc())\
		.all()
	#TODO: Need to make this return a limited amount of messages on first load.
	data = {}
	data['convos'] = getMessagesAndUsersFromConvos(convos)
	data['friends'] = getUsersFriendListDict()
	emit('CommsInitResult', data)
	# Return data in socket push


def getUsersFriendListDict():
	friends = User.query.filter(((Connection.user1id == current_user.id)
								& (Connection.user2id == User.id))
								| ((Connection.user2id == current_user.id)
								& (Connection.user1id == User.id))
								& (User.id != current_user.id))\
				.all()
	newlist = []
	for f in friends:
		if f.id == current_user.id:
			continue
		nf = addPersonToUser(f)
		newlist.append({
					'name': nf.name,
					'email': nf.email,
					'isonline': nf.isonline,
					'typinginconvoid': nf.typinginconvoid,
					'profileimageid': nf.profileimageid
				})
	return newlist

def getMessagesAndUsersFromConvos(convos, userlist="-1"):
	resultConvos = []
	if userlist == "-1":
		userlist = []
	for convo in convos:
		converse = dbget(Conversation, id=convo.conversationid)
		c = {}
		c['name'] = converse.name
		c['privacy'] = converse.privacy
		c['id'] = converse.id
		c['profileimageid'] = converse.profileimageid
		tmpusers = query(User).filter((Userxconversation.conversationid == convo.conversationid) \
									  & (User.id == Userxconversation.userid)).all()
		users = []
		cusers = []
		for u in tmpusers:
			u = addPersonToUser(u)
			if not u.id == current_user.id:
				cusers.append({
					'name': u.name,
					'email': u.email,
					'isonline': u.isonline,
					'typinginconvoid': u.typinginconvoid,
					'profileimageid': u.profileimageid
				})
			users.append(u)
		userlist.extend(users)
		c['users'] = cusers
		messages = Cmessage.query \
			.filter((Cmessage.conversationid == converse.id)) \
			.order_by(Cmessage.time.asc()) \
			.all()
		c['messages'] = []
		for m in messages:
			msg = {
				"fromuserid": m.fromuserid,
				"time": str(m.time),
				"fileids": m.fileids,
				"sentlist": m.sentlist,
				"recievedlist": m.recievedlist,
				"message": m.message
			}
			user = next(user for user in users if user.id == m.fromuserid)
			if user is None:
				soutd("Comms.py: PollUpdates: Message has user that wasn't caught by users query."
					  + " This has caused an unexpected SQL query: Performance--", 1)
				user = dbget(User, id=m.fromuserid)
			msg['useremail'] = user.email
			msg['username'] = user.name
			c['messages'].append(msg)
		resultConvos.append(c)
	return resultConvos

@socketio.on('CommsPoll', namespace='/navengine')
def CommsPoll(data):
	lastUpdateTime = data['LastUpdateTime']
	if lastUpdateTime == "undefined":
		return

	soutd(float(lastUpdateTime),3)
	if float(lastUpdateTime) == 0:
		dt = datetime.datetime.now()
	else:
		dt = datetime.datetime.fromtimestamp(float(lastUpdateTime))
	soutd(dt,4)
	timestamp = (datetime.datetime.now() - datetime.datetime(1970, 1, 1)).total_seconds()
	soutd(timestamp, 4)
	data = {
		"UpdatedAt":timestamp
	}
	convos = Userxconversation.query\
		.filter((Userxconversation.userid == current_user.id)\
		& (Userxconversation.userjoindate >= dt))\
		.order_by(Userxconversation.userjoindate.desc()).all()
	data['convos'] = getMessagesAndUsersFromConvos(convos)
	newMessages = Cmessage.query\
		.filter((Userxconversation.userid == current_user.id)
				& (Cmessage.conversationid == Userxconversation.conversationid)
				& (Cmessage.time >= dt))\
		.all()
	users = User.query\
		.filter((Userxconversation.userid == current_user.id)
				& (Cmessage.conversationid == Userxconversation.conversationid)
				& (Cmessage.time >= dt)
				& (User.id == Cmessage.fromuserid))\
		.all()
	messages = []
	for m in newMessages:
		msg = {
			"convoid": m.conversationid,
			"fromuserid": m.fromuserid,
			"time": str(m.time),
			"fileids": m.fileids,
			"sentlist": m.sentlist,
			"recievedlist": m.recievedlist,
			"message": m.message
		}
		user = next(user for user in users if user.id == m.fromuserid)
		if user is None:
			soutd("Comms.py: PollUpdates: Message has user that wasn't caught by users query."
				  + " This has caused an unexpected SQL query: Performance--", 1)
			user = dbget(User, id=m.fromuserid)
		msg['useremail'] = user.email
		msg['username'] = user.name
		messages.append(msg)

	data["NewMessages"] = messages
	emit('CommsPollResult', data)

@socketio.on('NewConvo', namespace='/navengine')
def createNewConvo(data):
	# Expects: data[ParticipantEmails[]: , Name: Name of conversation]
	conn = Conversation(
		name=profanityCheck(data["name"]),
		privacy=1,
		profileimageid=0,
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
	if 'users' in data:
		data = {
			'users': data['users'],
			'convoid': conn.id
		}
		AddUsers(data)
		emit('NewConvoWithUserAdded', {'convoid':conn.id})

def deleteMessage(message):
	db.session.delete(message)
	#TODO: need to add checking for linked files etc

@socketio.on('LeaveConvo', namespace='/navengine')
def LeaveConvo(data):
	convoid = data["convoid"]
	uxc = dbget(Userxconversation,userid=current_user.id,conversationid=convoid)
	uxc.joinstatus = "Left;" + str(datetime.datetime.now())
	dbcommit()

	convo = dbget(Conversation, id=convoid)
	uxcs = dbgetlist(Userxconversation,conversationid=convoid)
	stillthere = False
	for ux in uxcs:
		if ux.joinstatus == 1:
			stillthere = True
	if not stillthere:
		msgs = dbgetlist(Cmessage,conversationid=convoid)
		for m in msgs:
			deleteMessage(m)
		for ux in uxcs:
			db.session.delete(ux)
		db.session.delete(convo)

def getConvoPermission(user,convoid):
	uxc = dbget(Userxconversation, userid=user.id, conversationid=convoid)
	if uxc is None:
		raise Exception("Comms.py, hasChangedConvoAccess: invalid parameters, UXC is null")
	return uxc.userrights

def hasFullConvoAccess(User,convoid):
	return getConvoPermission(User,convoid) != 0

def hasPeopleAndMessageDeleteAccess(User,convoid):
	return getConvoPermission(User, convoid) != 1

def hasChangeConvoAccess(User,convoid):
	return getConvoPermission(User, convoid) != 2

def getUserEmailssFromConvo(convoid):
	uxcs = dbgetlist(Userxconversation,conversationid=int(convoid))
	usrs = []
	for u in uxcs:
		usr = dbget(User,id=u.userid)
		if usr is not None:
			usrs.append(usr.email)
	return usrs

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
	if not hasPeopleAndMessageDeleteAccess(current_user,convoid):
		return
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
	usrs = data["users"]
	convoid = data["convoid"]
	if not hasPeopleAndMessageDeleteAccess(current_user,convoid):
		return
	for p in usrs:
		user = dbget(User, email=p)
		if user is not None:
			uxc = dbget(Userxconversation, userid=user.id,conversationid=convoid)
			if uxc is not None:
				db.session.delete()
	dbcommit()


# TODO: Fill in Convo link and report functionality
@socketio.on('GetConvoLink', namespace='/navengine')
def GetConvoLink(data):
	pass

@socketio.on('JoinConvoViaLink', namespace='/navengine')
def JoinConvoViaLink(data):
	pass


@socketio.on('ReportConvo', namespace='/navengine')
def ReportConvo(data):
	pass