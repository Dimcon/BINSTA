import base64

from flask import Blueprint, Markup, render_template, flash, redirect, session, url_for, request, g, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app import app

from app.models import *
import os, sys, time, datetime, io

from helpers import *

from app.betterinstagram import *

from app.Gridhelpers import *

from app import socketio

from ClientSocketUpdater import *

from app import BinstDataStructs

naveng = Blueprint('navengine', __name__)

home = "/home"

#################################   main navigator page
@naveng.route('/navigator',methods=['GET','POST'])
def navigator():
	hasCoords = False
	gotoCoords = []
	if "x" in request.args:
		if "y" in request.args:
			hasCoords = True
			gotoCoords = [int(request.args["x"]), request.args["y"]]
	coord = dbget(Coordinate, backreftype=1, backrefid=g.user.id)
	hasplacedprofile="true"
	if coord is None:
		hasplacedprofile="false"
	#poshistory = dbget(Positionhistory, backreftype=1, backrefid=g.user.id)
	if hasplacedprofile == "false":
		from random import randint
		usercenterpos = [randint(-400, 400), randint(-400, 400)]
		BinstDataStructs["Profile"].createObject(data=current_user.id, position=usercenterpos)
	else:
		poshistory = Positionhistory.query.filter_by(backreftype=1, backrefid=g.user.id)
		poshistory = poshistory.order_by('time desc')
		poshistory = poshistory.first()
		usercenterpos = [0,0]
		if poshistory is not None and len(poshistory.latestpos.split(';')) > 1:
			usercenterpos = [poshistory.latestpos.split(';')[0],poshistory.latestpos.split(';')[1]]
	return render_template("navigatortemplate.html",ishome=True, hasCoords=hasCoords, gotoCoords=gotoCoords,
	                       hasplacedprofile=hasplacedprofile,usercenterpos=usercenterpos,
	                       profilecoord=coord,user=getPerson(g.user.id))

#################################
@naveng.route('/setposition',methods=['GET','POST'])
def setposition():
	if "objecttype" in request.form:
		for structure in BinstDataStructs:
			if request.form['objecttype'] == structure:
				objectid = request.form['objectid']
				posx = float(request.form['posx'])
				posy = float(request.form['posy'])
				sizex = float(request.form['sizex'])
				sizey = float(request.form['sizey'])
				BinstDataStructs[structure].updateObjectPosition(objectid,[posx,posy],[sizex,sizey])
				return "Got you fam"

		if request.form['objecttype'] == 'profilecard':
			email = request.form['email']
			posx = float(request.form['posx'])
			posy = float(request.form['posy'])
			sizex = float(request.form['sizex'])
			sizey = float(request.form['sizey'])

			if email == g.user.email:
				coord = dbget(Coordinate,backreftype=1,backrefid=g.user.id)
				if coord is None:
					newcoord = Coordinate( backreftype=1,
						backrefid=g.user.id,
						coords=";".join([str(posx),str(posy)]),
						squaresize=";".join([str(sizex),str(sizey)]),
						gridid=getGridBlockId([int(posx),int(posy)])
					)
					db.session.add(newcoord)
					db.session.commit()
				else:
					coord.backreftype=1
					coord.backrefid=g.user.id
					coord.coords=";".join([str(posx),str(posy)])
					coord.squaresize=";".join([str(sizex),str(sizey)])
					coord.gridid=getGridBlockId([int(posx),int(posy)])
					db.session.commit()

	return "Got you fam"

@socketio.on('createnewitem', namespace='/navengine')
def createnewitem(data):
	widgetdata = data['data']
	sitemtype = str(data['sItemType'])
	position = [float(data['posx']),float(data['posy'])]
	rdata = BinstDataStructs[sitemtype].createObject(wdata=widgetdata,position=position)
	emit('createdNewItem', rdata)

@naveng.route('/newuserpost',methods=['GET','POST'])
def newuserpost():
	data = request.form['data']
	posx = float(request.form['posx'])
	posy = float(request.form['posy'])
	repliedTo = request.form["repliedToCoord"]
	return BinstDataStructs["Userpost"].createObject(data=data,position=[posx,posy],replyTo=repliedTo)


@naveng.route('/newuserimagepost',methods=['GET','POST'])
def newuserimagepost():
	data = request.form['data']
	posx = float(request.form['posx'])
	posy = float(request.form['posy'])
	repliedTo = request.form["repliedToCoord"]
	Bob = current_user
	#imgBase64 = request.form['file']
	#imagedata = getFileFromForm(request.form)
	#if not imagedata:
	#	return "Transaction failed"
