

class Profile {
    constructor() {
        this.ItemType = "Profile"
        this.ItemSubclass = ""
        this.ItemSubclassID = ""
        this.DataComponents = {}
        this.UsersProfile = 0

    }

    initDataStructure(DataComponent, initItem) {
        widgetManager.FillDataComponentsWithBaseData(initItem,DataComponent,new Vector(50,50))
        if (DataComponent.owneremail == useremail) {
            this.UsersProfile = DataComponent
        }

        DataComponent.type = this.ItemType
        DataComponent.zdepth = 10
        let fX = 1
        let fY = DataComponent.vecsize.y / DataComponent.vecsize.x
        DataComponent.drawtext = true
        DataComponent.hasMouseMovehandler = true
        this.setupGraphics(DataComponent)
        this.DataComponents[DataComponent.coordinateID] = DataComponent
        //this.loadpost(initItem.postid)

        let owner = peopleManager.getPerson(DataComponent.owneremail)
        owner.onImageChanged(function(Person,dataComponent) {
            removeAndDestroySprite(dataComponent.sprite)
            widgetManager.getWidget("Profile").setupGraphics(dataComponent)
        },DataComponent)
        owner.onDataChanged(function(Person,dataComponent) {
            removeAndDestroySprite(dataComponent.sprite)
            widgetManager.getWidget("Profile").setupGraphics(dataComponent)
        },DataComponent)
    }

    UpdateCreate(DataComponent,updateItem) {
        console.log("Created")
        socket.emit('RequestingObjectWithCoordID',{CoordinateID: updateItem.Coordinateid});
    }

