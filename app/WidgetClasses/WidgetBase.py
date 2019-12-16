from app.ClientSocketUpdater import pushPositionUpdateToRedis
from app.betterinstagram import *

from app.Gridhelpers import *

from app import db
from app.helpers import dbget, query, dbputandcommit
from app.helpers import *

class positionalItemBaseTemplate(object):

	def __init__(self):
		self.itemtypestring = "ItemBaseClass"
		self.itemtypeint = -1
		self.ItemSubTypeString = ""

	def getItemString(self):
		return self.itemtypestring + self.ItemSubTypeString

	def appendDataForPortrayal(self,objectid,AppendToThisList):
		pass

	def createObject(self,**kwargs):
		pass

	def updateObject(self,objectid,**kwargs):
		pass

	def updateObjectPosition(self,objectid,position,size):
		pass

	def deleteObject(self,objectid, coordid):
		pass