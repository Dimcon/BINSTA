
class DataComponent {
    constructor(DataItem) {


    }
}
//var widgets = {}
function initDatawidgets() {

}
var grey
var darkgrey
var lightgrey

function IsWithinViewingRectangle(DataComponent) {
    newvecposition = ScreenCoordToPlaneCoord(DataComponent.vecposition)
    let width = ScreenSizeToPlaneSize(DataComponent.vecsize).x
    let height = ScreenSizeToPlaneSize(DataComponent.vecsize).y
    //let posright = ((DataComponent.vecposition.x + DataComponent.vecsize.x)  * unitsize)
    //let posleft = ((DataComponent.vecposition.x)  * unitsize)
    //let posbottom = ((DataComponent.vecposition.y + DataComponent.vecsize.y)  * unitsize)
    //let postop = ((DataComponent.vecposition.y)  * unitsize)
    if (newvecposition.x + width < 0) {
        return false
    }
    if (newvecposition.y + height < 0) {
        return false
    }
    if (newvecposition.x > vecScreen.x) {
        return false
    }
    if (newvecposition.y > vecScreen.y) {
        return false
    }
    return true
}

function ispointinrect(vecPoint, vecPos, vecSize) {
    this.l = vecPos.x
    this.t = vecPos.y
    this.r = vecPos.x + vecSize.x
    this.b = vecPos.y + vecSize.y
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


function animProfileLineIn(DataComponent) {
}

function animProfileLineOut(DataComponent) {
}

function getScaleText(sinput) {
    let maxcharwidthadjuster = 1000
    let mincharwidthadjuster = 12
    let minTS = 30
    let maxTS = 50
    let length = sinput.length
    let range = (maxcharwidthadjuster + mincharwidthadjuster)
    let adjuster = 1 - Math.sin(length / range)
    let TS = minTS + (adjuster * (maxTS - minTS))
    if (length > maxcharwidthadjuster) {
        TS = minTS
    }
    if (length < mincharwidthadjuster) {
        TS = maxTS
    }
    return TS
}


// Okay so the goal is a dict like interface
// Allitems = {
//  "UserProfiles": {0: user1, 1: user2}
//  "fences": {0: fence1, 1: fence2}
//  }
//  Goal basically achieved right?
//      Much more efficient and easily upgradable now.
//      Just needs more behind the scenes code to make the templates work better.
//      Also classing to make code management a lot easier


class WidgetManager {
    constructor() {
        this.Allitems = {}
        this.widgets = {}
        this.MoveSprite = new PIXI.Sprite()
        this.DeleteSprite = new PIXI.Sprite()
        this.ReportSprite = new PIXI.Sprite()
        this.ReplySprite = new PIXI.Sprite()
    }
    
    initWidgets() {
        let listofstructs = [
            //radialfence = new RadialFence,
            new ImagePost(),
            new TextPost(),
            new Portal(),
            new Profile(),
            new NetLoopWidget()
        ]
        for (let item in listofstructs) {
            this.widgets[listofstructs[item].ItemType + listofstructs[item].ItemSubclassID] = listofstructs[item]
            this.widgets[listofstructs[item].ItemType + listofstructs[item].ItemSubclassID].setupSocketCallbacks()
        }
        this.setupSprites()
    }

    PopulateWithItem(Item) {
        let newcomponent = new DataComponent(Item)
        let itemClassifier = Item.type
        if (Item.type == "Userpost") {
            itemClassifier = Item.type + Item.posttype
        }
        if (itemClassifier in this.widgets) {
            if (Item.coordid in this.widgets[itemClassifier].DataComponents) {
                removeAndDestroySprite(this.widgets[itemClassifier].DataComponents[Item.coordid].sprite)
            }
            this.widgets[itemClassifier].initDataStructure(newcomponent, Item)
        }
    }

    setupSprites() {
        this.setupMoveBtn()
        this.setupDeleteBtn()
        this.setupReplyBtn()
    }

    setupDeleteBtn() {
        let texture = new PIXI.RenderTexture(renderer, 40, 40);
        let graphics = new PIXI.Graphics();
        let delgraphics = new PIXI.Graphics()
        let textstyle = new PIXI.TextStyle({
            fontFamily: BodyFont,
            fontSize: 20,
            fontWeight: 'normal',
            fill: BodyColor, // gradient
            stroke: '#d8d8d8',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 10*50,
            breakWords:true,
            align:'Justified'
        })
        let text = "❌"
        let RenderText = new PIXI.Text(text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(text, textstyle)

        let width =  textMetrics.width + (0.2*50)
        let height = textMetrics.height + (0.3*50)

        delgraphics.lineStyle(2, 0x222222, 1);
        delgraphics.beginFill(0x553838);
        //delgraphics.drawRoundedRect(posStartx, posStarty, width, height,8);
        delgraphics.drawEllipse((width/2) - (0.1 * 50),  (height/2) - (0.15 * 50), width/2, height/2);
        delgraphics.endFill();
        delgraphics.alpha = 1

        delgraphics.position.x = (0.1 * 50)
        delgraphics.position.y = (0.15 * 50)

        let tmp = new PIXI.Sprite()
        tmp.addChild(RenderText)
        delgraphics.addChild(tmp)
        renderer.render(delgraphics,texture)
        widgetManager.DeleteSprite = texture
    }

    setupMoveBtn() {
        let texture = new PIXI.RenderTexture(renderer, 40, 40);
        let graphics = new PIXI.Graphics();
         let moveGraphics = new PIXI.Graphics()
         let textstyle = new PIXI.TextStyle({
             fontFamily: BodyFont,
             fontSize: 20,
             fontWeight: 'normal',
             fill: BodyColor, // gradient
             stroke: '#d8d8d8',
             strokeThickness: 0,
             wordWrap: true,
             wordWrapWidth: 10*50,
             breakWords:true,
             align:'Justified'
         })
         let text = "🌀"
         let RenderText = new PIXI.Text(text, textstyle);
         let textMetrics = PIXI.TextMetrics.measureText(text, textstyle)

         let width =  textMetrics.width + (0.3*50)
         let height = textMetrics.height + (0.3*50)

         moveGraphics.lineStyle(2, 0x222222, 1);
         moveGraphics.beginFill(0x383838);
         moveGraphics.drawEllipse((width/2) - (0.15 * 50),(height/2) - (0.15 * 50), width/2, height/2);
         moveGraphics.endFill();
         moveGraphics.alpha = 1

         moveGraphics.position.x = (0.15 * 50)
         moveGraphics.position.y = (0.15 * 50)

         let tmp = new PIXI.Sprite()
         tmp.addChild(RenderText)
         moveGraphics.addChild(tmp)
         renderer.render(moveGraphics,texture)
         widgetManager.MoveSprite = texture
    }

    setupReplyBtn() {
        let texture = new PIXI.RenderTexture(renderer, 40, 40);
        let moveGraphics = new PIXI.Graphics()
        let textstyle = new PIXI.TextStyle({
            fontFamily: BodyFont,
            fontSize: 20,
            fontWeight: 'normal',
            fill: BodyColor, // gradient
            stroke: '#d8d8d8',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 10*50,
            breakWords:true,
            align:'Justified'
        })
        let text = "🔽"
        let RenderText = new PIXI.Text(text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(text, textstyle)

        let width =  textMetrics.width + (0.3*50)
        let height = textMetrics.width + (0.3*50)

        moveGraphics.lineStyle(2, 0x222222, 1);
        moveGraphics.beginFill(0x383838);
        moveGraphics.drawEllipse((width/2),(height/2), width/2, height/2);
        moveGraphics.endFill();
        moveGraphics.alpha = 1

        let TextSprite = RenderTextToSprite(RenderText)

        TextSprite.position.x = (0.15 * 50)
        TextSprite.position.y = 7

        moveGraphics.addChild(TextSprite)

        //let tmp = new PIXI.Sprite()
        //tmp.addChild(moveGraphics)
        //moveGraphics.addChild(tmp)
        renderer.render(moveGraphics,texture)
        widgetManager.ReplySprite = texture
    }

    getWidget(sWidgetName) {
        return this.widgets[sWidgetName]
    }
    
    draw() {
        for (let widgetName in this.widgets) {
            let dataComponents = this.widgets[widgetName].DataComponents
            for (let itemkey in dataComponents) {
                let item = dataComponents[itemkey]
                this.widgets[widgetName].draw(item,unitsize)
            }
        }
    }

    setupSocketCallbacks() {
        socket.on('loadpost', function(fromserver) {
            if (fromserver.report.substr(0,1) == "H") {
                let widget = widgetManager.getWidget("Userpost" + fromserver.post.posttype)
                widget.loadCallBack(fromserver)
        	}
        });
    }

    FillDataComponentsWithBaseData(DataItem,datacomponent,bufferSize) {

        if (DataItem.postid) {
            datacomponent.postType = DataItem.posttype
            datacomponent.postid = DataItem.postid
        }
        datacomponent.zdepth = 10
        datacomponent.vecposition = new Vector(DataItem.xcoord,DataItem.ycoord)
        datacomponent.vecsize = new Vector(DataItem.xsize,DataItem.ysize)
        datacomponent.owneremail = DataItem.email
        datacomponent.ownerdefined = false
        datacomponent.coordinateID = DataItem.coordid
        datacomponent.dirty = true
        datacomponent.dirtyCounter = 5
        datacomponent.maxdrawscale = 1
        datacomponent.dragdata = {
            "startedDrag":false,
            "isdragging":false
        }
        datacomponent.hasMouseMovehandler = false
        datacomponent.MouseIsInside = false
        datacomponent.MouseIsInsidevalidated = false
        datacomponent.profileDisplay = [new PIXI.Sprite(),new PIXI.Sprite()]
        datacomponent.defaultbuttons = {
            "Edit": {
                "onclick": () => true,
                "text":"◄",
            },
            "Reposition": {
                "onclick": () => true,
                "text":"↔",
            },
            "Delete": {
                "onclick": () => true,
                "text":"X",
            }
        }
        datacomponent.owned = () => datacomponent.owneremail === useremail
        datacomponent.type = ""
        datacomponent.ServiceBooleans = {
            "LinkManagerDirty": true
        }
        datacomponent.paddings = {
            "ProfilePosition": new Vector(0,0)
        }

        for (let items in DataItem.linksTo) {
            let linkcoords = new Vector(parseFloat(DataItem.linksTo[items].xcoord),parseFloat(DataItem.linksTo[items].ycoord))
            postlinkmanager.createLink(datacomponent,linkcoords,DataItem.linksTo[items].coordid)
        }

        datacomponent.moveHandlers = {}
        this.Allitems[datacomponent.coordinateID] = datacomponent
    }

    animateDataComponentTo(DataComponent, NewPos) {
            AddLoop()
            $({
                tmpval: parseFloat(DataComponent.vecposition.x),
                tmpval1: parseFloat(DataComponent.vecposition.y),
                tmpval2: DataComponent.coordinateID,
                tmpval3: DataComponent.type
                }).animate({
                tmpval: parseFloat(NewPos[0]),
                tmpval1: parseFloat(NewPos[1]),
                tmpval2: DataComponent.coordinateID,
                tmpval3: DataComponent.type
                }, {
                duration: this.animDur,
                step: function(tmpval,fx) {
                    let DataComponent = widgetManager.getWidget(checkForNan(fx.elem.tmpval3)).DataComponents[fx.elem.tmpval2]
                    DataComponent.vecposition.x = fx.elem.tmpval
                    DataComponent.vecposition.y = fx.elem.tmpval1
                },
                done: function(tmpval,fx) {
                    MinusLoop()
                }
            });
        }

    setupDataComponentProfileDraw(DataComponent) {
        let owner = peopleManager.getPerson(DataComponent.owneremail)
        owner.onDataChanged(function(Person,dataComponent) {

            let textstyle = new PIXI.TextStyle({
                fontFamily: NameFont,
                fontWeight: 'bold',
                fontSize: 28,
                fill: NameColor, // gradient
                fillGradientType: 2,
                stroke: '#c70051',
                strokeThickness: 0,
                wordWrap: false,
                wordWrapWidth: 10*50,
                breakWords:true,
                align:'Left'
            })
            let textMetrics = PIXI.TextMetrics.measureText(Person.name, textstyle)
            let width =  textMetrics.width
            let height = textMetrics.height
            let RenderText = new PIXI.Text(Person.name, textstyle);

            let TextSprite = RenderTextToSprite(RenderText)

            TextSprite.position.x = dataComponent.paddings["ProfilePosition"].x + (0 * 50)
            TextSprite.position.y = dataComponent.paddings["ProfilePosition"].y +  ((-0.25*50) - (height))
            dataComponent.sprite.removeChild(dataComponent.profileDisplay[0])
            dataComponent.profileDisplay[0].destroy()
            dataComponent.profileDisplay[0] = TextSprite
            dataComponent.sprite.addChild(TextSprite)
        },DataComponent)
        owner.onImageChanged(function(Person,dataComponent) {
            let sprite = new PIXI.Sprite(Person.profileimage)
            let loadedimage = sprite
            //dataComponent.image = sprite
            let tmpscale = 50
            let fX = 0.75
            let fY = 0.75
            let imgscale = 1
            if (loadedimage.width > loadedimage.height) {
                imgscale = (100*fX) / loadedimage.width
            } else {
                imgscale = (100*fY) / loadedimage.height
            }
            loadedimage.scale.x = (imgscale)
            loadedimage.scale.y = (imgscale)
            loadedimage.position.x = dataComponent.paddings["ProfilePosition"].x + (-0.25 * 50) - (loadedimage.width)
            loadedimage.position.y = dataComponent.paddings["ProfilePosition"].y + ((-1*50))
            dataComponent.sprite.removeChild(dataComponent.profileDisplay[1])
            dataComponent.profileDisplay[1].destroy()
            dataComponent.profileDisplay[1] = loadedimage
            dataComponent.sprite.addChild(loadedimage)
        },DataComponent)
   }



    setupDataComponentReportButton(DataComponent, posEndx, posEndy) {
        let textstyle = new PIXI.TextStyle({
            fontFamily: ButtonFont,
            fontSize: 18,
            fontWeight: 'bold',
            fill: ButtonColorFaded, // gradient
            stroke: '#d8d8d8',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 10*50,
            breakWords:true,
            align:'Justified'
        })
        let text = "Report️"
        let RenderText = new PIXI.Text(text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(text, textstyle)

        let width =  textMetrics.width + (0.25 * 50)
        let height = textMetrics.height + (0.1 * 50)
        RenderText.position.x = posEndx - width
        RenderText.position.y = posEndy - height
        DataComponent.reportButton = RenderText
        DataComponent.sprite.addChild(RenderText)
    }

    setupDataComponentReplyButton(DataComponent, posStartx, posStarty) {
        let ReplybtnSprite = new PIXI.Sprite(widgetManager.ReplySprite)
        ReplybtnSprite.position.x = posStartx/2
        ReplybtnSprite.position.y = posStarty + 15
        ReplybtnSprite.interactive = true
        ReplybtnSprite.buttonMode = true
        let click1 = function() {
            let posx = DataComponent.sprite.worldTransform.tx;
            let posy = DataComponent.sprite.worldTransform.ty;
            let newvec = new Vector(0,0)
            newvec.x = ((Uservector.x + (posx)) / unitsize) + ((posStartx - 60) / 2 / 50)
            newvec.y = ((Uservector.y + (posy)) / unitsize) + ((posStarty + 60) / 50)
            binstuimanager.uicomponents["newpostui"].showAtPosition(newvec,DataComponent)
            //RenderText.text = "🔼"
            ReplybtnSprite.on("click",click2)
        }
        let click2 = function() {
            binstuimanager.uicomponents["newpostui"].hideAll()
            //RenderText.text = "🔽"
            ReplybtnSprite.on("click",click1)
        }
        ReplybtnSprite.on("click",click1)
        //DataComponent.defaultbuttons["Reposition"]["sprite"] = ReplybtnSprite
        //DataComponent.defaultbuttons["Reposition"]["onclick"] = onmoveclick
        DataComponent.sprite.addChild(ReplybtnSprite)
    }

    OnReportDataComponentPressed(dataComponent) {
        //alert("This item has been reported")
        console.log("Item reported")
    }

    setupDataComponentMoveButton(DataComponent, posStartx, posStarty,onmoveclick) {
         let MovebtnSprite = new PIXI.Sprite(widgetManager.MoveSprite)
         MovebtnSprite.position.x = posStartx
         MovebtnSprite.position.y = posStarty
         MovebtnSprite.interactive = true
         MovebtnSprite.buttonMode = true
         MovebtnSprite.on("click",function(e) {
             widgetManager.moveClick(DataComponent,onmoveclick)
         })
         MovebtnSprite.on("mouseover",function(e) {
                     console.log("Movelbutton")
                 })
         DataComponent.defaultbuttons["Reposition"]["sprite"] = MovebtnSprite
         DataComponent.defaultbuttons["Reposition"]["onclick"] = onmoveclick
         //uistage.addChild(MovebtnSprite)
         DataComponent.sprite.addChild(MovebtnSprite)
    }

    moveClick(DataComponent,onmoveclick) {
        //widget = widgetManager.getWidget(DataComponent.type)
        console.log("Started drag")
        onmoveclick(DataComponent)
        DataComponent.ServiceBooleans["LinkManagerDirty"] = true
    }

    setupDataComponentDeleteButton(DataComponent, posStartx, posStarty,ondelclick) {
        let DeletebtnSprite = new PIXI.Sprite(widgetManager.DeleteSprite)
        DeletebtnSprite.position.x = posStartx
        DeletebtnSprite.position.y = posStarty

        DeletebtnSprite.position.x = posStartx
        DeletebtnSprite.position.y = posStarty

        //DataComponent.RenderText = RenderText

        DeletebtnSprite.interactive = true
        DeletebtnSprite.buttonMode = true
        DeletebtnSprite.on("click",function(e) {
            widgetManager.deleteClick(DataComponent)
        })
        DeletebtnSprite.on("mouseover",function(e) {
                    console.log("delbutton")
                })
        DataComponent.defaultbuttons["Delete"]["sprite"] = DeletebtnSprite
        DataComponent.defaultbuttons["Delete"]["onclick"] = ondelclick

        DataComponent.sprite.addChild(DeletebtnSprite)
    }

    deleteClick(DataComponent) {
        if (confirm("Are you sure you would like to DELYEET this?")) {
            $.post("/delete",{
            	objecttype: "coordinate",
            	objectid:DataComponent.coordinateID,
            	coordid:DataComponent.coordinateID,
            	posx:DataComponent.vecposition.x,
            	posy:DataComponent.vecposition.y,
            	sizex:DataComponent.vecsize.x,
            	sizey:DataComponent.vecsize.y
            }).done(function(fromserver) {
            	dissuccess("AAAAAAAAAaaaaaaaaannnnnnnnnnnnnd... It's gone")
            }).fail(function() {
                diserror("Woah okay we can't find the internet. Uhm do it again?")
            })
            console.log ("DELETING")
        }
    }

}





//# sourceURL=WidgetManager.js