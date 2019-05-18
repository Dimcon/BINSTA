

class TextContainerNLWManager extends NetLoopWidgetBase {
    constructor() {
        super()
        this.ApplicationID = "BINSTA"
        this.instanceType = "TextContainerWidget"
    }
    Create(Position,text) {
        this.createNLWInstance(Position,{
                "Text":text,
                "Position":Position.x + ";" + Position.y
            })
    }

    Destroy() {

    }

    Load(iID,DataComp) {
        return new TextContainerNLW(iID,DataComp)
    }
}
let tc = new TextContainerNLWManager()
NetLoopWidgetManagers[tc.instanceType] = tc

class TextContainerNLW extends NetComponent {

    constructor(instanceIdentity, DataComp) {
        super()
        this.instanceType = "TextContainerWidget"
        this.instanceID = instanceIdentity
        this.DataComponent = DataComp
    }

    onCreate() {
        this.setupSprite2()
    }

    setupSprite2() {
        this.DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let tsize = getScaleText(this.get("Text"))

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
            wordWrapWidth: 500,
            breakWords:true,
            align:'Justified'
        })
        let RenderText = new PIXI.Text(this.get("Text"), textstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let textMetrics = PIXI.TextMetrics.measureText(this.get("Text"), textstyle)
        let TextSprite = RenderTextToSprite(RenderText)

        let width =  textMetrics.width + (1 * 50)
        let height = textMetrics.height + (0.5 * 50) + (0.35*50)

        //this.DataComponent.vecsize.y = height / 50
        //this.DataComponent.vecsize.x = width / 50

        let CircRadius = 50
        let innerRad = 40

        graphics.lineStyle(5, 0x000000, 1);
        graphics.beginFill(0x666666);
        graphics.drawEllipse(0,0, CircRadius, CircRadius);
        graphics.endFill();
        graphics.beginFill(0x2299ee);
        graphics.drawEllipse(0,0, innerRad, innerRad);
        graphics.endFill();

        let graphics2 = new PIXI.Graphics()

        graphics2.lineStyle(2, 0x222222, 1);
        graphics2.beginFill(0x383838);
        graphics2.drawRoundedRect((1.25 * 50), -height/3 - (0.25 * 50), width, height,8);
        graphics2.endFill();
        graphics2.alpha = 0
        TextSprite.alpha = 0.5
        graphics.alpha = 1
        //graphics.on('mousedown', widgetManager.OnReportDataComponentPressed)
        TextSprite.position.x = (1.75 * 50)
        TextSprite.position.y = -height/3


        this.DataComponent.ContainerSprite = new PIXI.Sprite();
        let contSprite = this.DataComponent.ContainerSprite
        this.DataComponent.textBKG = graphics2
        this.DataComponent.RenderText= RenderText

        contSprite.addChild(graphics)
        contSprite.interactive = true

        let dataComponent = this.DataComponent

        contSprite.on("mouseover", function() {
            //console.log("Mouse over container")
            graphics2.alpha = 1
            TextSprite.alpha = 1
            dataComponent.profileDisplay[0].alpha = 1
            dataComponent.profileDisplay[1].alpha = 1
            invalidate()
        })
        contSprite.on("mouseout", function() {
            //console.log("Mouse left container")
            graphics2.alpha = 0
            TextSprite.alpha = 0.5
            dataComponent.profileDisplay[0].alpha = 0
            dataComponent.profileDisplay[1].alpha = 0

            invalidate()
        })

        //graphics.filters = [Bloomfilter]
        this.DataComponent.sprite.addChild(graphics2)
        this.DataComponent.sprite.addChild(contSprite)

        this.DataComponent.sprite.addChild(TextSprite)
        this.DataComponent.sprite.interactive = true
        nlwinput.setupSpriteClickHandlers(this.DataComponent,true)
        nlwinput.setupRightClickHandler(this.DataComponent,function(datacomp,event,pos) {
            popupmenumanager.resetCurrentmenuopts()
            popupmenumanager.startMenu(pos, "Menu")
            popupmenumanager.addPlainButton("Delete", "textStyle", function() {console.log("Pressed btn 1")}, 5, 2)
            let popupnum = popupmenumanager.endMenu()
            popupmenumanager.animatePopupIn(popupnum)
        })
        //DataComponent.sprite.cacheAsCanvas = true
        if (!debugDisableUserContent)
            stage.addChild(this.DataComponent.sprite)
        if (this.keyExists("OwnerEmail")) {
            this.DataComponent.owneremail = this.get("OwnerEmail")
            this.DataComponent.paddings["ProfilePosition"] = new Vector(-50,-70)
            widgetManager.setupDataComponentProfileDraw(this.DataComponent)
        }
        dataComponent.profileDisplay[0].alpha = 0
        dataComponent.profileDisplay[1].alpha = 0
    }

    getPosition() {
        return new Vector(parseFloat(this.get("Position").split(";")[0]),parseFloat(this.get("Position").split(";")[1]))
    }

    incrementPosition(x,y) {
        let oldc = this.get("Position").split(";")
        this.PRVSET("Position",(parseFloat(oldc[0]) + x) + ";" + (parseFloat(oldc[1]) + y),false)
    }

    setPosition(x,y) {
        this.PRVSET("Position",x + ";" + y,false)
    }

    onUpdate() {
        //this.incrementPosition(0.01,0.01)
    }

    onDestroy() {

    }

    onKeyChangedExternally(key, OldValue, NewValue) {
        this.setupSprite2()
    }

    onKeyAddedExternally(key, value) {

    }

}

//# sourceURL=TextContainerNLW.js