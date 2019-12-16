

///////////// TODO: These functions and variables are sundry. Needs new home
    var PIXIImageloaders = []
    var userCircleMask


    function getUnownedFences() {
            let fences = []
            //for(index in structures["RadialFence"].DataComponents) {
            //    datacomp = structures["RadialFence"].DataComponents[index]
            //    if (!datacomp.owned()) {
            //        fences.push(datacomp)
            //    }
            //}
            return fences
    }

    function areRectsIntersecting() {
    //TODO:This code 100% needs to be completed for fences to work properly. Needs to be written cleaner as well.
    }
/////////////////


function ScreenCoordToPlaneCoord(vecInput) {
    return new Vector(-Uservector.x + (vecInput.x * unitsize), -Uservector.y + (vecInput.y * unitsize))
}

function ScreenSizeToPlaneSize(vecSize) {
    return new Vector(vecSize.x * unitsize,vecSize.y * unitsize)
}

function getCenter(pos, size) {
    return new Vector(parseFloat(pos.x) + (parseFloat(size.x)/2),parseFloat(pos.y) + (parseFloat(size.y)/2))
}

function getMapTarget() {
    let newvec = new Vector(0,0)
    newvec.x = (Uservector.x + (vecScreen.x/2)) / unitsize
    newvec.y = (Uservector.y + (vecScreen.y/2)) / unitsize
    return newvec
}

var intersectingMargin = 1

function isIntersecting(pos1,size1,pos2,size2) {
    if (pos2.x < pos1.x + size1.x + intersectingMargin && pos2.x + size2.x + intersectingMargin > pos1.x) {
        if (pos2.y < pos1.y + size1.y + intersectingMargin && pos2.y + size2.y + intersectingMargin > pos1.y) {
            return true
        }
    }
    return false
}

class UserNavigation {
    constructor() {
        this.timeofchange = new Date()
    }

    goto(posVector,duration=500) {
        ResetBackButton()
        var oldvector = new Vector(Uservector.x,Uservector.y)
        var newposition = new Vector(posVector.x - (vecScreen.x/2),posVector.y - (vecScreen.y/2))
        var diff = new Vector(newposition.x - oldvector.x, newposition.y - oldvector.y)
        interactiondisabled = true
        AddPositionToHistory()
        this.timeofchange = new Date()
        $({tmpval: 0.0}).animate({tmpval: 1.0}, {
            duration: duration,
            step: function() {
                Uservector.x = oldvector.x + (diff.x * this.tmpval)
                Uservector.y = oldvector.y + (diff.y * this.tmpval)
                invalidate()
            },
            done: function() {
                Uservector.x = newposition.x
                Uservector.y = newposition.y
                interactiondisabled = false
                userNavigation.positionchanged(true)
                invalidate()
            }
        });
    }

    gobackto(posVector,duration=500) {
        var oldvector = new Vector(Uservector.x,Uservector.y)
         var newposition = new Vector(posVector.x - (vecScreen.x/2),posVector.y - (vecScreen.y/2))
         var diff = new Vector(newposition.x - oldvector.x, newposition.y - oldvector.y)
         interactiondisabled = true
         AddPositionToHistory()
         this.timeofchange = new Date()
         $({tmpval: 0.0}).animate({tmpval: 1.0}, {
             duration: duration,
             step: function() {
                 Uservector.x = oldvector.x + (diff.x * this.tmpval)
                 Uservector.y = oldvector.y + (diff.y * this.tmpval)
                 invalidate()
             },
             done: function() {
                 Uservector.x = newposition.x
                 Uservector.y = newposition.y
                 interactiondisabled = false
                 userNavigation.positionchanged(true)
                 invalidate()
             }
         });
    }

    gotoRelative(posVector,duration=500) {
        var oldvector = new Vector((Uservector.x + (vecScreen.x / 2))/unitsize,(Uservector.y + (vecScreen.y / 2))/unitsize)
        var newposition = new Vector(posVector.x,posVector.y)
        var diff = new Vector(newposition.x - oldvector.x, newposition.y - oldvector.y)
        interactiondisabled = true
        $({tmpval: 0.0}).animate({tmpval: 1.0}, {
            duration: duration,
            step: function() {
                Uservector.x = (oldvector.x*unitsize) + ((diff.x * this.tmpval) * unitsize) - (vecScreen.x / 2)
                Uservector.y = (oldvector.y*unitsize) + ((diff.y * this.tmpval) * unitsize) - (vecScreen.y / 2)
                invalidate()
            },
            done: function() {
                Uservector.x = (newposition.x * unitsize ) - (vecScreen.x / 2)
                Uservector.y = (newposition.y * unitsize ) - (vecScreen.y / 2)
                interactiondisabled = false
                userNavigation.positionchanged()
                invalidate()
            }
        });
    }

