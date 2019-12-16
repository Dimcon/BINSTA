from app import db
from app.WidgetClasses.WidgetBase import *
from app.ClientSocketUpdater import *
from app.helpers import *

class NetoLoopWidgetClass(positionalItemBaseTemplate):

	def __init__(self):
		positionalItemBaseTemplate.__init__(self)
		self.itemtypestring = "NetLoopWidget"
		self.itemtypeint = 6
		self.ItemSubTypeString = ""

	def appendDataForPortrayal(self,objectid,fromserver):
		instance = dbget(NetInstance,id=objectid)
		fromserver['instanceID'] = instance.id
		objtype = dbhget(instance.hashkey,"instanceType")
		fromserver['instanceType'] = objtype

	def createObject(self,**kwargs):
		posx = kwargs.get('position')[0]
		posy = kwargs.get('position')[1]
		data = kwargs.get('wdata')
		type = data["instanceType"]
		appid = data["applicationID"]
		instance = NetInstance()
		dbputandcommit(instance)
		hashkey = "dataStore" + str(appid) + ":" + str(instance.id) + ":"
		instance.hashkey = hashkey
		#dbhset(hashkey, "instanceID", instance.id, "false", datetime.datetime.now().isoformat())
		#dbhset(hashkey, "instanceType", type, "false", datetime.datetime.now().isoformat())
		for key in data:
			if not key[-8:] == ":indexed":
				indexed = key + ":indexed" in data and data[key + ":indexed"] == "true"
				if indexed:
					indexed = "true"
				else:
					indexed = "false"
				dbhset(hashkey, key, unicode(data[key]), indexed, datetime.datetime.now().isoformat())
		dbhset(hashkey, "OwnerEmail", current_user.email, "true", datetime.datetime.now().isoformat())
		emit('instanceCreated', {'instanceID': instance.id, 'instanceType':type, 'applicationID': appid})

		newcoord = Coordinate(backreftype=self.itemtypeint,
		                     backrefid=instance.id,
		                     coords=";".join([str(posx), str(posy)]),
		                     squaresize=";".join([str(20), str(20)]),
		                     gridid=getGridBlockId([int(posx), int(posy)])
		                     )
		dbputandcommit(newcoord)
		instance.coordid = newcoord.id
		dbcommit()
		pushPositionUpdateToRedis(self.getItemString(), [posx,posy], [20,20],newcoord.id, instance.id, "Created", str(newcoord.id), current_user.email)
		result = jsonify({"instanceID": str(instance.id), "coordid": str(newcoord.id)})
		return result.data

	def updateObject(self,objectid,*args):
		#Object can't be updated for now. Delete and recreate is the only way.
		pass

	def updateObjectPosition(self,objectid,position,size):
		instance = dbget(NetInstance, id=objectid)
		coord = dbget(Coordinate, id=int(instance.coordid))
		if coord is None:
			newcoord = Coordinate(backreftype=self.itemtypeint,
			                      backrefid=instance.id,
			                      coords=";".join([str(position[0]), str(position[1])]),
			                      squaresize=";".join([str(20), str(20)]),
			                      gridid=getGridBlockId([int(position[0]), int(position[1])])
			                      )
			db.session.add(newcoord)
			db.session.commit()
		else:
			coord.backreftype = 3
			coord.backrefid = int(self.itemtypeint)
			coord.coords = ";".join([str(position[0]), str(position[1])])
			coord.squaresize = ";".join([str(size[0]), str(size[1])])
			coord.gridid = getGridBlockId([int(position[0]), int(position[1])])
			db.session.commit()
		poststring = self.itemtypestring
		pushPositionUpdateToRedis(poststring, position, size, coord.id, instance.id, "NewPosition", str(coord.id), current_user.email)


	def deleteObject(self,objectid, coordid):
		# TODO: You're gonna want this in there buddy..
		# TODO: You're gonna want this to reflect a non hardcoded appid
		instance = dbget(NetInstance, id=objectid)
		db.session.delete(instance)
		hashkey = "dataStoreBINSTA:" + str(objectid) + ":"
		dbhdelete(hashkey)
		pushPositionUpdateToRedis(self.getItemString(), [0,0], [0,0], coordid, coordid, "Deleted", coordid, current_user.email)
		return jsonify({"message": "Success"})