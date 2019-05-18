

class NavigationUI {
    constructor() {
        this.componentname = "navigationui"
        this.components = []
        this.sprite = new PIXI.Sprite()
        this.setup()
        this.coordinateInput = {text:""}
    }

    setup() {
        let screen = vecScreen.clone()
        let fX = screen.x / 100
        let fY = screen.y / 100

        let graphics = new PIXI.Graphics()

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
        let text = "🏡"
        let RenderText = new PIXI.Text(text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(text, textstyle)

        let width =  textMetrics.width + (0.3*50)
        let height = textMetrics.width + (0.3*50)

        let posStartx = 50*fX - textMetrics.width
        let posStarty = 85*fY

        RenderText.position.x = (posStartx) + (0.15 * 50) - (width/2)
        RenderText.position.y = posStarty + (0.15 * 50) + 16

        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginFill(0x383838);
        graphics.drawEllipse((posStartx), posStarty + (height/2) + 15, width/2, height/2);
        graphics.endFill();
        graphics.alpha = 1

        this.sprite.addChild(graphics)
        this.sprite.addChild(RenderText)
        RenderText.buttonMode = true;
        RenderText.interactive = true
        this.sprite.buttonMode = true;
        this.sprite.interactive = true
        this.sprite.on("click", function() {
            if (hasPlacedProfile) {
                userNavigation.gotoprofile()
            }
        })

        uistage.addChild(this.sprite)
    }

    update() {
        //It's static UI. Not much to do here.
    }

}