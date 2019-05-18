from app.WidgetClasses.WidgetBase import *

class ProfileClass(positionalItemBaseTemplate):

	def __init__(self):
		positionalItemBaseTemplate.__init__(self)
		self.itemtypestring = "Profile"
		self.itemtypeint = 1

	def appendDataForPortrayal(self,objectid,fromserver):
		fromserver['email'] = dbget(User, id=objectid).email

	def createObject(self,**kwargs):
		data = kwargs.get('data')
		posx = kwargs.get('position')[0]
		posy = kwargs.get('position')[1]
		sizex = 25
		sizey = 12
		newcoord = Coordinate(backreftype=1,
		                      backrefid=int(data),
		                      coords=";".join([str(posx), str(posy)]),
		                      squaresize=";".join([str(sizex), str(sizey)]),
		                      gridid=getGridBlockId([int(posx), int(posy)])
		                      )
		dbputandcommit(newcoord)
		#db.session.commit()
		pushPositionUpdateToRedis(self.getItemString(), [posx, posy], [sizex, sizey], newcoord.id, int(data), "Created", str(newcoord.id), current_user.email)
		return {"coordid": str(newcoord.id), "Moredata": "testing the ship"}

	def updateObject(self,objectid,*args):
		pass

	def updateObjectPosition(self,objectid,position,size):
		email = objectid
		posx = position[0]
		posy = position[1]
		sizex = size[0]
		sizey = size[1]

		if email == current_user.email:
			coord = dbget(Coordinate, backreftype=1, backrefid=g.user.id)
			if coord is None:
				newcoord = Coordinate(backreftype=1,
				                      backrefid=g.user.id,
				                      coords=";".join([str(posx), str(posy)]),
				                      squaresize=";".join([str(sizex), str(sizey)]),
				                      gridid=getGridBlockId([int(posx), int(posy)])
				                      )
				db.session.add(newcoord)
				db.session.commit()
			else:
				coord.backreftype = 1
				coord.backrefid = g.user.id
				coord.coords = ";".join([str(posx), str(posy)])
				coord.squaresize = ";".join([str(sizex), str(sizey)])
				coord.gridid = getGridBlockId([int(posx), int(posy)])
				db.session.commit()
			pushPositionUpdateToRedis(self.getItemString(), position, size, coord.id, email, "NewPosition", str(coord.id), current_user.email)

	def deleteObject(self,objectid):
		post = dbget(Userpost, id=int(objectid))
		db.session.delete(post)
		return jsonify({"message": "Success"})