import base64

from flask import Blueprint, Markup, render_template, flash, redirect, session, url_for, request, g, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app import app

from .models import *
import os, sys, time, datetime, io

from helpers import *

binst = Blueprint('binst', __name__)

home = "/home"




def profiledisp(userid):
	person = User.query.filter_by(id=userid).first()
	profileimage = Profileimagexuser.query.filter_by(userid=person.id).first()
	if profileimage is not None:
		imagecontent = '<img id="profile-' + person.email + '" class="profileimage mr-2" src="/getimageid-' + \
		               str(profileimage.fileid) +'"style="" ' \
		                                    'class="img-circle" alt="Cinque Terre">'
	else:
		imagecontent = '<div class="profileplaceholder mr-2">&nbsp</div>'
	profile = Markup('<a href="#" onclick="javascript:change(\'/profile-' + person.email + '\')">'
	                 + imagecontent + person.name.capitalize() + " " + person.middlename.capitalize() + " " + person.lastname.capitalize() + '</a>')
	return profile

def makefriend(userid1,userid2):
	conn = Connection(user1id=userid1,user2id=userid2,connectiontype=1)
	dbputandcommit(conn)

def unfriend(userid1,userid2):
	conn = Connection.query.filter_by(user1id=userid1,user2id=userid2).first()
	if conn is None:
		conn = Connection.query.filter_by(user1id=userid2,user2id=userid1).first()
	if conn is None:
		return "You are not friends.."
	db.session.delete(conn)
	dbcommit()

def getPerson(userid):
	persontmp = User.query.filter_by(id=int(userid)).first()
	persontmp.display = profiledisp(userid)
	profileimage = Profileimagexuser.query.filter_by(userid=userid).first()
	if profileimage is not None:
		persontmp.profileid = profileimage.fileid
	else:
		persontmp.profileid = 0
	persontmp.isfriends = isFriends(current_user.id,userid)
	return persontmp

def addPersonToUser(user):
	persontmp = user
	# EXPENSIVE
	#persontmp.display = profiledisp(user.id)
	profileimage = Profileimagexuser.query.filter_by(userid=user.id).first()
	if profileimage is not None:
		persontmp.profileimageid = profileimage.fileid
	else:
		persontmp.profileimageid = 0
	# THIS IS TOO EXPENSIVE
	#persontmp.isfriends = isFriends(current_user.id, user.id)
	return persontmp

def PostsToCards(posts):
	class postcard:
		details = ''
		owner = ''
		likes = ''
		comments = ''
		likecount = 0
		commentcount = 0
	cards = []
	for post in posts:
		item = postcard()
		owner = getPerson(post.userid)
		item.details = post.details
		item.owner = owner
		item.ownerdisp = profiledisp(post.userid)
		likes = query(Like).filter((Like.postid == post.id)).all()
		item.likecount = len(likes)
		for like in likes:
			like.owner = getPerson(like.userid)
		item.likes = likes
		comments = query(Comment).filter((Comment.postid == post.id)).all()
		item.commentcount = len(comments)
		for comment in comments:
			comment.owner = getPerson(comment.userid)
		item.comments = comments
		cards.append(item)
	return cards



def isPostSeen(PostID, userid):
	if len(query(Seen).filter(  (Seen.itemtype == 1)\
	                          & (Seen.userid == userid)\
	                          & (Seen.itemid == PostID)).all()) > 0:
		return True
	return False

def getfriends(userid):
	# HOLY SMOAKS THIS IS EXPENSIVVE
	# TODO: OPTIMISE THE SHIT OUT OF THIS
	connectionss = query(Connection).filter(\
		(Connection.user1id == userid) | (Connection.user2id == userid)\
		)
	friends = []
	for conn in connectionss:
		if conn.user1id == userid:
			friends.append(User.query.filter_by(id=conn.user2id).first())
		else:
			friends.append(User.query.filter_by(id=conn.user1id).first())
	return friends

def isFriends(userid1,userid2):
	friends1 = getfriends(userid1)
	isfriend = False
	for friend in friends1:
		if friend.id == userid2:
			return True
	return isfriend