#
	#from PIL import Image
	#from io import BytesIO
	#import base64
	#ndata = {'img': imgBase64}
#
	#im = Image.open(BytesIO(imagedata))
	#width,height = im.width, im.height
	#imgscale = 1.00
#
	#if width > height:
	#	imgscale = 900.00 / float(width)
	#else:
	#	imgscale = 900.00 / float(height)
#
#
	#newimage = im.resize((int(imgscale * width), int(imgscale * height)), box=None)
#
	#imgByteArr = io.BytesIO()
	#newimage.save(imgByteArr, format='PNG')
	#imgByteArr = imgByteArr.getvalue()

	#imgbytes = getResizedImageBase64ToBinary(request.form['file'], 900, 900)
	
	imgbytes = getBinaryFromBase64(request.form['file'])
	file = File(details="jpeg - User Image Post",
	            file=imgbytes,
	            userid=Bob.id,
	            purposeid=2)
	dbputandcommit(file)
	sizex = 12
	sizey = 12
	post = Userpost(
		userid=g.user.id,
		details=data,
		posttype=8,
		dataid=file.id
	)
	dbputandcommit(post)
	newcoord = Coordinate(backreftype=3,
	                      backrefid=int(post.id),
	                      coords=";".join([str(posx), str(posy)]),
	                      squaresize=";".join([str(sizex), str(sizey)]),
	                      gridid=getGridBlockId([int(posx), int(posy)])
	                      )
	db.session.add(newcoord)
	db.session.commit()
	post.coordid = newcoord.id
	db.session.commit()
	if repliedTo != "None":
		linkage = Linkage(
			coord1id=repliedTo,
			coord2id=newcoord.id
		)
		dbputandcommit(linkage)
	pushFeedUpdate([posx, posy], 30, "has posted an image", "", file.id, current_user)
	pushPositionUpdateToRedis("Userpost8", [posx, posy], [sizex, sizey], newcoord.id, post.id, "Created", str(newcoord.id), current_user.email)
	return jsonify({"postid":str(post.id),"coordid":str(newcoord.id),"Moredata":"testing the ship"})

@naveng.route('/loadpost',methods=['GET','POST'])
def loadpost():
	postid = request.form["postid"]
	post = dbget(Userpost,id=int(postid))
	if post is not None:
		bruce = dbget(User,id=int(post.userid))
		tmp = {}
		tmp["details"] = post.details
		tmp["email"] = bruce.email
		tmp["posttype"] = post.posttype
		tmp["dataid"] = post.dataid
		return jsonify({"post":tmp,"report":"Hah! got em"})
	return jsonify({"report":"Data not found"})

@naveng.route('/newconnection',methods=['GET','POST'])
def newconn():
	coord1id = request.form["coord1id"]
	coord2id = request.form["coord2id"]
	if isCoordOwned(coord1id):
		link = Linkage(coord1id=int(coord1id),coord2id=int(coord2id))
		dbputandcommit(link)
		return jsonify({"report":"completed","linkid":str(link.id)})
	return jsonify({"report":"Data not found"})

@naveng.route('/newuserportal',methods=['GET','POST'])
def newuserportal():
	pos1x = float(request.form['pos1x'])
	pos1y = float(request.form['pos1y'])
	pos2x = float(request.form['pos2x'])
	pos2y = float(request.form['pos2y'])
	return BinstDataStructs["Portal"].createObject(pos1=[pos1x,pos1y],pos2=[pos2x,pos2y])

@naveng.route('/newuserfence',methods=['GET','POST'])
def newuserfence():
	posx = request.form['pos1x']
	posy = request.form['pos1y']
	return BinstDataStructs["RadialFence"].createObject(position=[posx,posy])


def isCoordOwned(coordid): # New Item type update here
	coord = dbget(Coordinate, id=int(coordid))
	if coord.backreftype == 1:
		if int(coord.backrefid) == current_user.id:
			return True
	if coord.backreftype == 3:
		post = dbget(Userpost, id=coord.backrefid)
		if post.userid == current_user.id:
			return True
	if coord.backreftype == 4:
		portal = dbget(Portal, id=coord.backrefid)
		if portal.ownerid == current_user.id:
			return True
	if coord.backreftype == 5:
		fence = dbget(Radialfence, id=coord.backrefid)
		if fence.userid == current_user.id:
			return True
	if coord.backreftype == 6:
		instance = dbget(NetInstance, id=coord.backrefid)
		owneremail = dbhget(instance.hashkey, "OwnerEmail")
		if owneremail == current_user.email:
			return True
	return False

