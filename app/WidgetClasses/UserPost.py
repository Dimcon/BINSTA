from app.WidgetClasses.WidgetBase import *
from app.ClientSocketUpdater import *

class UserpostClass(positionalItemBaseTemplate):

	def __init__(self):
		positionalItemBaseTemplate.__init__(self)
		self.itemtypestring = "Userpost"
		self.itemtypeint = 3
		self.ItemSubTypeString = "1"

	def appendDataForPortrayal(self,objectid,fromserver):
		post = dbget(Userpost, id=int(objectid))
		fromserver['postid'] = post.id
		fromserver["posttype"] = post.posttype
		fromserver["dataid"] = post.dataid

	def createObject(self,**kwargs):
		data = kwargs.get('data')
		posx = kwargs.get('position')[0]
		posy = kwargs.get('position')[1]
		repliedTo = kwargs.get("replyTo")
		sizex = 20
		sizey = 20
		post = Userpost(
			userid=g.user.id,
			details=data,
			posttype=1
		)
		dbputandcommit(post)
		newcoord = Coordinate(backreftype=3,
		                      backrefid=int(post.id),
		                      coords=";".join([str(posx), str(posy)]),
		                      squaresize=";".join([str(sizex), str(sizey)]),
		                      gridid=getGridBlockId([int(posx), int(posy)])
		                      )
		dbputandcommit(newcoord)
		post.coordid = newcoord.id
		db.session.commit()
		if repliedTo != "None":
			linkage = Linkage(
				coord1id=repliedTo,
				coord2id=newcoord.id
			)
			dbputandcommit(linkage)
		pushFeedUpdate([posx, posy], 30, "has posted", data, 0, current_user)
		pushPositionUpdateToRedis(self.getItemString(), [posx,posy], [sizex,sizey],newcoord.id, post.id, "Created", str(newcoord.id), current_user.email)
		return jsonify({"postid": str(post.id), "coordid": str(newcoord.id), "Moredata": "testing the ship"})

	def updateObject(self,objectid,*args):
		#Object can't be updated for now. Delete and recreate is the only way.
		pass

	def updateObjectPosition(self,objectid,position,size):
		postid = objectid
		post = dbget(Userpost, id=int(postid))
		coord = dbget(Coordinate, backreftype=3, backrefid=int(post.id))
		if coord is None:
			newcoord = Coordinate(backreftype=3,
			                      backrefid=int(post.id),
			                      coords=";".join([str(position[0]), str(position[1])]),
			                      squaresize=";".join([str(size[0]), str(size[1])]),
			                      gridid=getGridBlockId([int(position[0]), int(position[1])])
			                      )
			db.session.add(newcoord)
			db.session.commit()
		else:
			coord.backreftype = 3
			coord.backrefid = int(post.id)
			coord.coords = ";".join([str(position[0]), str(position[1])])
			coord.squaresize = ";".join([str(size[0]), str(size[1])])
			coord.gridid = getGridBlockId([int(position[0]), int(position[1])])
			db.session.commit()
		poststring = self.itemtypestring + str(post.posttype)
		pushPositionUpdateToRedis(poststring, position, size, coord.id, postid, "NewPosition", str(coord.id), current_user.email)


	def deleteObject(self,objectid,coordid):
		post = dbget(Userpost, id=int(objectid))
		coord = dbget(Coordinate, backreftype=3, backrefid=int(post.id))
		db.session.delete(post)
		db.session.delete(coord)
		position = coord.coords.split(";")
		pushPositionUpdateToRedis(self.getItemString(), [position[0],position[1]], [0,0],coord.id, post.id, "Deleted", "What more do you need?", current_user.email)
		return jsonify({"message": "Success"})