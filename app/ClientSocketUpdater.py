import threading, time, datetime, math
from flask import jsonify
import flask
from app import *
from app.betterinstagram import *
from helpers import *
import json
from Gridhelpers import *

def pushPositionUpdateToRedis(sItemType,position,size,Coordinateid,itemid,updateDetails,Data1,Data2):
	# TODO: This needs to be updated to include the time of the event:
	#       To be used for event relevance culling so as to prevent
	#       Redis overloading
	data = {
	        'posx':                 position[0],
		'posy':                 position[1],
		'sizex':                size[0],
		'sizey':                size[1],
		'sItemType':            sItemType,
		'itemid':               itemid,
		'Coordinateid':         Coordinateid,
		'updateDetails':        updateDetails,
		'Data1':                Data1,
		'Data2':                Data2
	}
	datastring = json.dumps(data)
	positionKey = "{}:{}".format(position[0],position[1])
	block = getBlockCoords(position,1000)
	HashKey = "BlockData:{}:{}".format(block[0],block[1])
	getRedisLock("pushPositionUpdateToRedis")
	# Try to set if key doesn't exist
	if not redis_store.hsetnx(HashKey,positionKey,json.dumps([datastring])):
		# if key exists, we need to append our string to the list.
		# TODO: Redis: This is O(N), needs fixing
		ListOfUpdates = json.loads(redis_store.hget(HashKey,positionKey))
		ListOfUpdates.append(datastring)
		redis_store.hset(HashKey,positionKey,json.dumps(ListOfUpdates))
	# Update time of writing so users know when to update
	BlockSummary = redis_store.hget(HashKey,"Block:Summary")
	blockdict = {}
	if BlockSummary is not None:
		blockdict = json.loads(BlockSummary)
	blockdict[positionKey] = datetime.datetime.now().isoformat()
	redis_store.hset(HashKey, "Block:Summary", json.dumps(blockdict))
	redis_store.hset(HashKey, "Block:LastUpdate", datetime.datetime.now().isoformat())
	releaseRedisLock()


def pushFeedUpdate(position,zoom,action,message,updateimageURL,RelUser):
	profileimage = Profileimagexuser.query.filter_by(userid=RelUser.id).first()
	if profileimage is not None:
		profileimageid = profileimage.fileid
	else:
		profileimageid = 0
	data = {
		'time': datetime.datetime.now().isoformat(),
		'posx': position[0],
		'posy': position[1],
		'ZoomTo': zoom,
		'action': action,
		'message': message,
		'updateImageid': updateimageURL,
		'relUserEmail': RelUser.email,
		'relUserName': RelUser.name,
		'relUserImageID': profileimageid
	}
	friends = getfriends(current_user.id)
	for f in friends:
		pushUpdateToUser(data,f)
	
def pushUpdateToUser(data, user):
	getRedisLock("pushFeedUpdateToRedis")
	try:
		userkey = "User:Summary:{}".format(user.email)
		UserUpdates = redis_store.hget(userkey, 'UserUpdates')
		if not UserUpdates or len(UserUpdates) == 0:
			newsummary = createNewUserSummary(user.email)
			redis_store.hmset(userkey, newsummary)
			UserUpdates = redis_store.hget(userkey, 'UserUpdates')
		if len(UserUpdates) > 0:
			userupdates = json.loads(UserUpdates)
		else:
			userupdates = []
		userupdates.append(data)
		redis_store.hset(userkey, 'UserUpdates', json.dumps(userupdates))
	finally:
		releaseRedisLock()

def getFeedUpdates():
	userkey = "User:Summary:{}".format(current_user.email)
	userupdates = redis_store.hget(userkey, 'UserUpdates')
	updates = []
	if not len(userupdates) == 0:
		updates = json.loads(userupdates)
	#TODO: Add remove mechanism for old updates
	# TODO: Add priority system
	return updates




