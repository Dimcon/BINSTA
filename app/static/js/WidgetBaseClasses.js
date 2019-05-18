
class Rect {
    constructor(left, top, right,bottom) {
        this.l = left
        this.t = top
        this.r = right
        this.b = bottom
        this.roundness = 0
    }
    ispointinrect(vecPoint) {
        if (vecPoint.x > this.l) {
            if (vecPoint.x < this.r) {
                if (vecPoint.y < (this.b)) {
                    if (vecPoint.y > this.t) {
                        return true
                    }
                }
            }
        }
        return false
    }
    width() {
        return this.r - this.l
    }
    height() {
        return this.b - this.t
    }
    RelTo(unitsize) {
        return new Rect(this.l * unitsize,this.t * unitsize,this.r * unitsize,this.b * unitsize)
    }

    RelFrom(unitsize) {
        return new Rect(this.l / unitsize,this.t / unitsize,this.r / unitsize,this.b / unitsize)
    }

    draw() {
        rect(this.l, this.t,this.width(),this.height(),this.roundness)
    }

    drawtobufer(buffer) {
        buffer.rect(this.l, this.t,this.width(),this.height(),this.roundness)
    }
}

class positionrect extends Rect {
    constructor() {
        super()
        this.vecposition = createVector(0,0)
        this.vecsize = createVector(0,0)
        this.zdepth = 0
        this.ispointinrect = function (vecPoint) {
            this.l = this.vecposition.x
            this.t = this.vecposition.y
            this.r = this.vecposition.x + this.vecsize.x
            this.b = this.vecposition.y + this.vecsize.y
            if (vecPoint.x > this.l) {
                if (vecPoint.x < this.r) {
                    if (vecPoint.y < (this.b)) {
                        if (vecPoint.y > this.t) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }

    centerx() {
        return this.vecposition.x + (this.vecsize.x / 2)
    }

    centery() {
        return this.vecposition.y + (this.vecsize.y / 2)
    }

    getsize() {
        return this.vecsize
    }

    getpos() {
        return this.vecposition
    }



    candraw(UnitSize) {
        this.UnitSize = UnitSize
        let candrawtmp = true
        let posright = (this.vecposition.x + this.vecsize.x)  * UnitSize
        let posleft = (this.vecposition.x)  * UnitSize
        let posbottom = (this.vecposition.y + this.vecsize.y)  * UnitSize
        let postop = (this.vecposition.y)  * UnitSize
        if (posright < Uservector.x || posbottom < Uservector.y) {
            candrawtmp = false
        }
        if (posleft > Uservector.x + vecScreen.x || postop > Uservector.y + vecScreen.y) {
            candrawtmp = false
        }
        return candrawtmp
    }
}

class draggable extends positionrect {
    constructor(owned,mustSetNewPosition,itemid,itemtype) {
        super()
        this.owned = owned
        this.coordid = itemid
        this.itemtype = itemtype
        this.isdragging = mustSetNewPosition
        this.hasdrag = false
        this.topconnect = new connectable(owned,itemid,itemtype)
        this.bottomconnect = new connectableSocket(itemid,itemtype)
        this.positionChangedForConns = true
        this.hasMouseMovehandler = false
    }
    isrelvecinside(relvec) {
        if (relvec.x > 0 && relvec.x < 1) {
            if (relvec.y > 0 && relvec.y < 1) {
                return true
            }
        }
        return false
    }
    ondragrelease(vecRelativeClickPos,actualcoords) {
        this.hasdrag = false
        this.startedDrag = false
        return false
    }

    getUnownedFences() {
        let fences = []
        for (let i = 0; i < drawables.length;i++) {
            let item = drawables[i]

            if (item.itemtype == "RadialFence" && !item.owned) {
                let found = false
                let users = item.usersthatcanadd
                for (let j = 0; j < users.length;j++) {
                    if (users[j] == useremail) {
                        found = true
                    }
                }
                if (!found) {
                    fences.push(item)
                }
            }
        }
        return fences
    }



    ondragdrag(vecRelativeClickPos,actualcoords) {
       if (this.startedDrag) {
            if (this.isdragging) {
                let deltapoints = createVector(actualcoords.x -  this.oldmousepoints.x,actualcoords.y -  this.oldmousepoints.y)
                let posx = this.olduserpointsForTouchEvent.x + (deltapoints.x / this.UnitSize)
                let posy = this.olduserpointsForTouchEvent.y + (deltapoints.y / this.UnitSize)
                this.vecposition.x = posx
                this.vecposition.y = posy

                let intersecting = true
                let counter = 0
                while (counter < 5 && intersecting) {
                    let fences = this.getUnownedFences()
                    let intersectingFences = []
                    intersecting = false
                    for (let i = 0; i < fences.length;i++) {
                        let fence = fences[i]
                        if (fence.isRectIntersecting(this.vecposition,this.vecsize)) {
                            intersectingFences.push(fence)
                            intersecting = true
                        }
                    }
                    if (intersecting) {
                        for (let i = 0; i < intersectingFences.length;i++) {
                            let fence = intersectingFences[i]
                            let fenceCenter = getCenter(fence.vecposition,fence.vecsize)
                            let ownCenter = getCenter(this.vecposition,this.vecsize)
                            let verticalDisplace = false
                            if (abs(fenceCenter.x - ownCenter.x) < abs(fenceCenter.y - ownCenter.y)) {
                                verticalDisplace = true
                            }
                            let newCenter = fence.rectNewCenterOnPosBan(this.vecposition,this.vecsize)
                            let newposx = newCenter.x - (this.vecsize.x / 2)
                            let newposy = newCenter.y - (this.vecsize.y / 2)
                            this.vecposition.x = newposx
                            this.vecposition.y = newposy
                        }
                    }
                    counter += 1
                }



                this.hasdrag = true
                return true
            }
            return false
         }
         return false
    }
    toggledrag(vecRelativeClickPos,actualcoords) {
        this.isdragging = !this.isdragging
        if (!this.isdragging) {
            this.positionChangedForConns = true
        }
        resetCanvasDrag()
        this.oldmousepoints = copyvec(actualcoords)
        this.olduserpointsForTouchEvent = copyvec(this.vecposition)
    }

    dodrag(vecRelativeClickPos,actualcoords) {
        if (!this.isdragging) {
           return false
        }
        this.oldmousepoints = copyvec(actualcoords)
        this.olduserpointsForTouchEvent = copyvec(this.vecposition)
    }

}



class connectable {
    constructor(owned,itemid,itemtype) {
        this.conns = []
        // TODO: Connection links really need to be made their own object. This is clunky
        // 0 positionrect
        // 1 connSocket
        // 2 Boolean to know if clicked
        // 3 Link id (For deletion purposes)
        // 4 boolean - Is Hovering?
        // 5 Connected draggable
        this.owned = owned
        this.UnitSize = 0
        this.midx = 0
        this.startY = 0
        this.elsize = 0.4*this.UnitSize
        this.elpad = 0.1*this.UnitSize
        this.selcon = -1
        this.newclickrect = new Rect(0,0,0,0)
        this.itemid = itemid
        this.itemtype = itemtype
    }

    addNewConnection(secondConn) {

    }

    changeSize(UnitSize,midx,startY) {
        this.UnitSize = UnitSize
        this.midx = midx
        this.startY = startY
    }

    draw(UnitSize) {
        this.elsize = 0.4*unitsize
        this.elpad = 0.1*unitsize

        let newmid = -Uservector.x + (this.midx * unitsize)
        let newStarty = -Uservector.y + (this.startY * unitsize)
        let start = 0
        if (this.owned) {
            start = newmid - ((((this.conns.length + 1) * (this.elsize)) + ((this.conns.length) * this.elpad))/2)
        } else {
            start = newmid - ((((this.conns.length) * (this.elsize)) + ((this.conns.length) * this.elpad))/2)
        }
        let showconatheight = 10
        push()
        fill(255)
        let grey = color(150,150,150,255)
        let darkgrey = color(32,38,45,120)
        let lightgrey = color(82,88,104,120)

        for (let i = 0;i < this.conns.length;i++) {
            let element = this.conns[i]
            element[0].vecposition.x = start + (i * this.elsize) + (i * this.elpad)
            element[0].vecposition.y = newStarty
            element[0].vecsize.x = this.elsize
            element[0].vecsize.y = this.elsize
            strokeWeight(2)

            stroke(grey)
            let newvecposition = element[1][0].vecposition
            let newvecsize = element[1][0].vecsize
            if (newvecposition.x == 0 && newvecposition.y == 0) {
            } else {
                let x1 = element[0].centerx()
                let y1 = element[0].centery() + (1.40 * unitsize)
                let x2 = newvecposition.x + (newvecsize.x /2)
                let y2 = newvecposition.y + (newvecsize.y /2)
                let pulldist = abs(y1 - y2) / 2
                pulldist = max(pulldist,1 * unitsize)
                //pulldist = 1.5 * unitsize
                noFill()
                bezier(x1, y1, x1, y1 - pulldist, x2, y2 + pulldist, x2, y2);
            }
            if (element[2] == true) {
                fill(0)
            } else {
                fill(grey)
            }
            if (UnitSize > showconatheight) {
                let pos = element[0].vecposition
                let size = element[0].vecsize
                stroke(grey)
                ellipse(pos.x + (size.x/2),pos.y + (size.y/2),size.x / 3,size.y / 3)
                let offset = 0.2*unitsize
                if (element[4]) {
                    let center = getCenter(pos, size)
                    let upperleft = createVector(center.x - offset,center.y - offset)
                    let upperright = createVector(center.x + offset,center.y - offset)
                    let lowerleft = createVector(center.x - offset,center.y + offset)
                    let lowerright = createVector(center.x + offset,center.y + offset)
                    stroke(255,0,0)
                    strokeWeight(4)
                    line(upperleft.x, upperleft.y, lowerright.x,lowerright.y)
                    line(lowerleft.x, lowerleft.y, upperright.x,upperright.y)
                }
            }

        }
        if (this.owned) {
            let newconnx = start + (this.conns.length * this.elsize) + (this.conns.length * this.elpad)
            this.newclickrect.l = newconnx + (this.elsize/2)
            this.newclickrect.t = newStarty + (this.elsize/2)
            this.newclickrect.r = newconnx + (this.elsize/2) + this.elsize
            this.newclickrect.b = newStarty + (this.elsize/2) + this.elsize
            if (UnitSize > showconatheight) {
                noFill()
                stroke(grey)
                strokeWeight(1)
                ellipse(this.newclickrect.l, this.newclickrect.t,this.elsize,this.elsize)
            }
        }
        pop()
    }

    onMouseMove(posx,posy) {
        if (this.owned) {
            for (let i = 0;i < this.conns.length;i++) {
                let element = this.conns[i]
                let tl = element[0].vecposition.x
                let tt = element[0].vecposition.y
                let tr = element[0].vecposition.x + element[0].vecsize.x
                let tb = element[0].vecposition.y + element[0].vecsize.y
                let hover = false
                if (posx > tl) {
                    if (posx < tr) {
                        if (posy < tb) {
                            if (posy > tt) {
                                element[4] = true
                                invalidate()
                                continue
                            }
                        }
                    }
                }
                if (element[4]) {
                    element[4] = false
                    invalidate()
                }

            }
        }
        return false
    }

    click(posx,posy) {
        if (this.owned) {
            if (this.newclickrect.ispointinrect(createVector(posx,posy))) {
                StartConnectionAtItem(this)
            }
            for (let i = 0;i < this.conns.length;i++) {
                let element = this.conns[i]
                let tl = element[0].vecposition.x
                let tt = element[0].vecposition.y
                let tr = element[0].vecposition.x + element[0].vecsize.x
                let tb = element[0].vecposition.y + element[0].vecsize.y
                let clicked = false
                if (posx > tl) {
                    if (posx < tr) {
                        if (posy < tb) {
                            if (posy > tt) {
                                clicked = true
                            }
                        }
                    }
                }
                if (clicked) {
                       removeConnection(element, this.conns)
                }
            }
        }
        return false
    }

    mouseCoords(posx,posy) {

    }

}

class connectableSocket {
    constructor(itemid,itemtype) {
        this.conns = []
        this.UnitSize = 0
        this.midx = 0
        this.startY = 0
        this.elsize = 0.4*this.UnitSize
        this.elpad = 0.1*this.UnitSize
        this.selcon = -1
        this.newclickrect = new Rect(0,0,0,0)
        this.itemid = itemid
        this.itemtype = itemtype
    }

    addNewConnection(secondConn) {

    }

    changeSize(UnitSize,midx,startY) {
        this.UnitSize = UnitSize
        this.midx = midx
        this.startY = startY

    }

    draw(UnitSize) {
        this.elsize = 0.4*UnitSize
        this.elpad = 0.1*UnitSize
        let grey = color(150,150,150,255)
        let darkgrey = color(32,38,45,120)
        let lightgrey = color(82,88,104,120)
        let newmid = -Uservector.x + (this.midx * unitsize)
        let newStarty = -Uservector.y + (this.startY * unitsize)

        let start = newmid - ((((this.conns.length + 1) * (this.elsize)) + ((this.conns.length) * this.elpad))/2)

        let showconatheight = 10
        push()
        fill(grey)
        stroke(grey)


        for (let i = 0;i < this.conns.length;i++) {
            let element = this.conns[i]
            element[0].vecposition.x = start + (i * this.elsize) + (i * this.elpad)
            element[0].vecposition.y = newStarty
            element[0].vecsize.x = this.elsize
            element[0].vecsize.y = this.elsize
            fill(grey)
            if (UnitSize > showconatheight) {
                let pos = element[0].vecposition
                let size = element[0].vecsize
                ellipse(pos.x + (size.x/2),pos.y + (size.y/2),size.x / 3,size.y / 3)
            }

        }
        pop()
    }

    click(posx,posy) {
    }

    mouseCoords(posx,posy) {

    }

}


//# sourceURL=WidgetBaseClasses.js