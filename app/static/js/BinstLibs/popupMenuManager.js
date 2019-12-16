
// Menu looks like this:
//  Menu
//  Position
//  isOpen
//  Items in menu
//      buttons
//          text
//          textstyle
//          imagePreset

class PopupMenuManager {
    constructor() {
        this.popups = {}
        this.popupcounter = 0
        this.currentMenuOpts = {}
        this.resetCurrentmenuopts()
        this.animDist = 2
        this.animDur = 250
    }

    resetCurrentmenuopts() {
        this.currentMenuOpts["pos"] = new Vector(0,0)
        this.currentMenuOpts["truepos"] = new Vector(0,0)
        this.currentMenuOpts["heading"] = "Menu has ended before it was started"
        this.currentMenuOpts["started"] = false
        this.currentMenuOpts["items"] = []
    }

    startMenu(vecPosition,txtHeading) {
        this.currentMenuOpts["pos"] = new Vector(vecPosition.x,vecPosition.y + this.animDist)
        this.currentMenuOpts["truepos"] = vecPosition
        this.currentMenuOpts["heading"] = txtHeading
        this.currentMenuOpts["started"] = true
    }

    addPlainButton(text, textStyle, onPress, data1, data2) {
        let button = {}
        button.text = text
        button.textStyle = textStyle
        button.onPress = onPress
        button.data1 = data1
        button.data2 = data2
        this.currentMenuOpts["items"].push(button)
    }

    endMenu() {
        let tmpscale = 50 - unitsize
        let menu = {}
        menu.pos = this.currentMenuOpts.pos
        menu.truepos = this.currentMenuOpts.truepos
        menu.heading = this.currentMenuOpts.heading
        menu.started = this.currentMenuOpts.started
        menu.items = this.currentMenuOpts.items
        let sprite = new PIXI.Sprite()

        let dimensions = [250,500]
        let mainpadding = [25,25]
        let spacing = 0

        let headingstyle = new PIXI.TextStyle({
                    fontFamily: NameFont,
                    fontSize: 18,
                    fontWeight: 'normal',
                    fill: BodyColor,
                    stroke: '#d8d8d8',
                    strokeThickness: 0,
                    wordWrap: true,
                    wordWrapWidth: dimensions[0]*2,
                    breakWords:true,
                    align:'center'
                })
        let HeadingText = new PIXI.Text(menu.heading, headingstyle);
        let HeadingMetrics = PIXI.TextMetrics.measureText(menu.heading, headingstyle)
        let graphics = new PIXI.Graphics()



        let yPos = 0

        HeadingText.position.x = (dimensions[0]/2) - (HeadingMetrics.width/2)
        HeadingText.position.y = mainpadding[1] / 2
        sprite.addChild(graphics)
        sprite.addChild(HeadingText)

        yPos += HeadingText.position.y + HeadingMetrics.height + mainpadding[1] / 2

        for (let btns in menu.items) {
            let btn = menu.items[btns]
            let btnsprite = new PIXI.Sprite()
            let btngraphics = new PIXI.Graphics()

            let btnstyle = new PIXI.TextStyle({
                fontFamily: NameFont,
                fontSize: 24,
                fontWeight: 'normal',
                fill: BodyColor,
                stroke: '#d8d8d8',
                strokeThickness: 0,
                wordWrap: true,
                wordWrapWidth: dimensions[0] - (2* mainpadding[0]),
                breakWords:true,
                align:'Justified'
            })
            let btnText = new PIXI.Text(btn.text, btnstyle);
            let btnMetrics = PIXI.TextMetrics.measureText(menu.heading, btnstyle)

            btnText.position.x = mainpadding[0]
            btnText.position.y = yPos + mainpadding[1]/2

            btngraphics.lineStyle(2, 0x222222, 1);
            btngraphics.beginFill(0x383865);
            btngraphics.drawRoundedRect(0, yPos, dimensions[0], mainpadding[1] + btnMetrics.height,8);
            btngraphics.endFill();
            btngraphics.alpha = 0

            btngraphics.interactive = true
            btngraphics.on('click', function() {
                btn.onPress(btn.data1,btn.data2)
            })
            btngraphics.on('mousedown', function() {
                btngraphics.alpha = 1
            })
            btngraphics.on('mouseup', function() {
                btngraphics.alpha = 0
            })

            yPos += mainpadding[1] + btnMetrics.height + spacing
            btnsprite.addChild(btngraphics)
            btnsprite.addChild(btnText)
            menu.items[btns].sprite = btnsprite
            menu.items[btns].graphics = btngraphics
            sprite.addChild(btnsprite)
        }

        graphics.lineStyle(2, 0x222222, 1);
        graphics.beginFill(0x383838);
        graphics.drawRoundedRect(0, 0, dimensions[0], yPos,8);
        graphics.endFill();
        graphics.alpha = 1

        menu.dimensions = new Vector(dimensions[0],dimensions[1])
        menu.sprite = sprite
        menu.popupid = this.popupcounter
        sprite.alpha = 0
        uistage.addChild(sprite)
        this.popups[this.popupcounter] = menu
        this.popupcounter += 1
        this.resetCurrentmenuopts()
        return this.popupcounter - 1
    }

