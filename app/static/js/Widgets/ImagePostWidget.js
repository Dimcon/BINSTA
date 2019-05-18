

class ImagePost {
    constructor() {
        this.ItemType = "Userpost"
        this.ItemSubclass = "ImagePost"
        this.ItemSubclassID = 8
        this.DataComponents = {}
    }

    initDataStructure(DataComponent, initItem) {
        widgetManager.FillDataComponentsWithBaseData(initItem,DataComponent,new Vector(50,50))
        DataComponent.type = this.ItemType + this.ItemSubclassID
        DataComponent.zdepth = 10
        let fX = 1
        let fY = DataComponent.vecsize.y / DataComponent.vecsize.x
        DataComponent.text = "..."

        DataComponent.imgloaded = false
        DataComponent.imageid = 0
        DataComponent.image = ""
        DataComponent.drawtext = true
        DataComponent.hasMouseMovehandler = true
        DataComponent.imgscale = 1

        delete DataComponent.defaultbuttons["Edit"]

        DataComponent.defaultbuttons["Reposition"].onclick = function(DataComponent) {
            DataComponent.dragdata.isdragging = !DataComponent.dragdata.isdragging
            if (!DataComponent.dragdata.isdragging) {
                widgetManager.getWidget("Userpost8").broadcastChange(DataComponent)
            }
            //AddRipple({
            //        "color":color(52,58,100)
            //    })
            DataComponent.dirty = true
            return true
        }

        this.setupGraphics(DataComponent)

        this.DataComponents[DataComponent.coordinateID] = DataComponent
        this.loadpost(initItem.postid)
    }

