


function copyvec(oldvector) {
    return new Vector(oldvector.x,oldvector.y)
}

function checkForNan(item) {
    let substri = item.substr(0,3)
    if (substri == "NaN") {
        newstr = item.substr(3)
        return newstr
    }
    return item
}

function getDrawableByCoord(coordid) {
    for (let i = 0; i < drawables.length;i++) {
        drawable = drawables[i]
        if (drawable.coordid == coordid) {
            return drawable
        }
    }
}




function RenderTextToBitmap(RenderText) {
    //let textMetrics = PIXI.TextMetrics.measureText(RenderText.text, RenderText.style)
    //let texture = PIXI.RenderTexture(renderer, textMetrics.width, textMetrics.height);
    //app.renderer.generateTexture()

    //renderer.render(RenderText,texture)

    let texture1 = renderer.generateTexture(RenderText)
    return texture1
}

function RenderTextToSprite(RenderText) {
    let texture = RenderTextToBitmap(RenderText)
    let sprite = new PIXI.Sprite(texture)
    return sprite
}










// ######## FENCE RELATED STUFF
var creatingFenceStatus = 0 // 0 = No fences being created
                            // 1 = Must draw fence at User crosshair

function handleFences() {
    if (creatingFenceStatus == 1) {
        noFill()
        strokeWeight(2)
        stroke(100,100,200)
        ellipse(vecScreen.x / 2,vecScreen.y / 2,5*spacer,5*spacer)
    }
}

// ###################################




// ######## PORTAL CREATION

var newportaldetails = [] // Used to hold coordinates for both ends of portal during creation

function handlePortals() {
    if (newportaldetails.length > 0) {
        push()
        if (newportaldetails.length == 1) {
            stroke(0,0,255,255)
        } else {
            noFill()
            strokeWeight(2)
            stroke(0,0,255,255)
            var size = 3 * unitsize
            var vecportal = ScreenCoordToPlaneCoord(newportaldetails[1])
            var startx = vecportal.x
            var starty = vecportal.y
            ellipse(startx,starty,size*2,size*2)

            stroke(0,255,0,255)
        }
        noFill()
        strokeWeight(2)
        var size = 2.5 * unitsize
        var startx = (50*fXScreen)
        var starty = (50*fYScreen)
        ellipse(startx,starty,size*2,size*2)
        pop()
    }
}
// ###############

// ######## Connect sockets on drawables

function StartConnectionAtItem(conn) {
    firstConnLink = []
    firstConnLink.push(conn)
    firstConnLink.push(conn.itemid)
    firstConnLink.push(conn.itemtype)
}

function FinishConnectionAtItem(conn) {
    secondConnLink = []
    secondConnLink.push(conn)
    secondConnLink.push(conn.itemid)
    secondConnLink.push(conn.itemtype)
}

function CancelNewConnection() {
    firstConnLink = []
    secondConnLink = []
}

function addConnection(item1, item2) {
    pushNewConnection(item1, item2)
}


function removeConnection(connection, connlist) {
    $.post("/delete",{
		itemtype:"link",
		itemid:connection[3]
	}).done(function(fromserver) {
	    let otherlist = connection[5]
	    for (let i = 0; i < connlist.length;i += 1) {
	        if (connlist[i][3] == connection[3]) {
                connlist.splice(i,1)
                break
	        }
	    }
	    for (let i = 0; i < otherlist.length;i += 1) {
	        if (otherlist[i][3] == connection[3]) {
                otherlist.splice(i,1)
                break
	        }
	    }
        invalidate()
	}).fail(function() {
	    diserror("Failed to Delete connection.. Please try again.")
	})
}

function deleteDrawableWithCoordid(coordid) {

        $.post("/delete",{
	    	itemtype:"coordinate",
	    	itemid:coordid
	    }).done(function(fromserver) {
	        dissuccess("Neoow. You can almost hear the regret fly past..")
            invalidate()
        }).fail(function() {
	        diserror("Server could not be contacted. gg ez")
	    })
}

function addConnectionIds(coordid1, coordid2, posx = 0,posy = 0,linkid) {
    let item1
    let item2
    let found1 = false
    let found2 = false
    for (i = 0; i < drawables.length;i++) {
        let item = drawables[i]
        if (item.coordid == parseInt(coordid1)) {
            item1 = item
            found1 = true
        }
        if (item.coordid == parseInt(coordid2)) {
            item2 = item
            found2 = true
        }
        if (found1 && found2) {
            break
        }
    }
    if (found1 && found2) {
        addOldConnection(item2.topconnect, item1.bottomconnect,linkid)
    } else {

    }
}

function pushNewConnection(item1, item2) {
    $.post("/newconnection",{
			coord1id:item1.itemid,
			coord2id:item2.itemid
		}).done(function(fromserver) {
		    let conn2 = []
            conn2.push(new positionrect())
            conn2.push("")
            conn2.push(false)
            conn2.push(fromserver.linkid)
            conn2.push(false)
            conn2.push(item1)
            item2.conns.push(conn2)

            let conn = []
            conn.push(new positionrect())
            conn.push(conn2)
            conn.push(false)
            conn.push(fromserver.linkid)
            conn.push(false)
            conn2.push(item2)

            conn2[1] = conn

            item1.conns.push(conn)
            invalidate()
		}).fail(function() {
		    diserror("Failed to load Post")
		})
}

function addOldConnection(item1, item2, linkid) {
    let conn2 = []
    conn2.push(new positionrect())
    conn2.push("")
    conn2.push(false)
    conn2.push(linkid)
    conn2.push(false)
    conn2.push(item1)

    item2.conns.push(conn2)

    let conn = []
    conn.push(new positionrect())
    conn.push(conn2)
    conn.push(false)
    conn.push(linkid)
    conn.push(false)
    conn.push(item2)

    conn2[1] = conn

    item1.conns.push(conn)
    invalidate()
}

// ##############################

	//# sourceURL=NavigatorMisc.js