    update() {
        for (let menus in this.popups) {
            this.updatePopup(menus)
        }
    }

    updatePopup(popupId) {
        let menu = this.popups[popupId]
        let newvecposition = ScreenCoordToPlaneCoord(menu.pos)
        let fX = ScreenSizeToPlaneSize(menu.dimensions).x / 100
        let fY = ScreenSizeToPlaneSize(menu.dimensions).y / 100
        let scale = 0.6
        menu.sprite.position.x = newvecposition.x
        menu.sprite.position.y = newvecposition.y
        menu.sprite.scale.x = scale
        menu.sprite.scale.y = scale
    }

    animatePopupIn(popupID) {
        if (popupID in this.popups) {
            let menu = this.popups[popupID]

            AddLoop()
            $({
                tmpval: 0.0,
                tmpval2: popupID
                }).animate({
                tmpval: 1.0,
                tmpval2: popupID
                }, {
                duration: this.animDur,
                step: function(tmpval,fx) {
                    let menu = popupmenumanager.popups[fx.elem.tmpval2]
                    menu.sprite.alpha = fx.elem.tmpval
                    menu.pos.y = parseFloat(parseFloat(menu.truepos.y) + ((1.0 - fx.elem.tmpval) * parseFloat(popupmenumanager.animDist)))
                    //popupmenumanager.updatePopup(menu.popupid)
                },
                done: function(tmpval,fx) {
                    //let menu = popupmenumanager.popups[fx.elem.tmpval2]
                    //menu.sprite.alpha = 1
                    //menu.pos.y = menu.pos.truepos
                    MinusLoop()
                }
            });
        }
    }

    closeAll() {
         for (let menus in this.popups) {
             let menu = this.popups[menus]

             if (menu.sprite.alpha > 0) {
                this.animateMenuOut(menus)
             }
         }
    }

    animateMenuOut(popupID) {
        if (popupID in this.popups) {
                    let menu = this.popups[popupID]
                    AddLoop()
                    $({
                        tmpval: 1.0,
                        tmpval2: popupID
                        }).animate({
                        tmpval: 0.0,
                        tmpval2: popupID
                        }, {
                        duration: this.animDur,
                        step: function(tmpval,fx) {
                            let menu = popupmenumanager.popups[fx.elem.tmpval2]
                            menu.sprite.alpha = fx.elem.tmpval
                            menu.pos.y = parseFloat(parseFloat(menu.truepos.y) + ((1.0 - fx.elem.tmpval) * parseFloat(popupmenumanager.animDist)))
                            //popupmenumanager.updatePopup(menu.popupid)
                        },
                        done: function(tmpval,fx) {
                            //let menu = popupmenumanager.popups[fx.elem.tmpval2]
                            //menu.sprite.alpha = 1
                            //menu.pos.y = menu.pos.truepos
                            MinusLoop()
                        }
                    });
                }
    }
}


//# sourceURL=popupMenuManager.js