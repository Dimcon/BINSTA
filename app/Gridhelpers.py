import base64
import os, sys, time, datetime, io, math

from helpers import *
from app.models import *

# Spatial things:
# Searching through the massive coordinate system could prove difficult so
#       We will use a grid lookup system where:
	# Level 0 = minimum grid increments of 1.
	# Level 1 = Increments in 1000 * Level 0 increments
	# Level 2 = Increments in 100 * Level 1 increments
	# etc as needed

def CheckPositionLevel1(position):
	coords = getBlockCoords(position,1000)
	gridp = dbget(Grid,gridx=coords[0],gridy=coords[1])
	if gridp is None:
		gridp = Grid(
			gridlevel=1,
			gridx=coords[0],
			gridy=coords[1]
		)
		dbputandcommit(gridp)

def getGridBlockId(position):
	coords = getBlockCoords(position, 1000)
	gridp = dbget(Grid, gridx=coords[0], gridy=coords[1])
	if gridp is None:
		gridp = Grid(
			gridlevel=1,
			gridx=coords[0],
			gridy=coords[1],
			gridmoreid=1
		)
		db.session.add(gridp)
		db.session.commit()
	return gridp.id

def getBlockCoords(vecInput,levelincrements):
	xpos = (int(float(vecInput[0]))) - ((int(float(vecInput[0]))) % levelincrements)
	xpos += int(levelincrements)
	ypos = (int(float(vecInput[1]))) - ((int(float(vecInput[1]))) % levelincrements)
	ypos += int(levelincrements)
	#print("{}::{} -> {}::{}".format(vecInput[0],vecInput[1],xpos,ypos))
	return [int(xpos / levelincrements), int(ypos / levelincrements)]

def getBlockCoordsbetween(startpoint, endpoint, levelincrements):
	start = getBlockCoords(startpoint, levelincrements)
	end = getBlockCoords(endpoint, levelincrements)
	blocks = []
	for i in range(start[0],end[0]+1):
		for j in range(start[1], end[1]+1):
			blocks.append([i,j])
	return blocks

def getBlockCoordsbetweenblocks(start, end):
	blocks = []
	for i in range(start[0],end[0]+1):
		for j in range(start[1], end[1]+1):
			if not [i,j] in blocks: blocks.append([i,j])
	return blocks

def getCoordsInBlock(vecPos, gridlevel):
	griditem = dbget(Grid,gridx=vecPos[0],gridy=vecPos[1],gridlevel=gridlevel)
	if griditem is not None:
		coords = dbgetlist(Coordinate,gridid=griditem.id)
		return coords
	return []

def getBlocksSurrounding(vecPos,Radius):
	# TODO: This is expensive. Might need to optimise better.
	points = []
	step = (1.0 / (Radius)) * 30000  # 30 at radius == 1000, 0.3 at radius = 100000
	counter = 0.0
	while counter <= 360:
		npx = vecPos[0] + (math.cos(math.radians(counter)) * Radius)
		npy = vecPos[1] + (math.sin(math.radians(counter)) * Radius)
		point = getBlockCoords([npx, npy], 1000)
		if not point in points: points.append(point)
		counter += step
	points2 = []
	for p1 in points:
		for p2 in points:
			if p1[0] == p2[0] and p1[1] != p2[1]:
				for p in getBlockCoordsbetweenblocks(p1, p2):
					points2.append(p)
	for p in points2:
		if not p in points:
			points.append(p)
	return points

def getCoordsSurrounding(vecPos,Radius):
	points = []
	step = (1.0/(Radius)) * 30000 # 30 at radius == 1000, 0.3 at radius = 100000
	counter = 0.0
	while counter <= 360:
		npx = vecPos[0] + (math.cos(math.radians(counter)) * Radius)
		npy = vecPos[1] + (math.sin(math.radians(counter)) * Radius)
		point = getBlockCoords([npx,npy],1000)
		if not point in points: points.append(point)
		counter += step
	points2 = []
	for p1 in points:
		for p2 in points:
			if p1[0] == p2[0] and p1[1] != p2[1]:
				for p in getBlockCoordsbetweenblocks(p1, p2):
					points2.append(p)
	for p in points2:
		if not p in points:
			points.append(p)
	coords = []
	for p in points:
		for c in getCoordsInBlock(p, 1):
			coords.append(c)
	return coords