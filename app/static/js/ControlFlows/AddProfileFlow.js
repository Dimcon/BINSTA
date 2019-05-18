

function doTextWithMetrics(text, textstyle) {
    let tmpText1 = new PIXI.Text(text, textstyle);
    let textMetrics1 = PIXI.TextMetrics.measureText(text, textstyle)
    return [tmpText1, textMetrics1]
}

function getTextStyle(fsize, color, wordWrapw, weight, align) {
    let tstyle = new PIXI.TextStyle({fontFamily: BodyFont,
                fontSize: fsize,
                fontWeight: weight,
                fill: color,
                fillGradientType: 1,
                stroke: '#d8d8d8',
                strokeThickness: 0,
                wordWrap: true,
                wordWrapWidth: wordWrapw,
                align:align
            })
    return tstyle
}
class AddProfileFlow {
    constructor() {
        disableAllDataComponentInteractivity()
        this.sprite = null
        this.StartStage1()
    }

    StartStage1() {
        let fX = vecScreen.x / 100
        let fY = vecScreen.y / 100
        this.sprite = new PIXI.Sprite()
        let sprite = this.sprite


        let headingStyle = getTextStyle(45, BlenderGradient,fX * 80,'normal','center')
        let heading = "It looks like you're new here!"
        let val = doTextWithMetrics(heading,headingStyle)
        let tmpText1 = val[0]
        let textMetrics1 = val[1]
        tmpText1.position.x = (45*fX) - (textMetrics1.width/2)
        tmpText1.position.y = 20*fY


         let headingStyle2 = getTextStyle(45, gradOrange,fX * 80,'normal','center')
         let heading2 = "We've put you on the map"
         let val2 = doTextWithMetrics(heading2,headingStyle2)
         let tmpText2 = val2[0]
         let textMetrics2 = val2[1]
         tmpText2.position.x = (60*fX) - (textMetrics2.width/2)
         tmpText2.position.y = 25*fY

         let headingStyle3 = getTextStyle(25, gradCleanMirror,fX * 40,'normal','justified')
         let heading3 = "Your profile is where people are directed when they click on your name. You can relocate it " +
         "at any time by clicking the \"🌀\" button and dragging from the middle."
         let val3 = doTextWithMetrics(heading3,headingStyle3)
         let tmpText3 = val3[0]
         let textMetrics3 = val3[1]
         tmpText3.position.x = (50*fX) - (textMetrics3.width/2)
         tmpText3.position.y = 40*fY

         let headingStyle4 = getTextStyle(25, gradHeavyRain,fX * 40,'normal','justified')
         let heading4 = "Click anywhere on the map to move around. Use your middle mouse button to zoom in and out" +
         " to get a better look"
         let val4 = doTextWithMetrics(heading4,headingStyle4)
         let tmpText4 = val4[0]
         let textMetrics4 = val4[1]
         tmpText4.position.x = (50*fX) - (textMetrics4.width/2)
         tmpText4.position.y = 55*fY

        let headingStyle5 = getTextStyle(25, ['#25ff99'],fX * 60,'bold','justified')
        let heading5 = "Click Here to dismiss!"
        let val5 = doTextWithMetrics(heading5,headingStyle5)
        let tmpText5 = val5[0]
        let textMetrics5 = val5[1]
        tmpText5.position.x = (50*fX) - (textMetrics5.width/2)
        tmpText5.position.y = 70*fY



        let dimmer = this.DimmerGraphic()
        sprite.addChild(dimmer)
        sprite.addChild(tmpText1)
        sprite.addChild(tmpText2)
        sprite.addChild(tmpText3)
        sprite.addChild(tmpText4)

        tmpText5.interactive = true
        tmpText5.on("click", function(e) {
            addProfileFlow.EndStage1()
        })
        sprite.addChild(tmpText5)
        uistage.addChild(sprite)
    }

    EndStage1() {
        removeAndDestroySprite(this.sprite)
        enableAllDataComponentInteractivity()
    }

    DimmerGraphic() {
        let graphics = new PIXI.Graphics()
        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginFill(0x111111);
        graphics.drawRoundedRect(0, 0,vecScreen.x, vecScreen.y,0);
        graphics.endFill();
        graphics.alpha = 0.9
        return graphics
    }
}

//# sourceURL=AddProfileFlow.js