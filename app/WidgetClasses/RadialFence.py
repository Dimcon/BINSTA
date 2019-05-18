from app.WidgetClasses.WidgetBase import *

class RadialFenceClass(positionalItemBaseTemplate):

	def __init__(self):
		positionalItemBaseTemplate.__init__(self)
		self.itemtypestring = "RadialFence"
		self.itemtypeint = 5

	def appendDataForPortrayal(self,objectid,fromserver):
		accessgrant = dbget(Accessgrant, backreftype=self.itemtypeint, backrefid=objectid)
		grantstring = accessgrant.userlist
		fromserver['fenceid'] = objectid
		fromserver['accessgrants'] = grantstring

	def createObject(self,**kwargs):
		position = kwargs.get('position')
		sizex = 25
		sizey = 25
		posx = float(position[0]) - (sizex / 2)
		posy = float(position[1]) - (sizey / 2)

		fence = Radialfence(
			userid=g.user.id
		)
		dbputandcommit(fence)
		accessgrant = Accessgrant(
			userlist=";".join([g.user.email]),
			backreftype=5,
			backrefid=fence.id
		)
		dbputandcommit(accessgrant)
		newcoord = Coordinate(backreftype=5,
		                      backrefid=int(fence.id),
		                      coords=";".join([str(posx), str(posy)]),
		                      squaresize=";".join([str(sizex), str(sizey)]),
		                      gridid=getGridBlockId([int(posx), int(posy)])
		                      )
		db.session.add(newcoord)
		db.session.commit()
		fence.coordid = newcoord.id
		db.session.commit()
		pushPositionUpdateToRedis(self.getItemString(), [posx, posy], [sizex, sizey], newcoord.id, fence.id, "Created", str(newcoord.id), current_user.email)
		return jsonify({"fenceid": str(fence.id), "coordid": str(newcoord.id), "Moredata": "testing the ship"})


	def updateObject(self,objectid,*args):
		# TODO: Finish this
		pass

	def updateObjectPosition(self,objectid,position,size):
		#TODO: Finish this
		fenceid = objectid
		fence = dbget(Radialfence, id=int(fenceid))
		coord = dbget(Coordinate, backreftype=3, backrefid=int(fence.id))
		if coord is None:
			newcoord = Coordinate(backreftype=1,
			                      backrefid=int(fence.id),
			                      coords=";".join([str(position[0]), str(position[1])]),
			                      squaresize=";".join([str(size[0]), str(size[1])]),
			                      gridid=getGridBlockId([int(position[0]), int(position[1])])
			                      )
			db.session.add(newcoord)
			db.session.commit()
		else:
			coord.backreftype = 3
			coord.backrefid = int(fence.id)
			coord.coords = ";".join([str(position[0]), str(position[1])])
			coord.squaresize = ";".join([str(size[0]), str(size[1])])
			coord.gridid = getGridBlockId([int(position[0]), int(position[1])])
			db.session.commit()
		pushPositionUpdateToRedis(self.getItemString(), position, size, coord.id, fenceid, "NewPosition", str(coord.id), current_user.email)

	def deleteObject(self,objectid):
		fence = dbget(Radialfence, id=int(objectid))
		coord = dbget(Coordinate, backreftype=3, backrefid=int(fence.id))
		db.session.delete(fence)
		db.session.delete(coord)
		position = coord.coords.split(";")
		pushPositionUpdateToRedis(self.getItemString(), [position[0], position[1]], [0, 0], coord.id, fence.id, "Deleted", "What more do you need?", current_user.email)
		return jsonify({"message": "Success"})