

class TextPost {
    constructor() {
        this.ItemType = "Userpost"
        this.ItemSubclass = "TextPost"
        this.ItemSubclassID = 1
        this.DataComponents = {}

    }

    initDataStructure(DataComponent, initItem) {
        widgetManager.FillDataComponentsWithBaseData(initItem,DataComponent,new Vector(50,50))
        DataComponent.type = this.ItemType + this.ItemSubclassID
        DataComponent.zdepth = 10
        let fX = 1
        let fY = DataComponent.vecsize.y / DataComponent.vecsize.x
        DataComponent.text = "..."
        delete DataComponent.defaultbuttons["Edit"]
        DataComponent.drawtext = true
        DataComponent.hasMouseMovehandler = true
        DataComponent.textsize = 25
        this.setupGraphics(DataComponent)

        this.DataComponents[DataComponent.coordinateID] = DataComponent
        this.loadpost(initItem.postid)
    }

    setupGraphics(DataComponent) {
        DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let tsize = getScaleText(DataComponent.text)

        let textstyle = new PIXI.TextStyle({
            //font:"35px Verdana",
            fontFamily: BodyFont,
            fontSize: tsize,
            fontWeight: 'normal',
            fill: BodyColor,
            fillGradientType: 2,
            stroke: '#d8d8d8',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: DataComponent.vecsize.x*50,
            breakWords:true,
            align:'Justified'
        })
        let RenderText = new PIXI.Text(DataComponent.text, textstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let textMetrics = PIXI.TextMetrics.measureText(DataComponent.text, textstyle)
        let TextSprite = RenderTextToSprite(RenderText)

        let width =  textMetrics.width + (1 * 50)
        let height = textMetrics.height + (0.5 * 50) + (0.35*50)

        DataComponent.vecsize.y = height / 50
        DataComponent.vecsize.x = width / 50

        graphics.lineStyle(2, 0x222222, 1);
        graphics.beginFill(0x383838);
        graphics.drawRoundedRect(0, 0, width, height,8);
        graphics.endFill();
        graphics.alpha = 1
        graphics.on('mousedown', widgetManager.OnReportDataComponentPressed)
        TextSprite.position.x = (0.5 * 50)
        TextSprite.position.y = (0.25 * 50)

        DataComponent.RenderText= RenderText
        //graphics.filters = [Bloomfilter]
        DataComponent.sprite.addChild(graphics)



        DataComponent.sprite.addChild(TextSprite)
        //DataComponent.sprite.cacheAsCanvas = true
        if (!debugDisableUserContent)
            stage.addChild(DataComponent.sprite)

        widgetManager.setupDataComponentReportButton(DataComponent, width, height)

        DataComponent.moveHandlers["start"] = function(DataComponent) {
            graphics.alpha = 0.1
        }
        DataComponent.moveHandlers["end"] = function(DataComponent) {
            graphics.alpha = 1
        }

        if (DataComponent.ownerdefined) {
            widgetManager.setupDataComponentProfileDraw(DataComponent)
            widgetManager.setupDataComponentReplyButton(DataComponent, width, height)
            if (DataComponent.owneremail == useremail) {
                widgetManager.setupDataComponentMoveButton(DataComponent, -0.9 * 50, 0.75 * 50,
                    function(DataComponent) {
                        DataComponent.dragdata.isdragging = !DataComponent.dragdata.isdragging
                        if (!DataComponent.dragdata.isdragging) {
                            widgetManager.getWidget("Userpost1").broadcastChange(DataComponent)
                            DataComponent.sprite.alpha = 1
                        } else {
                            DataComponent.sprite.alpha = 0.7
                        }
                       //AddRipple({
                       //        "color":color(52,58,100)
                       //    })
                       DataComponent.dirty = true
                       return true
                    }
                )
                widgetManager.setupDataComponentDeleteButton(DataComponent, -1.8 * 50, 0.75 * 50)
            }
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
        //let centre = getCenter(DataComponent.vecposition,DataComponent.vecsize)
        //AddRipple({
        //    "color":color(255,80,80),
        //    "duration":3000,
        //    "maxRadius":50,
        //    "maxTransparency":200,
        //    "position": centre,
        //    "maxthickness":5,
        //    "CoordsRelative":true
        //})
        if (typeof DataComponent !== 'undefined') {
            removeAndDestroySprite(DataComponent.sprite)
            delete widgetManager.getWidget("Userpost1").DataComponents[DataComponent.coordinateID]
        }
    }

    UpdateOther(DataComponent,updateItem) {
        console.log("Other kind of update")
    }

    broadcastChange(DataComponent) {
        $.post("/setposition",{
			objecttype: "Userpost",
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
    	//dataComponent.RenderText.text = dataComponent.text
    	dataComponent.owneremail = fromserver.post.email
    	dataComponent.ownerdefined = true

    	dataComponent.dirty = true
    	//this.resizeFromText(dataComponent)
    	dataComponent.vecsize = new Vector(10,10)
    	//let size = getSizeOfRectFromText(dataComponent.textsize,0.6,dataComponent.text)
    	stage.removeChild(dataComponent.sprite);
    	this.setupGraphics(dataComponent)
    	invalidate()
    }

    resizeFromText(datacomponent) {
        //let size = getSizeOfRectFromText(datacomponent.textsize,0.6,datacomponent.text)
        //datacomponent.vecsize = new Vector((size.x + (50))/50,(size.y + (50))/50)
        //datacomponent.buffer = createGraphics(
        //    size.x + (50),
        //    size.y + (50)
        //);
        //datacomponent.dirty = true
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
        if (IsWithinViewingRectangle(dataComponent,unitsize)) {
            if (ispointinrect(vecRelativeClickPos, new Vector(0,0), new Vector(1,1))) {
                return defferreddraggable.StartDrag(dataComponent,actualcoords)
            }
        }
        return false
    }

    onClickUp(dataComponent,vecRelativeClickPos,actualcoords) {
        return defferreddraggable.StopDrag(dataComponent)
    }

    onClickDrag(dataComponent,vecRelativeClickPos,actualcoords) {
        if (defferreddraggable.PerformDrag(dataComponent,actualcoords)) {
            return true
        }
        return false
    }

    draw(DataComponent,UnitSize) {
        let newvecposition = ScreenCoordToPlaneCoord(DataComponent.vecposition)
        let fX = ScreenSizeToPlaneSize(DataComponent.vecsize).x / 100
        let fY = ScreenSizeToPlaneSize(DataComponent.vecsize).y / 100
        let scale = unitsize / 50
        DataComponent.sprite.position.x = newvecposition.x
        DataComponent.sprite.position.y = newvecposition.y
        DataComponent.sprite.scale.x = scale
        DataComponent.sprite.scale.y = scale

    }
}



//# sourceURL=TextPostWidget.js