@naveng.route('/updateprofile',methods=['GET','POST'])
def updateprofile():
	bio = request.form['bio']
	username = request.form["username"]
	user = dbget(User,id=g.user.id)
	user.bio = bio
	user.name = username
	db.session.commit()
	return jsonify({"Moredata": "testing the ship"})


@naveng.route('/delete',methods=['GET','POST']) # New Item type update here
def deleter():
	if "coordid" in request.form:
		coordid = request.form['coordid']
	itemtype = request.form['objecttype']
	itemid = request.form['objectid']
	if itemtype == "link":
		link = dbget(Linkage,id=int(itemid))
		if link is not None:
			if isCoordOwned(link.coord1id):
				db.session.delete(link)
				db.session.commit()
				return jsonify({"message": "Success"})
			return jsonify({"message": "You are not the owner of the following coordinate"})
		return jsonify({"message": "The coordinate could not be found"})

	if itemtype == "coordinate":
		coordid = itemid
		coordinate = dbget(Coordinate, id=int(coordid))
		if coordinate is not None:
			for structure in BinstDataStructs:
				if coordinate.backreftype == BinstDataStructs[structure].itemtypeint:
					sData = BinstDataStructs[structure].deleteObject(coordinate.backrefid, coordinate.id)
					db.session.delete(coordinate)
					links = query(Linkage).filter((Linkage.coord1id == coordinate.id) |
					                              (Linkage.coord2id == coordinate.id)).all()
					for l in links:
						db.session.delete(l)
					db.session.commit()
					return sData
			#if coordinate.backreftype == 1:
			#	# f['type'] = "profile"
			#	pass
			#if coordinate.backreftype == 3:
			#	links = query(Linkage).filter((Linkage.coord1id == coordinate.id) |
			#	                              (Linkage.coord2id == coordinate.id)).all()
			#	for l in links:
			#		db.session.delete(l)
			#	post = dbget(Userpost,id=int(coordinate.backrefid))
			#	db.session.delete(post)
			#	db.session.delete(coordinate)
			#	db.session.commit()
			#	return jsonify({"message": "Success"})
			#	# f['type'] = "userpost"
			#	pass
			#if coordinate.backreftype == 4:
			#	# f['type'] = "portal"
			#	pass
			#if coordinate.backreftype == 5:
			#	# f['type'] = "radialfence"
			#	pass
	return jsonify({"message":"Error, The thing could not be deleted"})

@socketio.on('loadpost', namespace='/navengine')
def LoadPost(data):
	postid =data["postid"]
	post = dbget(Userpost, id=int(postid))
	if post is not None:
		bruce = dbget(User, id=int(post.userid))
		tmp = {}
		tmp["postid"] = post.id
		tmp["coordid"] = post.coordid
		tmp["details"] = post.details
		tmp["email"] = bruce.email
		tmp["posttype"] = post.posttype
		tmp["dataid"] = post.dataid
		emit('loadpost', {"post": tmp, "report": "Hah! got em"})
	emit('loadpost', {"report": "Data not found"})

@socketio.on('LoadPerson', namespace='/navengine')
def LoadPerson(data):
	if 'email' in data:
		emailaddr = data['email']
		Bob = User.query.filter_by(email=emailaddr).first()
		Bob = getPerson(Bob.id)
		profileimage = Profileimagexuser.query.filter_by(userid=Bob.id).first()
		if profileimage is not None:
			profileimageid = profileimage.fileid
		else:
			profileimageid = 0

		friends = getfriends(Bob.id)
		emit('LoadPersonData', {"idnum": Bob.id,
		                "email": Bob.email,
		                "profileimageid": profileimageid,
		                "name": Bob.name,
		                "bio": Bob.bio,
		                "friendCount":len(friends),
		                "isFriend":isFriends(current_user.id,Bob.id)})