    setupGraphics(DataComponent) {
        let owner = peopleManager.getPerson(DataComponent.owneremail)
        DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let tsize = 10//getScaleText(DataComponent.text)


        let dimensions = [20,9]
        let textstyle = new PIXI.TextStyle({
            fontFamily: BodyFont,
            fontSize: 42,
            fontWeight: 'bold',
            fill: BlenderGradient, // gradient
            fillGradientType: 1,
            stroke: '#d8d8d8',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth:dimensions[0]*50,
            breakWords:true,
            align:'Justified'
        })
        if (DataComponent.owneremail == useremail) {
            textstyle = new PIXI.TextStyle({
                        fontFamily: BodyFont,
                        fontSize: 42,
                        fontWeight: 'bold',
                        fill: gradOrange, // gradient
                        fillGradientType: 1,
                        stroke: '#d8d8d8',
                        strokeThickness: 0,
                        wordWrap: true,
                        wordWrapWidth:dimensions[0]*50,
                        breakWords:true,
                        align:'Justified'
                    })
        }
        let text = DataComponent.owneremail
        let RenderText = new PIXI.Text(text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(text, textstyle)

        let width =  dimensions[0] * 50
        let height = dimensions[1] * 50

        DataComponent.vecsize.y = height / 50
        DataComponent.vecsize.x = width / 50


        RenderText.position.x = (height)
        RenderText.position.y = (0.5 * 50)

        DataComponent.RenderText = RenderText


        let ownerGraphic = new PIXI.Sprite()
        let widestText = textMetrics.width
        if (owner.imageready) {
            ownerGraphic = new PIXI.Sprite()
            let imageGraphic = new PIXI.Sprite(owner.profileimage)
            let imgDimens = new Vector(height - 50,height - 50)
            let imgscale = 1
            if (imageGraphic.width > imageGraphic.height) {
                imgscale = imgDimens.x / imageGraphic.width
            } else {
                imgscale = imgDimens.y / imageGraphic.height
            }
            imageGraphic.scale.x = (imgscale)
            imageGraphic.scale.y = (imgscale)
            imageGraphic.position.x = 25
            imageGraphic.position.y = 25

            let bodystyle = new PIXI.TextStyle({
                fontFamily: BodyFont,
                fontSize: 32,
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
            let color = '#55ee99'
            if (owner.friendCount == 0) {
                color = ['#ee0000']
            } else if (owner.friendCount <= 9) {
                color = colLightOrange
            }
            let bodystyle2 = new PIXI.TextStyle({
                            fontFamily: BodyFont,
                            fontSize: 38,
                            fontWeight: 'bold',
                            fill: color,
                            fillGradientType: 2,
                            stroke: '#d8d8d8',
                            strokeThickness: 0,
                            wordWrap: false,
                            breakWords:true,
                            align:'Justified'
                        })
            let text1 = "🧠 " + owner.name +  "\n\nℹ️ " + owner.bio
            let tmpText1 = new PIXI.Text(text1, bodystyle);
            let textMetrics1 = PIXI.TextMetrics.measureText(text1, bodystyle)
            tmpText1.position.x = (height)
            tmpText1.position.y = (textMetrics.height + 100)

            let text2 = "🧛🧙🧞   " + owner.friendCount
            let tmpText2 = new PIXI.Text(text2, bodystyle2);
            let textMetrics2 = PIXI.TextMetrics.measureText(text2, bodystyle)
            tmpText2.position.x = (height)
            tmpText2.position.y = (textMetrics.height + 40)

            if (DataComponent.owneremail != useremail) {
                let friendbtn = new PIXI.Sprite()
                friendbtn.addChild(owner.friendbtnsprite)
                friendbtn.position.x = height + textMetrics2.width + 75
                friendbtn.position.y = (textMetrics.height + 40)
                ownerGraphic.addChild(friendbtn)
            }
            ownerGraphic.addChild(tmpText1)
            ownerGraphic.addChild(tmpText2)
            ownerGraphic.addChild(imageGraphic)

            widestText = Math.max(textMetrics.width, textMetrics1.width)
            widestText = Math.max(widestText, textMetrics2.width)
        }

        graphics.lineStyle(2, 0x222222, 1);
        graphics.beginFill(0x383838);
        graphics.drawRoundedRect(0, 0, height + widestText + 50, height,8);
        graphics.endFill();

        graphics.beginFill(0x505050);
        graphics.drawRoundedRect(25, 25, height - 50, height - 50,8);
        graphics.endFill();

        graphics.alpha = 1

        DataComponent.sprite.addChild(graphics)
        DataComponent.sprite.addChild(RenderText)
        if (owner.imageready) {
            DataComponent.sprite.addChild(ownerGraphic)
        }

        if (!debugDisableUserContent)
            stage.addChild(DataComponent.sprite)

        widgetManager.setupDataComponentReportButton(DataComponent, height + (70), height - 20)
        if (DataComponent.owneremail == useremail) {
            widgetManager.setupDataComponentMoveButton(DataComponent, -0.9 * 50, 0.75 * 50,
                function(DataComponent) {
                    DataComponent.dragdata.isdragging = !DataComponent.dragdata.isdragging
                    if (!DataComponent.dragdata.isdragging) {
                        widgetManager.getWidget("Profile").broadcastChange(DataComponent)
                        DataComponent.sprite.alpha = 1
                    } else {
                        DataComponent.sprite.alpha = 0.7
                    }
                   DataComponent.dirty = true
                   return true
                }
            )
        }
    }

    UpdatePosition(DataComponent,updateItem) {
        console.log("Updated position")
        widgetManager.animateDataComponentTo(DataComponent,[updateItem.posx,updateItem.posy])
    }



    UpdateCreate(DataComponent,updateItem) {
        console.log("Created")
        // After we've sent the create data to the server, instead of manually adding the new object, we
        //  Tell the server to send us a Loader update with the new object so it can be added as if
        //  it was part of the initial data package
        socket.emit('RequestingObjectWithCoordID',{CoordinateID: updateItem.Coordinateid});
    }

    UpdateDelete(DataComponent,updateItem) {
        let centre = getCenter(DataComponent.vecposition,DataComponent.vecsize)
        //AddRipple({
        //    "color":color(255,80,80),
        //    "duration":3000,
        //    "maxRadius":50,
        //    "maxTransparency":200,
        //    "position": centre,
        //    "maxthickness":5,
        //    "CoordsRelative":true
        //})
        delete widgetManager.getWidget(this.ItemType).DataComponents[DataComponent.coordinateID]
    }

    UpdateOther(DataComponent,updateItem) {
        console.log("Other kind of update")
    }

    broadcastChange(DataComponent) {
        $.post("/setposition",{
			objecttype: "Profile",
			objectid:DataComponent.owneremail,
			posx:DataComponent.vecposition.x,
			posy:DataComponent.vecposition.y,
			sizex:DataComponent.vecsize.x,
			sizey:DataComponent.vecsize.y
		}).done(function(fromserver) {
			dissuccess("You've found a new home!")
		}).fail(function() {
		    diserror("Woah okay we can't find the internet. Try drag it around a little bit again.")
		})
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



//# sourceURL=ProfileWidget.js