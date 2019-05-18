from app.WidgetClasses.WidgetBase import *

class PortalClass(positionalItemBaseTemplate):

	def __init__(self):
		positionalItemBaseTemplate.__init__(self)
		self.itemtypestring = "Portal"
		self.itemtypeint = 4

	def appendDataForPortrayal(self,objectid,fromserver):
		fromserver['portalid'] = objectid
		portal = dbget(Portal, id=int(objectid))
		linkedportal = dbget(Portal, id=int(portal.linkedportalid))
		linkedportalcoord = dbget(Coordinate, id=int(linkedportal.coordid))
		fromserver['ownerid'] = portal.ownerid
		fromserver['newlocationx'] = linkedportalcoord.coords.split(";")[0]
		fromserver['newlocationy'] = linkedportalcoord.coords.split(";")[1]

	def createObject(self,**kwargs):
		position1 = kwargs.get('pos1')
		position2 = kwargs.get('pos2')
		newcoord1 = Coordinate(backreftype=4,
		                       coords=";".join([str(position1[0]), str(position1[1])]),
		                       squaresize=";".join([str(0), str(0)]),
		                       gridid=getGridBlockId([int(position1[0]), int(position1[1])])
		                       )
		newcoord2 = Coordinate(backreftype=4,
		                       coords=";".join([str(position2[0]), str(position2[1])]),
		                       squaresize=";".join([str(0), str(0)]),
		                       gridid=getGridBlockId([int(position2[0]), int(position2[1])])
		                       )
		db.session.add(newcoord1)
		db.session.add(newcoord2)
		db.session.commit()
		portal1 = Portal(ownerid=g.user.id,
		                 coordid=newcoord1.id,
		                 linkedportalid=0
		                 )
		portal2 = Portal(ownerid=g.user.id,
		                 coordid=newcoord2.id,
		                 linkedportalid=0
		                 )
		db.session.add(portal1)
		db.session.add(portal2)
		db.session.commit()
		portal1.linkedportalid = portal2.id
		portal2.linkedportalid = portal1.id
		newcoord1.backrefid = portal1.id
		newcoord2.backrefid = portal2.id
		db.session.commit()
		return jsonify({"portal1id": str(portal1.id), "coord1id": str(newcoord1.id), "portal2id": str(portal2.id), "coord12id": str(newcoord2.id), "Moredata": "testing the ship"})

	def updateObject(self,objectid,*args):
		pass

	def updateObjectPosition(self,objectid,position,size):
		coordid = objectid
		coord = dbget(Coordinate, id=coordid)
		coord.backreftype = 4
		coord.coords = ";".join([str(position[0]), str(position[1])])
		coord.squaresize = ";".join([str(size[0]), str(size[1])])
		coord.gridid = getGridBlockId([int(position[0]), int(position[1])])
		db.session.commit()
		poststring = self.itemtypestring
		pushPositionUpdateToRedis(self.itemtypestring, position, size, coord.id, coord.id, "NewPosition", str(coord.id), current_user.email)

	def deleteObject(self,objectid):
		coord = dbget(Coordinate,id=int(objectid))
		position = coord.coords.split(";")
		portal = dbget(Portal, id=int(coord.backrefid))
		db.session.delete(portal)
		db.session.delete(coord)
		db.session.commit()
		pushPositionUpdateToRedis(self.itemtypestring, [position[0], position[1]], [0, 0], coord.id, portal.id, "Deleted", "What more do you need?", current_user.email)
		return jsonify({"message": "Success"})