def updateUserPositionTrack(email, posx,posy,zoom):
	getRedisLock("pushPositionUpdateToRedis")
	try:
		userkey = "User:Summary:{}".format(email)
		usersummary = redis_store.hgetall(userkey)
		if len(usersummary) == 0:
			newsummary = createNewUserSummary(email)
			newsummary["PositionTrack"] = "{}:{}:{}".format(posx,posy,zoom)
			newsummary["LastSeenPosition"] = "{};{};{}".format(posx, posy, zoom)
			redis_store.hmset(userkey, newsummary)
		else:
			usersummary["PositionTrack"] += ";{}:{}:{}".format(posx,posy,zoom)
			usersummary["LastSeenPosition"] = "{};{};{}".format(posx, posy, zoom)
			redis_store.hset(userkey, "PositionTrack", usersummary["PositionTrack"])
			redis_store.hset(userkey, "LastSeenPosition", usersummary["LastSeenPosition"])
	finally:releaseRedisLock()

def getUserLastUpdateCheckedTime(email):
	getRedisLock("getUserLastUpdateCheckedTime")
	try:
		userkey = "User:Summary:{}".format(email)
		usersummary = redis_store.hgetall(userkey)
		if len(usersummary) == 0:
			newsummary = createNewUserSummary(email)
			redis_store.hmset(userkey, newsummary)
			usersummary = newsummary
	finally:releaseRedisLock()
	return datetimeFromIsoFormatString(usersummary["LastCheckedUpdatesAt"])

def setUserLastUpdateCheckedTime(email,newDate):
	getRedisLock("pushPositionUpdateToRedis")
	try:
		userkey = "User:Summary:{}".format(email)
		usersummary = redis_store.hgetall(userkey)
		if len(usersummary) == 0:
			newsummary = createNewUserSummary(email)
			newsummary["LastCheckedUpdatesAt"] = newDate
			redis_store.hmset(userkey,newsummary)
		else:
			lastCheckedDate = datetimeFromIsoFormatString(usersummary["LastUpdatedPositionAt"])
			redis_store.hset(userkey,"LastCheckedUpdatesAt",newDate)
			timedeltatmp = datetime.datetime.now() - lastCheckedDate
			if timedeltatmp.seconds > 5:
				pos = usersummary["LastSeenPosition"]
				posTrack = usersummary["PositionTrack"]
				# pos = "X;Y;Zoom"
				# Don't need to change the string at all.
				start_date = datetime.datetime.now() + datetime.timedelta(-30)
				Positionhistory\
					.query.filter_by(backreftype=1, backrefid=current_user.id)\
					.filter(Positionhistory.time <= start_date)\
					.delete(synchronize_session=False)
				newpos = Positionhistory(
					backreftype=1,
					backrefid=current_user.id,
					latestpos=pos,
					positiontrack=posTrack,
					time=datetime.datetime.now()
				)
				vars = (pos.split(";"))
				redis_store.hset(userkey, "PositionTrack", "{}:{}:{}".format(vars[0],vars[1],vars[2]))
				dbputandcommit(newpos)
				redis_store.hset(userkey, "LastUpdatedPositionAt", datetime.datetime.now().isoformat())
	finally:releaseRedisLock()

def createNewUserSummary(email):
	newdate = datetime.datetime.strptime('26 Mar 1996', '%d %b %Y')
	usersummary = {
		"LastCheckedUpdatesAt": newdate.isoformat(),
		"LastUpdatedPositionAt": newdate.isoformat(),
		"LastSeenPosition": "0;0;30",
		"PositionTrack": "0:0:30",
		"UserUpdates": ""
	}
	return usersummary

def getPositionUpdatesFromRedis(BlockPosition,LastCheckedAt):
	HashKey = "BlockData:{}:{}".format(BlockPosition[0], BlockPosition[1])
	updates = []
	try:
		if redis_store.exists(HashKey):
			blocktimestring = redis_store.hget(HashKey, "Block:LastUpdate")
			if blocktimestring is not None:
				blocktime = datetimeFromIsoFormatString(blocktimestring)
				# If block hasn't been updated then don't do anything.
				if blocktime > LastCheckedAt:
					getRedisLock("getPositionUpdatesFromRedis")
					BlockSummary = redis_store.hget(HashKey, "Block:Summary")
					blockdict = json.loads(BlockSummary)
					for key in blockdict:
						timestring = blockdict[key]
						time = datetimeFromIsoFormatString(timestring)
						if time > LastCheckedAt:
							srupdates = json.loads(redis_store.hget(HashKey,key))
							for update in srupdates:
								updates.append(json.loads(update))
					releaseRedisLock()
	finally:
		releaseRedisLock()
	return updates