    setupGraphics(DataComponent) {
        DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let tsize = getScaleText(DataComponent.text)

        let width =  (10 * 50)
        let height =  (10 * 50)
        if (DataComponent.imgloaded) {
            let texture = DataComponent.image
            let val = texture.width
            if (texture.height > texture.width) val = texture.height
            val += (0.5*50)
            width =  val
            height = val
        }

        let textstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: tsize,
            fill: BodyColor, // gradient
            stroke: '#000000',
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: width,
            wordWrapHeight: height,
            breakWords:true,
            align:'Center',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 6,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 0,
        })

        let RenderText = new PIXI.Text(DataComponent.text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(DataComponent.text, textstyle)
        let TextSprite = RenderTextToSprite(RenderText)
        if (!DataComponent.imgloaded) {
            width =  textMetrics.width + (1 * 50)
            height = textMetrics.height + (1 * 50)
        }

        let fX = width / 100
        let fY = height /100



        TextSprite.alpha = 1
        DataComponent.RenderText= TextSprite
        DataComponent.sprite.addChild(graphics)
        if (DataComponent.imgloaded) {
            let texture = DataComponent.image
            let startpos = new Vector(
                    (50*fX) - (DataComponent.image.width / 2),
                    0//50*fY) - (DataComponent.image.height / 2)
                )
            texture.position.x = startpos.x
            texture.position.y = startpos.y
            texture.alpha = 1
            DataComponent.sprite.addChild(texture)
            height = texture.height
        } else {
            //Assume image dimensions are 18:9
        }
        //graphics.lineStyle(2, 0x222222, 1);
        //graphics.beginFill(0x222222);
        //graphics.drawRoundedRect(0, 0, width, height,15);
        //graphics.endFill();
        //graphics.alpha = 1

        TextSprite.position.x = (0.5 * 50)
        TextSprite.position.y = height + (0.5 * 50)

        widgetManager.setupDataComponentReplyButton(DataComponent, width, height + (0.5 * 50) + TextSprite.height)

        DataComponent.sprite.addChild(TextSprite)
        widgetManager.setupDataComponentProfileDraw(DataComponent)
        widgetManager.setupDataComponentReportButton(DataComponent, width, height)

        if (DataComponent.owneremail == useremail) {
            widgetManager.setupDataComponentMoveButton(DataComponent, -0.9 * 50, 0.75 * 50,
                function(DataComponent) {
                    DataComponent.dragdata.isdragging = !DataComponent.dragdata.isdragging
                    if (!DataComponent.dragdata.isdragging) {
                        widgetManager.getWidget("Userpost8").broadcastChange(DataComponent)
                        DataComponent.sprite.alpha = 1
                    } else {
                        DataComponent.sprite.alpha = 0.7
                    }
                    //AddRipple({
                    //        "color":color(52,58,100)
                    //    })
                    DataComponent.dirty = true
                }
            )
            widgetManager.setupDataComponentDeleteButton(DataComponent, -1.8 * 50, 0.75 * 50)
        }
        if (!debugDisableUserContent) {
            DataComponent.sprite.cacheAsCanvas = true
            stage.addChild(DataComponent.sprite)

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

    loadpost(postid) {
        socket.emit('loadpost', {postid:postid});
    }
    loadCallBack(fromserver) {
        let dataComponent = this.DataComponents[fromserver.post.coordid]
    	dataComponent.text = fromserver.post.details
    	dataComponent.owneremail = fromserver.post.email
    	dataComponent.ownerdefined = true
    	if (fromserver.post.posttype == 8) {
    	    dataComponent.imageid = fromserver.post.dataid
    	    this.loadImage(dataComponent,dataComponent.imageid)
    	}
    	dataComponent.dirty = true
    }

    loadImage(dataComponent,imageid) {
        dataComponent.loader = new PIXI.loaders.Loader();
        var loaderOptions = {
            loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
            xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BLOB
        };
        dataComponent.loader.dataComponent = dataComponent
        dataComponent.loader
            .add('Img', "/getimageid-" + imageid,loaderOptions)
            .on('load',function (loader,resource) {
                let dataComponent = loader.dataComponent
                resource.texture.mipmap = true
                //let bt = new PIXI.BaseTexture(resource.texture,1,0.1)
                //let tx = new PIXI.Texture(bt)
                resource.texture.baseTexture.resolution = 0.01
                resource.texture.baseTexture.mipmap = true
                let bt = new PIXI.BaseTexture(resource.texture.baseTexture.source  ,0,10)
                bt.mipmap = true
                let tx = new PIXI.Texture(bt)
                //tx.update()

                let sprite = new PIXI.Sprite(tx)
                let loadedimage = sprite
                dataComponent.image = sprite
                let tmpscale = 50
                let fX = (dataComponent.vecsize.x * tmpscale) / 100
                let fY = (dataComponent.vecsize.y * tmpscale) / 100
                let imgscale = 1
                if (loadedimage.width > loadedimage.height) {
                    imgscale = (100*fX) / loadedimage.width
                } else {
                    imgscale = (100*fY) / loadedimage.height
                }
                loadedimage.scale.x = (imgscale)
                loadedimage.scale.y = (imgscale)
                dataComponent.imgscale = imgscale / 50
                dataComponent.imgloaded = true
                dataComponent.dirty = true
                removeAndDestroySprite(dataComponent.sprite)
                widgetManager.getWidget("Userpost8").setupGraphics(dataComponent)
                completedSomeLoad()
            });
        dataComponent.loader.load()
    }

    setupSocketCallbacks() {
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

    onMouseMoveOutside(DataComponent,vecRelativeClickPos,actualcoords) {

        if (!DataComponent.drawtext) {
                    DataComponent.drawtext = true
                    DataComponent.dirty = true
                    animProfileLineIn(DataComponent)
                    //DataComponent.image.alpha = 1
                    //DataComponent.RenderText.alpha  = 0
                    invalidate()
                }
    }

    onMouseMove(DataComponent,vecRelativeClickPos,actualcoords) {
        if (DataComponent.drawtext) {
                    DataComponent.drawtext = false
                    DataComponent.dirty = true
                    animProfileLineOut(DataComponent)
                    //DataComponent.image.alpha = 0.2
                    // DataComponent.RenderText.alpha  = 1
                    invalidate()
                }
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
                delete widgetManager.getWidget("Userpost8").DataComponents[DataComponent.coordinateID]
            }
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

//# sourceURL=ImagePostWidget.js