#################################   Login
@binst.route('/login',methods=['GET','POST'])
def Login():
	if "btnsubmit" in request.form:
		email= request.form['email']
		passw = request.form['passw']
		Bob = User.query.filter_by(email=email.lower()).first()
		if Bob is not None:
			if passw == Bob.password:
				login_user(Bob)
				return redirect(home)
	return render_template('login.html',
		title='Binst - Login')
		#rootdir=rootdir)
##############################################


#####################################   Signup
# noinspection PyArgumentList
@binst.route('/signup',methods=['GET','POST'])
def Signup():
	if "namecheck" in request.form:
		email = request.form["email"]
		if len(User.query.filter_by(email=email).all()) == 0:
			#Email has not been taken
			return jsonify({
				'Taken': 'f'})
		else:
			#Email has been taken
			return jsonify({
				'Taken': 't'})
	if "submitbtn" in request.form:
		passw = request.form["passw"]
		cpassw = request.form["cpassw"]
		if passw != cpassw:
			flash("The passwords do not match. Please try again.")
		else:
			name = request.form["name"]
			middle = request.form["middlename"]
			last = request.form["lastname"]
			email = request.form["email"]
			if len(User.query.filter_by(email=email).all()) == 0:
				Bob = User(name=name,
				           email=email,
				           middlename=middle,
				           lastname=last,
				           password=passw )
				db.session.add(Bob)
				db.session.commit()
				login_user(Bob)
				return redirect(home)
			else:
				flash("This email address already exists.")

	return render_template('signup.html',
	                       title='Binst - Sign Up')
###################################################

#################################   Login
@binst.route('{}'.format(home),methods=['GET','POST'])
@login_required
def homepage():
	return render_template('homepage.html',
	                       loggedin=True,ishome=True,
				title='Binst - Home')
##############################################

################################   Login
@binst.route('/postthestuff',methods=['GET','POST'])
@login_required
def scriptrunner():
	u1 = User(email='Wickelberryk@Flynn.com',
	          name='Johnathon',
	          middlename='Wickleberry',
	          lastname="Cumming",
	          password="69food69")
	dbputandcommit(u1)
	daimon = User.query.filter_by(email='daimonsewell2@gmail.com').first()
	conn = Connection(user1id=daimon.id,user2id=u1.id)
	dbputandcommit(conn)
	post = Post(
		userid=u1.id,
		details='THe fuknAh bears Arrr fknah cumming ay',
		posttype=1
	)
	dbputandcommit(post)
	return 'Did the stuff.. continue'
##############################################

#################################   Feed
@binst.route('/profile-<email>',methods=['GET','POST'])
@login_required
def profilepage(email):
	Bob = User.query.filter_by(email=email).first()
	isme = email == current_user.email
	friends = getfriends(Bob.id)
	isfriends = isFriends(Bob.id,current_user.id)
	friendcount = len(friends)
	bobsposts = Post.query.filter_by(userid=Bob.id).all()
	bobscards = PostsToCards(bobsposts)
	postcount = len(bobsposts)
	return render_template('profile.html',
	                       user=Bob,
	                       isme=isme,
	                       isfriends=isfriends,
	                       postcount=postcount,
	                       bobsposts=bobscards,
	                       friendcount=friendcount,
	                       imageupload=True,
	                       loggedin=True,
				title='Binst - Home')
##############################################

#################################   Feed
@binst.route('/updateprofileimage',methods=['GET','POST'])
@login_required
def updateprofileimage():
	Bob = current_user
	#imagedata = getFileFromForm(request.form)
	imgbytes = getResizedImageBase64ToBinary(request.form['file'], 800, 800)
	if imgbytes:
		file = File(details="jpeg - Profile image",
		            file=imgbytes,
		            userid=Bob.id,
		            purposeid=1)
		dbputandcommit(file)
		pixu = Profileimagexuser.query.filter_by(userid=Bob.id).first()
		if pixu is None:
			pixu = Profileimagexuser(fileid=file.id,userid=Bob.id)
			dbputandcommit(pixu)
		else:
			pixu.fileid = file.id
			dbcommit()
	return "Job nicely done"
##############################################

