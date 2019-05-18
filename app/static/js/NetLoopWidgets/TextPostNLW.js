

class TextPostNLWManager extends NetLoopWidgetBase {
    constructor() {
        super()
        this.ApplicationID = "BINSTA"
        this.instanceType = "TextWidget"
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
        return new TextPostNLW(iID,DataComp)
    }
}
let tw = new TextPostNLWManager()
NetLoopWidgetManagers[tw.instanceType] = tw

class TextPostNLW extends NetComponent {

    constructor(instanceIdentity, DataComp) {
        super()
        this.instanceType = "TextWidget"
        this.instanceID = instanceIdentity
        this.DataComponent = DataComp
    }

    onCreate() {
        this.setupSprite()
    }

    setupSprite() {
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

        this.DataComponent.vecsize.y = height / 50
        this.DataComponent.vecsize.x = width / 50

        graphics.lineStyle(2, 0x222222, 1);
        graphics.beginFill(0x383838);
        graphics.drawRoundedRect(0, 0, width, height,8);
        graphics.endFill();
        graphics.alpha = 1
        //graphics.on('mousedown', widgetManager.OnReportDataComponentPressed)
        TextSprite.position.x = (0.5 * 50)
        TextSprite.position.y = (0.25 * 50)

        this.DataComponent.RenderText= RenderText
        //graphics.filters = [Bloomfilter]
        this.DataComponent.sprite.addChild(graphics)

        this.DataComponent.sprite.addChild(TextSprite)
        //DataComponent.sprite.cacheAsCanvas = true
        if (!debugDisableUserContent)
            stage.addChild(this.DataComponent.sprite)
        if (this.keyExists("OwnerEmail")) {
            this.DataComponent.owneremail = this.get("OwnerEmail")
            widgetManager.setupDataComponentProfileDraw(this.DataComponent)
        } else {
            console.log("OWNER DOESN't EXIST")
        }


        //if (this.DataComponent.ownerdefined) {
        //    widgetManager.setupDataComponentProfileDraw(this.DataComponent)
        //    widgetManager.setupDataComponentReplyButton(this.DataComponent, width, height)
        //}
    }

    onDestroy() {

    }

    onKeyChangedExternally(key, OldValue, NewValue) {
        this.setupSprite()
    }

    onKeyAddedExternally(key, value) {

    }

}

//# sourceURL=TextPostNLW.js