    ZoomTo(newunitsize,duration,disableinteraction) {
        var oldzoompos = unitsize
        var zoomdisablesinteraction = disableinteraction
        if (zoomdisablesinteraction) {
            interactiondisabled = true
        }
        var newzoompos = newunitsize
        return $({tmpval: 0.0}).animate({tmpval: 1.0}, {
            duration: duration,
            step: function() {
                let tmp = (newzoompos - oldzoompos)
                userNavigation.jumpzoomto(oldzoompos + (tmp * this.tmpval))
                $('#zoomslider').val(100 * (((unitsize - 1) / (maxzoom - 1))))
                invalidate()
            },
            done: function() {
                userNavigation.jumpzoomto(newzoompos)
                if (zoomdisablesinteraction) {
                    interactiondisabled = false
                }
                $('#zoomslider').val(100 * (((unitsize - 1) / (maxzoom - 1))) )
                userNavigation.positionchanged()
                invalidate()
            }
        });
    }

    gotoprofile() {
        //for (let i = 0; i < drawables.length;i++) {
        //    drawable = drawables[i]
        //    if (drawable.itemtype == "Profile" && drawable.owned == true) {
        //        let tmpvecpos = new Vector(drawable.vecposition.x * unitsize, drawable.vecposition.y*unitsize)
        //        let tmpsizevec = ScreenSizeToPlaneSize(drawable.vecsize)
        //        this.goto(getCenter(tmpvecpos,tmpsizevec))
        //        return
        //    }
        //}
        let position = new Vector((parseFloat(UserProfilePos[0]) + 12) * unitsize, (parseFloat(UserProfilePos[1]) + 7) * unitsize)
        this.goto(position)
    }

    jumpzoomto(newunitsize) {
        let oldunitsize = unitsize
        unitsize = newunitsize
        unitsize = Math.round(unitsize * 100) / 100
        if (unitsize < minzoom) {
            unitsize = minzoom
        }
        if (unitsize > maxzoom) {
            unitsize = maxzoom
        }
        let delta = unitsize / oldunitsize
        let tmpx1 = (-Uservector.x - (vecScreen.x/2)) / oldunitsize
        let newcentre = tmpx1 * unitsize
        let newleft = (newcentre + (vecScreen.x / 2))

        let tmpy1 = (-Uservector.y - (vecScreen.y/2)) / oldunitsize
        let newcentrey = tmpy1 * unitsize
        let newtop = (newcentrey + (vecScreen.y / 2))

        if (unitsize >= 0 && unitsize <= maxzoom + 1) {
            Uservector.x = -newleft
            Uservector.y = -newtop
        }
        spacer = (5 * unitsize)
        invalidate()
    }

    jumpzoomby(amount) {
            let oldunitsize = unitsize
            unitsize -= amount
            unitsize = Math.round(unitsize * 100) / 100
            if (unitsize < 1) {
                unitsize = 1
            }
            if (unitsize > maxzoom) {
                unitsize = maxzoom
            }
            let delta = unitsize / oldunitsize
            let tmpx1 = (-Uservector.x - (vecScreen.x/2)) / oldunitsize
            let newcentre = tmpx1 * unitsize
            let newleft = (newcentre + (vecScreen.x / 2))

            let tmpy1 = (-Uservector.y - (vecScreen.y/2)) / oldunitsize
            let newcentrey = tmpy1 * unitsize
            let newtop = (newcentrey + (vecScreen.y / 2))

            if (unitsize >= 0 && unitsize <= maxzoom + 1) {
                if (false) console.log("np = " + Uservector.x)
                Uservector.x = -newleft
                Uservector.y = -newtop
            }
            spacer = (5 * unitsize)
            invalidate()
    }

    jumpgoto(posVector) {
        var newposition = new Vector(posVector.x - (vecScreen.x/2),posVector.y - (vecScreen.y/2))
        Uservector.x = newposition.x
        Uservector.y = newposition.y
        invalidate()
    }

    positionchanged() {
        let position = new Vector(
                (Uservector.x + (vecScreen.x/2)) / unitsize,
                (Uservector.y + (vecScreen.y/2)) / unitsize
            )
        let position2 = new Vector(
                        (Uservector.x + (vecScreen.x/2)) ,
                        (Uservector.y + (vecScreen.y/2))
                    )
        let Fivesecond = 10000;
        let Fivesecondsago = new Date() - Fivesecond;
        if (this.timeofchange < Fivesecondsago) {
            addHistoryItem(position2)
            this.timeofchange = new Date()
        }
        if (connectedToSocketIOServer) {
            if (false) console.log("Pushing position update")
            socket.emit('PositionUpdate', {data: "I'M TRYNA TELL YOU WHERE I AM", posx:position.x, detailsChanged:0, posy:position.y, zoom: unitsize});
        }
    }
}


//# sourceURL=MapFunctions.js