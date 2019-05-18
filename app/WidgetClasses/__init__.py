

from app.ClientSocketUpdater import pushPositionUpdateToRedis
from app.betterinstagram import *

from app.Gridhelpers import *

from app import db
from app.helpers import dbget, query, dbputandcommit
from app.helpers import *

from app.WidgetClasses import *
from app.WidgetClasses.Portal import *
from app.WidgetClasses.RadialFence import *
from app.WidgetClasses.UserPost import *
from app.WidgetClasses.UserProfile import *
from app.WidgetClasses.NetLoopWidget import *

def getDataStructures():
	structs = [
		UserpostClass(),
	        RadialFenceClass(),
		PortalClass(),
		ProfileClass(),
		NetoLoopWidgetClass()
	]
	structures = {item.itemtypestring: item for item in structs}
	return structures