#class clientSocketUpdater(object):
#
#	def __init__(self,appcontext,interval=1):
#		self.appcontext = appcontext
#		self.interval = interval
#		self.running = True
#		self.clients = {}
#		self.threadlock = threading.RLock()
#		self.TimeLog = datetime.datetime.now()
#
#	def DBUpdate(self,client, now):
#		cdbtime = client.lastWrittenToDbAt
#		elapsed = now - cdbtime
#		seconds = elapsed.total_seconds()
#		if seconds > 0.5:
#			track = ["{}:{}".format(pos[0],pos[1]) for pos in client.Positiontrack]
#			strack = ";".join(track)
#			dbpos = Positionhistory(
#				backreftype=1,
#				backrefid=client.id,
#				positiontrack=strack,
#				latestpos=";".join([str(x) for x in client.lastknownpos]),
#				time=datetime.datetime.now()
#			)
#			dbput(dbpos)
#			# TODO: These are going to stack up really quickly. You need to flush them after a certain amount of time.
#			client.lastWrittenToDbAt = datetime.datetime.now()
#			client.Positiontrack = [client.lastknownpos]
#			print("Updated position for client with id {}".format(client.id))
#
#
#	def CheckForUpdates(self):
#		for email in self.clients:
#			client = self.clients[email]
#			self.pushDataToClient("Update", client, ["testdata"])
#
#	def pushDataToClient(self,handlername,client, data):
#		namespace = "/navengine"
#		callback = None
#		room = client.room
#		include_self = True
#		ignore_queue = False
#		socketio = flask.current_app.extensions['socketio']
#		socketio.emit(handlername, data, namespace=namespace, room=room,
#		              include_self=include_self, callback=callback,
#		              ignore_queue=ignore_queue)
#
#	def addOrUpdateClient(self,clientemail,userrequestsid):
#		if not clientemail in self.clients:
#			client = clientInfo(clientemail,userrequestsid)
#			if not redis_store.hexists('user:' + client.email, "email"):
#				redis_store.hmset('userwithemail' + client.email, client.getRedissable())
#
#			value = redis_store.hgetall('userwithemail' + client.email)
#			print(value)
#
#		print("New client with email " + str(clientemail))
#
#	def pushNewMapUpdate(self,position,size,sitemtype,itemid,sUpdatetype,addData):
#		distrequired = 2000
#		for email in self.clients:
#			client = self.clients[email]
#			if client.lastknownposdefined:
#				if distance(client.lastknownpos,center(position,size)) < distrequired:
#					data = {}
#					data['posx'] = position[0]
#					data['posy'] = position[1]
#					data['sizex'] = size[0]
#					data['sizey'] = size[1]
#					data['itemtype'] = sitemtype
#					data['itemid'] = itemid
#					data['updatetype'] = sUpdatetype
#					data['additionalData'] = addData
#					self.pushDataToClient("ItemUpdated",client,data)
#					print("Sent new position update")
#
#	def pushClientPositionUpdate(self,emailaddr,position,zoom):
#		bob = self.clients[emailaddr]
#		bob.lastknownpos = position
#		bob.Positiontrack.append(position)
#		bob.lastknownposdefined = True
#		bob.lastupdatedat = datetime.datetime.now()
#		print("Got client position update")

def distance(p0, p1):
	return math.sqrt((p0[0] - p1[0]) ** 2 + (p0[1] - p1[1]) ** 2)

def center(position,size):
	return [position[0] + (size[0] / 2),position[1] + (size[1] / 2)]


class clientInfo():
	def __init__(self, email, room):
		self.email = email
		bob = dbget(User, email=email)
		self.id = bob.id
		self.room = room
		self.lastknownpos = []
		self.lastknownposdefined = False
		self.lastupdatedat = datetime.datetime.now()
		self.lastWrittenToDbAt = datetime.datetime.now()
		self.Positiontrack = []

	def getRedissable(self):
		tmp = {}
		tmp["email"] = self.email
		tmp["id"] = self.id
		tmp["room"] = self.room
		tmp["lastknownpos"] = self.lastknownpos
		tmp["lastknownposdefined"] = self.lastknownposdefined
		tmp["lastupdatedat"] = self.lastupdatedat
		tmp["lastWrittenToDbAt"] = self.lastWrittenToDbAt
		tmp["Positiontrack"] = self.Positiontrack
		return tmp

