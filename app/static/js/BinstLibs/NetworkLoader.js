

function dist(x1,y1,x2,y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt( a*a + b*b );
}

function removeAndDestroySprite(sprite) {
    if (sprite.constructor == PIXI.Sprite) {
        let tmp =  sprite.parent
        if (tmp != null)
            tmp.removeChild(sprite);
        if (sprite != null)
            sprite.destroy({texture:true,baseTexture:true})
    }
}

var PollingInterval = 500
function PollingFunction() {
    let position = new Vector(
            (Uservector.x + (vecScreen.x/2)) / unitsize,
            (Uservector.y + (vecScreen.y/2)) / unitsize
        )
    socket.emit('PollForUpdates',
    {
        data:   "THERE IS NO DATA",
        posx:   position.x,
        posy:   position.y,
        radius: 1000
    });
}

class NetworkLoader {
    constructor(Startvector) {
        this.disttonextload = 1500
        this.immediatebufferRadius = 3000
        this.spreadbufferRadius = 6000
        this.allitems = []
        this.trail = []
        this.logNetworkLoader = false
        this.lastloadedat = Startvector
        //this.load(0,0)

        this.setupSocketLoadCallback()
        this.setupSocketUpdateCallback()
        this.refresh(Startvector.x,Startvector.y)
    }

    haveloadedblock(xpos,ypos) {
        for (let b = 0; b < this.loadedBlocks.length;b++) {
            if (this.loadedBlocks[0] == xpos && this.loadedBlocks[1] == ypos) {
                return true
            }
        }
        return false
    }

    refresh(posxt,posyt) {
        this.lastloadedat.x = posxt
        this.lastloadedat.y = posyt
        socket.emit('LoadAreaRadius', {data: "THERE IS NO DATA", posx:posxt, posy:posyt, radius: this.immediatebufferRadius});

        loadingPosition = true
    }

    setupSocketUpdateCallback() {
        socket.on('ItemUpdated', function(fromserver) {
            //console.log("Got item update. Perpetuating")
            //for (let i = 0; i < drawables.length;i++) {
            //    if (drawables[i].itemtype == fromserver.itemtype) {
            //        if (drawables[i].postid == fromserver.itemid) {
            //            let drawable = drawables[i]
            //            drawable.vecposition = new Vector(fromserver.posx,fromserver.posy)
            //            drawable.dirty = true
            //            drawable.positionChangedForConns = true
            //            console.log("Found and updated the item")
            //            completedSomeLoad()
            //            completedSomeLoad()
            //            break
            //        }
            //    }
            //}
        });

        socket.on('Updates', function(fromserver) {
            if (this.logNetworkLoader)console.log(fromserver.Updates.length + "Updates")
            newFeedUpdates(fromserver.FeedUpdates)
            for (let i = 0; i < fromserver.Updates.length;i++) {
                let update = fromserver.Updates[i]
                if (update.sItemType != "User") {
                    let widget = widgetManager.getWidget(update.sItemType)
                    let dataComponent = widget.DataComponents[update.Coordinateid]
                    let givenTowidget = false
                    if (update.updateDetails == "NewPosition") {
                        widgetManager.animateDataComponentTo(dataComponent,[update.posx,update.posy])
                        //widget.UpdatePosition(dataComponent, update)
                        givenTowidget = true
                    }
                    if (update.updateDetails == "Created") {
                        widget.UpdateCreate(dataComponent, update)
                        givenTowidget = true
                    }
                    if (update.updateDetails == "Deleted") {
                        widget.UpdateDelete(dataComponent, update)
                        givenTowidget = true
                    }
                    if (!givenTowidget) {
                        widget.UpdateOther(dataComponent, update)
                    }
                } else {
                    let bob24 = peopleManager.getPerson(update.Data1)

                    if (update.updateDetails == "NewDetails") {
                        socket.emit('LoadPerson', {data: "TestData21", email: update.Data1});
                    } else {
                        bob24.IsInRangeTimer = 120
                        var oldvector = new Vector(bob24.MapPosition[0],bob24.MapPosition[1])
                        var newposition = new Vector(update.posx,update.posy)
                        var diff = new Vector(newposition.x - oldvector.x, newposition.y - oldvector.y)
                        AddLoop()
                        $({
                            tmpval: bob24.MapPosition[0],
                            tmpval2: bob24.MapPosition[1],
                            tmpval3: bob24.zoomlevel,
                            email: update.Data1
                            }).animate({
                            tmpval: update.posx,
                            tmpval2: update.posy,
                            tmpval3: update.Data2,
                            email: update.Data1
                            }, {
                            duration: 200,
                            step: function(tmpval,fx) {
                                let bob24 = peopleManager.getPerson(checkForNan(fx.elem.email))
                                bob24.MapPosition[0] = fx.elem.tmpval
                                bob24.MapPosition[1] = fx.elem.tmpval2
                                bob24.zoomlevel = fx.elem.tmpval3
                            },
                            done: function(tmpval,fx) {
                                MinusLoop()
                            }
                        });
                    }
                }
            }
        });
    }

    setupSocketLoadCallback() {
        socket.on('LoaderData', function(fromserver) {
            let len = fromserver.coords.length
            for (let iCounter = 0;iCounter < len;iCounter = iCounter + 1) {
                 fromserver.coords[iCounter].canskip = false
                 for (let widget in widgetManager.widgets) {
                    let dataComponents = widgetManager.getWidget(widget).DataComponents
                    if (fromserver.coords[iCounter].coordid in dataComponents && fromserver.coords[iCounter].Updated == 0) {
                        fromserver.coords[iCounter].canskip = true
                        break
                    }
                }
                if (!fromserver.coords[iCounter].canskip) {
		    	    //let dcitem = fromserver.coords[iCounter]
		    	    // Naturally replace existing items because the corrdinateID will be overwritten
                    widgetManager.PopulateWithItem(fromserver.coords[iCounter])
                    // Make a nice effect if this item is added after init load.
                    if (fromserver.coords[iCounter].Updated == 1) {
                        let pos = new Vector(fromserver.coords[iCounter].xcoord,fromserver.coords[iCounter].ycoord)
                        let size = new Vector(fromserver.coords[iCounter].xsize,fromserver.coords[iCounter].ysize)
                    }
		    	}
		    }
		    loadingPosition = false
		    completedSomeLoad()
        });
    }

    loadnewposition(vecPos) {
        this.refresh(vecPos.x,vecPos.y)
    }

    updatePosition(vecPosition) {
        this.trail.push(vecPosition)
        if (this.trail.length > 50) {
            this.trail.splice(0,1)
        }
        if (dist(vecPosition.x, vecPosition.y, this.lastloadedat.x, this.lastloadedat.y) > this.disttonextload) {
            if (this.logNetworkLoader)console.log("Loading new position at " + vecPosition.x + ":" + vecPosition.y)
            this.loadnewposition(vecPosition)
        }
    }
}



//# sourceURL=LoaderClass.js