#################################   Feed
@binst.route('/user-<email>',methods=['GET','POST'])
@login_required
def getuserdetails(email):
	Bob = User.query.filter_by(email=email).first()
	Bob = getPerson(Bob.id)
	profileimage = Profileimagexuser.query.filter_by(userid=Bob.id).first()
	if profileimage is not None:
		profileimageid = profileimage.fileid
	else:
		profileimageid = 0
	return jsonify({"idnum":Bob.id,
	                "email":Bob.email,
	                "profileimageid":profileimageid,
			"name":Bob.name,
			"bio":Bob.bio})
##############################################

#################################   Feed
@binst.route('/getimageid-<imageid>',methods=['GET','POST'])
@login_required
def getimageid(imageid):
	image = File.query.get_or_404(imageid)
	scaledImg = getResizedImageBinary(image.file, 800, 800)
	return app.response_class(scaledImg, mimetype='image/jpeg')
##############################################

#################################   Poster
@binst.route('/poster',methods=['GET','POST'])
def posterfiller():
	Bob = current_user
	if 'postcheck' in request.form:
		text = request.form['text']
		post = Post(userid=current_user.id,details=text,posttype=7,dataid=-1)
		dbputandcommit(post)
		return jsonify({'success': 't'})
	return render_template('poster.html',
	                       user=Bob,
	                       loggedin=True,
				title='Binst - Home')

#################################   Poster
@binst.route('/friender',methods=['GET','POST'])
@login_required
def frienderservice():
	me = current_user
	if 'change' in request.form:
		change = request.form['change']
		id = request.form['id']
		otherguy = User.query.filter_by(email=id).first()
		if not isFriends(me.id,otherguy.id):
			if change == "befriend":
				makefriend(me.id,otherguy.id)
				sout(otherguy.email)
				return jsonify({'friends': 't', 'email': otherguy.email, 'id': otherguy.id})
		else:
			if change == "unfriend":
				unfriend(me.id,otherguy.id)
				sout(otherguy.email)
				return jsonify({'friends': 'f', 'email': otherguy.email, 'id': otherguy.id})
		return jsonify({'success': 't'})


#################################   Feed
@binst.route('/feed',methods=['GET','POST'])
@login_required
def feedpage():
	user = current_user
	friends = getfriends(user.id)
	friends.append(current_user)
	posts = []
	for friend in friends:
		fposts = query(Post).filter((Post.userid == friend.id)).all()
		for fpost in fposts:
			posts.append(fpost)
	poststoshowtmp = []
	for post in posts:
		if not isPostSeen(post.id,user.id):
			poststoshowtmp.append(post)
	poststoshow = PostsToCards(poststoshowtmp)
	return render_template('feed.html',posts=poststoshow,
	                       loggedin=True,
				title='Binst - Home')
##############################################


#################################   search
@binst.route('/search',methods=['GET','POST'])
@login_required
def searchpage():

	if 'searchterm' in request.form:
		session['searchterm'] = request.form['searchterm']
		sout("Got searchterm: {}".format(request.form['searchterm']))
		return jsonify({'success': 't'})
	term = session['searchterm']
	return render_template('search.html',
	                       defaultterm=term,
	                       loggedin=True,
				title='Binst - Home')
##############################################


#################################   search
@binst.route('/searchposts',methods=['GET','POST'])
@login_required
def searchpostse():
	term = session['searchterm']
	user = current_user
	friends = getfriends(user.id)
	friends.append(current_user)
	posts = []
	for friend in friends:
		fposts = query(Post).filter((Post.userid == friend.id)).all()
		for fpost in fposts:
			posts.append(fpost)
	poststoshowtmp = []
	for post in posts:
		if term in post.details:
			poststoshowtmp.append(post)
	poststoshow = PostsToCards(poststoshowtmp)
	return render_template('searchposts.html',
	                       posts=poststoshow,
	                       loggedin=True,
				title='Binst - Home')
##############################################

#################################   search
@binst.route('/searchpeople',methods=['GET','POST'])
@login_required
def searchpeople():
	term = session['searchterm']
	term = "%{}%".format(term)
	people = query(User).filter(User.email.like(term) | \
	                            User.name.like(term) | \
	                            User.middlename.like(term) | \
	                            User.lastname.like(term)).all()
	results = []
	for person in people:
		persontmp = getPerson(person.id)
		results.append(persontmp)
	return render_template('searchpeople.html',
	                       defaultterm=term,
	                       people=results,
	                       loggedin=True,
				title='Binst - Home')
##############################################
