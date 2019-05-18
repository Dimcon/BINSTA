

class NetLoopWidget {
    constructor() {
        this.ItemType = "NetLoopWidget"
        this.ItemSubclass = "0"
        this.ItemSubclassID = ""
        this.DataComponents = {}
        this.NLWs = {}
    }

    initDataStructure(DataComponent, initItem) {
        if (initItem.instanceType in NetLoopWidgetManagers)  {
            widgetManager.FillDataComponentsWithBaseData(initItem,DataComponent,new Vector(50,50))
            DataComponent.type = this.ItemType + this.ItemSubclassID
            DataComponent.zdepth = 10
            let fX = 1
            let fY = DataComponent.vecsize.y / DataComponent.vecsize.x
            DataComponent.text = "..."
            DataComponent.drawtext = true
            DataComponent.hasMouseMovehandler = true
            DataComponent.textsize = 25

            let instanceID = initItem.instanceID
            let instanceType = initItem.instanceType

            let instance = NetLoopWidgetManagers[instanceType].Load(instanceID,DataComponent)

            networkLooper.AddInstance(instance)
            instance.PRVSET("Position",DataComponent.vecposition.x + ";" + DataComponent.vecposition.y,false)
            instance.PRVNeedsSync()
            DataComponent.NLWInstance = instance
            DataComponent.sprite = new PIXI.Sprite()

            this.DataComponents[DataComponent.coordinateID] = DataComponent
        }
    }


    UpdatePosition(DataComponent,updateItem) {
        //console.log("Updated position")
        widgetManager.animateDataComponentTo(DataComponent,[updateItem.posx,updateItem.posy])
    }

    UpdateCreate(DataComponent,updateItem) {
        //console.log("Created")
        socket.emit('RequestingObjectWithCoordID',{CoordinateID: updateItem.Coordinateid});
    }

    UpdateDelete(DataComponent,updateItem) {
        if (typeof DataComponent !== 'undefined') {
            removeAndDestroySprite(DataComponent.sprite)
            delete widgetManager.getWidget(this.ItemType +  this.ItemSubclass).DataComponents[DataComponent.coordinateID]
        }
    }

    UpdateOther(DataComponent,updateItem) {
        console.log("Other kind of update")
    }

    broadcastChange(DataComponent) {
        $.post("/setposition",{
			objecttype: this.ItemType,
			objectid:DataComponent.postid,
			posx:DataComponent.vecposition.x,
			posy:DataComponent.vecposition.y,
			sizex:DataComponent.vecsize.x,
			sizey:DataComponent.vecsize.y
		}).done(function(fromserver) {
			dissuccess("You might like it there!")
		}).fail(function() {
		    diserror("Woah okay we can't find the internet. Uhm do it again?")
		})
    }

    loadpost(postid) {
        socket.emit('loadpost', {postid:postid});
    }

    loadCallBack(fromserver) {
        let dataComponent = this.DataComponents[fromserver.post.coordid]
    	dataComponent.text = fromserver.post.details
    	dataComponent.owneremail = fromserver.post.email
    	dataComponent.ownerdefined = true

    	dataComponent.dirty = true
    	dataComponent.vecsize = new Vector(10,10)
    	stage.removeChild(dataComponent.sprite);
    	this.setupGraphics(dataComponent)
    	invalidate()
    }

    resizeFromText(datacomponent) {
    }

    setupSocketCallbacks() {
    }

    onMouseMoveOutside(DataComponent,vecRelativeClickPos,actualcoords) {
        animProfileLineOut(DataComponent)
        //invalidate()
    }

    onMouseMove(DataComponent,vecRelativeClickPos,actualcoords) {
        animProfileLineIn(DataComponent)
        //invalidate()
    }

    onClickDown(dataComponent,vecRelativeClickPos,actualcoords) {
        return false
        if (IsWithinViewingRectangle(dataComponent,unitsize)) {
            if (ispointinrect(vecRelativeClickPos, new Vector(0,0), new Vector(1,1))) {
                dataComponent.dragdata.isdragging = true
                return defferreddraggable.StartDrag(dataComponent,actualcoords)
            }
        }

    }

    onClickUp(dataComponent,vecRelativeClickPos,actualcoords) {
        return false
        //nlwinput.spriteReleaseDefault(dataComponent)
        return defferreddraggable.StopDrag(dataComponent)
    }

    onClickDrag(dataComponent,vecRelativeClickPos,actualcoords) {
        return false
        if (defferreddraggable.PerformDrag(dataComponent,actualcoords)) {
            return true
        }
        return false
    }

    draw(DataComponent,UnitSize) {
        let vecposs = DataComponent.NLWInstance.get("Position")
        DataComponent.NLWInstance.onUpdate()
        let vecpos = new Vector(parseFloat(vecposs.split(";")[0]),parseFloat(vecposs.split(";")[1]))
        let newvecposition = ScreenCoordToPlaneCoord(vecpos)
        let scale = unitsize / 50
        DataComponent.sprite.position.x = newvecposition.x
        DataComponent.sprite.position.y = newvecposition.y
        DataComponent.sprite.scale.x = scale
        DataComponent.sprite.scale.y = scale

    }
}

var NetLoopWidgetManagers = {}

function createNLWInstance(Position, iType,data) {

}

class NetLoopWidgetBase {
    constructor() {
        this.ApplicationID = "BINSTA"
        this.instanceType = ""
    }

    createNLWInstance(Position,data) {
        data["instanceType"] = this.instanceType
        data["applicationID"] = this.ApplicationID
        socket.emit("createnewitem", {
                sItemType: "NetLoopWidget",
                data: data,
                posx:Position.x,
                posy:Position.y,
        })
    }

    Create(Position, data) {

    }

    Destroy() {

    }

    Load(iID,DataComp) {
        return new NetLoopWidgetBase(iID,DataComp)
    }
}


//# sourceURL=NetLoopWidget.js