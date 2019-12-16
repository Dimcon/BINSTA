from app import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
	id = db.Column(db.Integer,primary_key=True)
	email = db.Column(db.String(256),index=True)
	name = db.Column(db.String(128),index=True)
	middlename = db.Column(db.String(128), index=True)
	lastname = db.Column(db.String(128),index=True)
	password = db.Column(db.String(32),index=False)
	bio = db.Column(db.String(512),index=False)
	isonline = db.Column(db.Integer)
	typinginconvoid = db.Column(db.Integer)
	def __repr__(self):
		return '<User {}:{}>'.format(str(self.id),self.email)

class Connection(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user1id = db.Column(db.Integer, index=True)
	user2id = db.Column(db.Integer, index=True)
	connectiontype = db.Column(db.Integer)
	#Friends = 1
	#Notifications on post = 2
	#following = 4
	#Blocked = 8

class Profileimagexuser(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	fileid = db.Column(db.Integer, index=True)
	userid = db.Column(db.Integer, index=True)

class File(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	details = db.Column(db.String(128))
	file = db.Column(db.LargeBinary)
	userid = db.Column(db.Integer)
	purposeid = db.Column(db.Integer)
	#1 = Profile image
	#2 = UserPostImage
	#3 = PostNLW file


class Seen(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, index=True)
	itemid = db.Column(db.Integer, index=True)
	itemtype = db.Column(db.Integer, index=True)
	# Post = 1
	# Like = 2
	# Comment = 3
	# Group = 4
	# Message = 5
	# Connection = 6

class Post(db.Model):  # unused except non 2D posts
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, index=True)
	details = db.Column(db.String(128), index=False)
	posttype = db.Column(db.Integer, index=False)
	# Post = 1
	# Like = 2
	# Comment = 3
	# Group = 4
	# Message = 5
	# Connection = 6
	# Text = 7
	# Image = 8
	dataid = db.Column(db.Integer, index=True)

class Userpost(db.Model): #2D posts
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, index=True)
	details = db.Column(db.Text)
	posttype = db.Column(db.Integer, index=False)
	# Post = 1
	# Like = 2
	# Comment = 3
	# Group = 4
	# Message = 5
	# Connection = 6
	# Text = 7
	# Image = 8
	coordid = db.Column(db.Integer)
	dataid = db.Column(db.Integer, index=True)

class Like(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, index=True)
	postid = db.Column(db.Integer, index=True)

class Comment(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, index=True)
	postid = db.Column(db.Integer, index=True)
	message = db.Column(db.String(128), index=False)

class Group(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	Name = db.Column(db.String(128), index=False)

class Participant(db.Model):
	# Not in use. Use Userxconversation rather
	id = db.Column(db.Integer, primary_key=True)
	toobject = db.Column(db.Integer, index=True)
	userid = db.Column(db.Integer, index=True)
	objectid = db.Column(db.Integer, index=True)

class Userxconversation(db.Model):
	# Mainstream coversation participation model
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, index=True)
	conversationid = db.Column(db.Integer, index=True)
	joinstatus = db.Column(db.String(256))
	# 1 = joined convo
	# 2 = Left Convo
	userjoindate = db.Column(db.DateTime)
	userrights = db.Column(db.Integer)
	# 0 = Full access
	# 1 = Can't add/remove people, can't delete messages
	# 2 = Can't change name/image of group

class Conversation(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(256), index=True)
	privacy = db.Column(db.Integer)
	profileimageid = db.Column(db.Integer)

class Cmessage(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	conversationid = db.Column(db.Integer, index=True)
	fromuserid = db.Column(db.Integer, index=True)
	time = db.Column(db.DateTime, index=True)
	fileids = db.Column(db.Text)
	sentlist= db.Column(db.Text)
	recievedlist = db.Column(db.Text)
	message = db.Column(db.Text)

class CmessageStorage(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	conversationid = db.Column(db.Integer, index=True)
	fromuserid = db.Column(db.Integer, index=True)
	time = db.Column(db.DateTime, index=True)
	fileids = db.Column(db.Text)
	sentlist = db.Column(db.Text)
	recievedlist = db.Column(db.Text)
	message = db.Column(db.Text)

class Message(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	fromuser = db.Column(db.Integer, index=True)
	touser = db.Column(db.Integer, index=True)
	togroup = db.Column(db.Integer, index=True)
	postid = db.Column(db.Integer, index=True)
	postidrefobj = db.Column(db.Integer, index=True)
	message = db.Column(db.String(128), index=False)

class Grid(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	gridlevel = db.Column(db.Integer, index=True)
	gridx = db.Column(db.Integer, index=True)
	gridy = db.Column(db.Integer, index=True)
	gridmoreid = db.Column(db.Integer, index=True)

class Linkage(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	coord1id = db.Column(db.Integer)
	coord2id = db.Column(db.Integer)
	#Coord 1 = originator
	#Coord 2 = follower

class Accessgrant(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userlist = db.Column(db.Text)
	backreftype = db.Column(db.Integer)
	# 1 = Profile
	# 2 = Public comment
	# 3 = Post
	# 4 = Portal
	# 5 = BasicRadialFence
	backrefid = db.Column(db.Integer)

class Positionhistory(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	backreftype = db.Column(db.Integer)
	# 1 = Person
	backrefid = db.Column(db.Integer)
	backrefid2 = db.Column(db.Integer) # A person could be using two computers right?TODO: Make work with single login and multiple computers
	positiontrack = db.Column(db.Text) # CSV (X;Y,Zoom)
	latestpos = db.Column(db.String(1024))
	time = db.Column(db.DateTime)

class Coordinate(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	backreftype = db.Column(db.Integer)
	# 1 = Profile
	# 2 = Public comment
	# 3 = Post
	# 4 = Portal
	# 5 = BasicRadialFence
	# 6 = NetLoopWidget
	backrefid = db.Column(db.Integer)
	coords = db.Column(db.String(1024)) # XCoord;YCoord
	squaresize = db.Column(db.String(1024))
	gridid = db.Column(db.Integer, index=True)

class Radialfence(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer)
	coordid = db.Column(db.Integer)

class Fence(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	coordlist = db.Column(db.Text) # CSV

class Profileblock(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer)
	coordid = db.Column(db.Integer)

class Portal(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	ownerid = db.Column(db.Integer)
	coordid = db.Column(db.Integer)
	linkedportalid =  db.Column(db.Integer)

class NetInstance(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	hashkey = db.Column(db.Text)
	coordid = db.Column(db.Integer)

class Datahash(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	hashkey = db.Column(db.Text, index=True)
	lastupdatedAt = db.Column(db.Text)

class Kvpair(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	hashid = db.Column(db.Integer)
	key = db.Column(db.Text, index=True)
	value = db.Column(db.Text)
	indexed = db.Column(db.Integer, index=True)
	
class Pilltaken(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer)
	datetime = db.Column(db.DateTime)
	name = db.Column(db.String(256))
	additional = db.Column(db.String(2046))