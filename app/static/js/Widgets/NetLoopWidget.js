


let NLWWaiter = 0

var headerBarColors = {
    orange: 0x914B00,
    green: 0x005226,
    blue: 0x006356,
    grey: 0x454545
}

class NetLoopWidget {
    constructor() {
        this.ItemType = "NetLoopWidget"
        this.ItemSubclass = "0"
        this.ItemSubclassID = ""
        this.DataComponents = {}
        this.NLWs = {}

        for (let index in NLWWidgetList) {
            let name = index
            let widgetManagerurl = "static/js/NetLoopWidgets/" + name + "/widgetManager.js"
            console.log("Loading widget " + name + " from " + widgetManagerurl)
            let NLWcurrentURL = "static/js/NetLoopWidgets/" + name + "/"
            NLWWidgetList[index].push(NLWcurrentURL)
            loadJavascriptFromUrl(widgetManagerurl)
        }
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

            let instance = NetLoopWidgetManagers[instanceType].doOnLoadFunc(instanceID,DataComponent)

            networkLooper.AddInstance(instance)
            //instance.PRVSET("Position",DataComponent.vecposition.x + ";" + DataComponent.vecposition.y,false)
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
        if (updateItem.sItemType === "NetLoopWidget") {
            DataComponent = this.DataComponents[updateItem.Coordinateid]
            if (typeof DataComponent !== "undefined") {
                removeAndDestroySprite(DataComponent.sprite)
                delete this.DataComponents[updateItem.Coordinateid]
                invalidate()
            }
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
        if (vecposs == null) {

        } else {
            DataComponent.NLWInstance.onUpdate()
            let vecpos = new Vector(parseFloat(vecposs.split(";")[0]), parseFloat(vecposs.split(";")[1]))
            let newvecposition = ScreenCoordToPlaneCoord(vecpos)
            let scale = unitsize / 50
            DataComponent.sprite.position.x = newvecposition.x
            DataComponent.sprite.position.y = newvecposition.y
            DataComponent.sprite.scale.x = scale
            DataComponent.sprite.scale.y = scale
        }
    }
}

var NetLoopWidgetManagers = {}

function createNLWInstance(Position, iType,data) {

}

class NetLoopWidgetBase2 {
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

var getinputs = []
var inputindex = -1
var tempNLWManager = ""
function startNextInput() {
    if (inputindex === -1) {
        inputindex = 0
    } else {
        getinputs[inputindex][1] = $('#getStringInput').val()
        inputindex += 1
    }
    if (inputindex === getinputs.length) {
        $('#getString').addClass('hidden')
        NLWNextCreate()
    } else {
        $('#getStringHeader').html(getinputs[inputindex][0])
        $('#getString').removeClass('hidden')
    }
}

function NLWNextCreate() {
    let args = {}
    for (let index in getinputs) {
        args[getinputs[index][0]] = getinputs[index][1]
    }
    let wposition = new Vector((centerScreenRelToUser.x / unitsize) - (4), (centerScreenRelToUser.y / unitsize) - (3.5))
    tempNLWManager.doOnCreateFunc(wposition, args)
    closeNewPostWindow()
}

function cancelCreate() {
    $('#getString').addClass('hidden')
    $('#getStringHeader').addClass('hidden')
    $('#getString').val('')
    $('#getStringHeader').html('')
}
function NLWCreate(instanceType) {
    //NetLoopWidgetManagers["TextContainerWidget"].Create(new Vector(50,-20),"Lorem ipsum")
    tempNLWManager = NetLoopWidgetManagers[instanceType]
    let requiredInfo = tempNLWManager.requiredInfo
    inputindex = -1
    getinputs = []
    for (index in requiredInfo) {
        let name = index
        let type = requiredInfo[index]
        if (type === "String") {
            getinputs.push([name,""])
        }
    }
    startNextInput()
}

class NetLoopWidgetBase {
    constructor(ApplicationID, instanceType) {
        this.ApplicationID = ApplicationID
        this.instanceType = instanceType
        this.DisplayDescription = ["", "", ""]
        this.requiredInfo = {}
        this.doOnCreateFunc = (Position, args) => {}
        this.doOnLoadFunc = (iID, DataComp) => {
            return new NetLoopWidgetBase(iID, DataComp)
        }
        this.doOnDestroyFunc = () => {}
    }

    doOnCreate(myfunc) {
        this.doOnCreateFunc = myfunc
    }

    doOnLoad(myfunc) {
        this.doOnLoadFunc = myfunc
    }

    doOnDestroy(myfunc) {
        this.doOnDestroyFunc = myfunc
    }

    setDisplayImage(image) {

    }

    setDisplayDescription(Name, desc, button) {
        this.DisplayDescription = [Name, desc, button]
    }

    setDisplayRequiredInfo(RequiredInfo) {
        this.requiredInfo = RequiredInfo
    }

    Save() {
        NetLoopWidgetManagers[this.instanceType] = this
        var displayname = this.DisplayDescription[0]
        var displaydescription = this.DisplayDescription[1]

        createItemMenuItems[displayname] = [
            displayname,
            "TextStyle", //lol
            NLWCreate,
            this.instanceType,
            ""
        ]

        // let html = `<div class="card text-white bg-dark m-2 " style="width: 18rem;">
        //             <img src="" class="w-100 card-img-top" alt="">
        //             <div class="card-body">
        //                 <h5 class="card-title">${displayname}</h5>
        //                 <p class="card-text">${displaydescription}</p>
        //             </div>
        //             <div class="card-body">
        //                 <button onclick="NLWCreate('${this.instanceType}')" class="btn btn-dark btn-block">
        //                     Add
        //                 </button>
        //             </div>
        //         </div>`
        // $('#newItembody').append(html)
    }

    createNLWInstance(Position, data) {
        data["instanceType"] = this.instanceType
        data["applicationID"] = this.ApplicationID
        socket.emit("createnewitem", {
            sItemType: "NetLoopWidget",
            data: data,
            posx: Position.x,
            posy: Position.y,
        })
    }
}


//# sourceURL=NetLoopWidget.js