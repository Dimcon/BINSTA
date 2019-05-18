


class Portal {
    constructor() {
        this.ItemType = "Portal"
        this.ItemSubclass = ""
        this.ItemSubclassID = ""
        this.DataComponents = {}
        this.backgraphic = ""
        this.backgraphicDefined = false
    }

    initDataStructure(DataComponent, initItem) {
        widgetManager.FillDataComponentsWithBaseData(initItem,DataComponent,new Vector(50,50))
        DataComponent.vecsize = new Vector(7,7)
        DataComponent.owned = initItem.owned
        //DataComponent.buffer = createGraphics(
        //    DataComponent.vecsize.x * 50,
        //    DataComponent.vecsize.y * 50
        //);
        DataComponent.vecposition =
        new Vector(
            DataComponent.vecposition.x - (DataComponent.vecsize.x / 2),
            DataComponent.vecposition.y - (DataComponent.vecsize.y / 2)
        )
        DataComponent.zdepth = 10
        let fX = 1
        let fY = DataComponent.vecsize.y / DataComponent.vecsize.x

        DataComponent.hasMouseMovehandler = true

        DataComponent.portalid = initItem.portal

        let newvector = new Vector(initItem.newlocationx,initItem.newlocationy)

        DataComponent.othercoords = newvector
        DataComponent.text = "Portal to\n[[" + parseInt(newvector.x) + "]:[" + parseInt(newvector.y) + "]]"

        this.setupGraphics(DataComponent)

        this.DataComponents[DataComponent.coordinateID] = DataComponent
    }

    setupGraphics(DataComponent) {
        DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let tsize = 30

        let textstyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: tsize,
            fill: ['#ffffff'], // gradient
            stroke: '#4a1850',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 10*50,
            width:10*50,
            breakWords:false,
            align:'center'
        })
        let RenderText = new PIXI.Text(DataComponent.text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(DataComponent.text, textstyle)

        let width =  (DataComponent.vecsize.x * 100)
        let height = (DataComponent.vecsize.y * 100)

        let scalefactor = 1
        if (!this.backgraphicDefined) {
            this.backgraphicDefined = true
            let texture = new PIXI.RenderTexture(renderer, scalefactor*100*DataComponent.vecsize.x, scalefactor*100*DataComponent.vecsize.y);
            let graphics = new PIXI.Graphics();
            let tmpwidth =  width * scalefactor
            let tmpheight = height *scalefactor
            let lineThickness = 4 * scalefactor

            graphics.lineStyle(lineThickness, 0x55dd55, 0);
            graphics.beginFill(0x010101,0.5);
            //graphics.drawRoundedRect(0, 0, width, height,15);
            graphics.drawCircle (tmpwidth/2, tmpheight/2, tmpwidth/2);
            for (let i = 1.1; i < 6;i += 0.05) {
                let val = Math.sin(Math.sin(( ((i -1.1) / (6-1.1))) * Math.PI))
                graphics.lineStyle(lineThickness, 0x55dd55, val);
                graphics.drawCircle (tmpwidth/2, tmpheight/2, tmpwidth/i/2);
            }
            graphics.beginFill(0x880000,1);
            graphics.drawCircle (tmpwidth/2, tmpheight/2, tmpwidth/6/2);
            graphics.endFill();
            graphics.alpha = 0.7
            //texture.render(graphics);
            renderer.render(graphics,texture)
            this.backgraphic = texture
        }


        RenderText.position.x = (0.5 * 50)
        RenderText.position.y = (0.5 * 50)

        DataComponent.RenderText= RenderText
        let tmpsprite = new PIXI.Sprite(this.backgraphic)
        tmpsprite.scale.x = 1/scalefactor
        tmpsprite.scale.y = 1/scalefactor
        DataComponent.sprite.addChild(tmpsprite)
        DataComponent.sprite.addChild(RenderText)
        if (!debugDisableUserContent)
            stage.addChild(DataComponent.sprite)



        //if (DataComponent.owned) {
            widgetManager.setupDataComponentProfileDraw(DataComponent)
            widgetManager.setupDataComponentReplyButton(DataComponent, width, height)
            if (DataComponent.owned) {
                widgetManager.setupDataComponentMoveButton(DataComponent, -0.9 * 50, 0.75 * 50,
                    function(DataComponent) {
                        DataComponent.dragdata.isdragging = !DataComponent.dragdata.isdragging
                        if (!DataComponent.dragdata.isdragging) {
                            widgetManager.getWidget("Portal").broadcastChange(DataComponent)
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
        //}
    }

    broadcastChange(DataComponent) {
            $.post("/setposition",{
    			objecttype: "Portal",
    			objectid:DataComponent.coordinateID,
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
    }
    loadCallBack(fromserver) {
    }

    setupSocketCallbacks() {
    }

    onMouseMoveOutside(DataComponent,vecRelativeClickPos,actualcoords) {
    }

    onMouseMove(DataComponent,vecRelativeClickPos,actualcoords) {
    }

    onClickDown(dataComponent,vecRelativeClickPos,actualcoords) {
        if (!dataComponent.dragdata.isdragging) {
            if (IsWithinViewingRectangle(dataComponent,unitsize)) {
                if (ispointinrect(vecRelativeClickPos, new Vector(0,0), new Vector(1,1))) {
                    loader.updatePosition(new Vector(dataComponent.othercoords.x ,dataComponent.othercoords.y))
                    userNavigation.goto(new Vector(dataComponent.othercoords.x * unitsize,dataComponent.othercoords.y*unitsize))
                    return defferreddraggable.StartDrag(dataComponent,actualcoords)
                }
            }
        } else {
            if (IsWithinViewingRectangle(dataComponent,unitsize)) {
                if (ispointinrect(vecRelativeClickPos, new Vector(0,0), new Vector(1,1))) {
                    return defferreddraggable.StartDrag(dataComponent,actualcoords)
                }
            }
            return false
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
        let scale = unitsize / 100
        DataComponent.sprite.position.x = newvecposition.x
        DataComponent.sprite.position.y = newvecposition.y
        DataComponent.sprite.scale.x = scale
        DataComponent.sprite.scale.y = scale

    }
}

//# sourceURL=PortalWidget.js