@socketio.on('PositionUpdate', namespace='/navengine')
def PositionUpdate(data):
	Bob = current_user
	position = [int(data["posx"]),int(data["posy"])]
	zoom = int(data["zoom"])
	updateUserPositionTrack(Bob.email, position[0], position[1], zoom)
	newdeets = int(data["detailsChanged"])
	if newdeets == 1:
		bob2 = dbget(User, email=data["data"])
		pushPositionUpdateToRedis("User", position, [0, 0], -1, Bob.id, "NewDetails", Bob.email, str(zoom))
		pushPositionUpdateToRedis("User", position, [0, 0], -1, Bob.id, "NewDetails", bob2.email, str(zoom))
		return
	#clientSocketUpdater.pushClientPositionUpdate(Bob.email,position,zoom)
	#pushFeedUpdate([100, 200], 30, "has done something", "I have updated my position", 5, current_user)
	pushPositionUpdateToRedis("User",position,[0,0],-1,Bob.id,"NewPosition",Bob.email,str(zoom))

@socketio.on('PollForUpdates', namespace='/navengine')
def PollForUpdates(data):
	Bob = current_user
	lastCheckedTime = getUserLastUpdateCheckedTime(Bob.email)
	updatetime = datetime.datetime.now()
	updatetime = updatetime + datetime.timedelta(0, -1)
	setUserLastUpdateCheckedTime(Bob.email, updatetime.isoformat())
	blocks = getBlocksSurrounding([data["posx"],data["posy"]],data["radius"])
	updates = []
	for b in blocks:
		tmpupdates = getPositionUpdatesFromRedis(b,lastCheckedTime)
		for t in tmpupdates:
			updates.append(t)
	returndata = {
		"Time":datetime.datetime.now().isoformat(),
		"Updates": updates,
		"FeedUpdates": getFeedUpdates()
	}

	if len(updates) > 0:
		emit('Updates', returndata)

@socketio.on('RequestingObjectWithCoordID', namespace='/navengine')
def RequestingObjectWithCoordID(data):
	Bob = current_user
	coordid = data["CoordinateID"]
	objectData = getObjectDataForCoordid(coordid)
	objectData["Updated"] = 1
	things = [objectData]
	emit('LoaderData', {'coords': things})

def getObjectDataForCoordid(coordid,coordinate=""):
	f = {}
	if (coordinate == ""):
		c = dbget(Coordinate,id=int(coordid))
	else:
		c = coordinate
	f['xcoord'] = c.coords.split(";")[0]
	f['ycoord'] = c.coords.split(";")[1]
	f['xsize'] = c.squaresize.split(";")[0]
	f['ysize'] = c.squaresize.split(";")[1]
	f['coordid'] = c.id
	f['linksTo'] = []
	f['owned'] = False
	f['objectid'] = c.backrefid
	f["Updated"] = 0
	objectid = c.backrefid
	if isCoordOwned(c.id):
		f['owned'] = True
	linkages = dbgetlist(Linkage, coord2id=c.id)
	for l in linkages:
		linkedcoord = dbget(Coordinate, id=l.coord1id)
		lc = {}
		lc['coordid'] = linkedcoord.id
		lc['xcoord'] = linkedcoord.coords.split(";")[0]
		lc['ycoord'] = linkedcoord.coords.split(";")[1]
		lc['linkid'] = l.id
		f['linksTo'].append(lc)
	for structure in BinstDataStructs:
		if c.backreftype == BinstDataStructs[structure].itemtypeint:
			f['type'] = BinstDataStructs[structure].itemtypestring
			BinstDataStructs[structure].appendDataForPortrayal(objectid, f)
			break
	return f


@socketio.on('LoadAreaRadius', namespace='/navengine')
def LoadAreaRadius(data):
	g.user = current_user
	print("Got load request")

	posx = data['posx']
	posy = data['posy']
	radius = data['radius']
	coords = getCoordsSurrounding([int(round(float(posx))), int(round(float(posy)))], int(radius))
	things = []

	for c in coords:
		f = getObjectDataForCoordid(c.id, coordinate=c)
		things.append(f)
	emit('LoaderData', {'coords': things})


@socketio.on('connect', namespace='/navengine')
def test_connect():
	print('[+] Client connected')
	#clientSocketUpdater.addOrUpdateClient(current_user.email, request.sid)

@socketio.on('disconnect', namespace='/navengine')
def test_disconnect():
	print('[-] Client disconnected')


#################################   main navigator page
@naveng.route('/modelviewer<number>',methods=['GET','POST'])
def modelviewer1(number):
	return render_template("ModelViewer1.html", modelnumber=number)