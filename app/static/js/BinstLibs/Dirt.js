

class Dirt {

    constructor() {
        this.gridGraphic = new PIXI.Graphics()
        this.gridsprite = new PIXI.Sprite()
        this.gridsprite.addChild(this.gridGraphic);
        this.gridsprite.interactive = true
        this.gridsprite.on("pointerdown", function (e) {
            return Dirt.rightClickHandler(e)
        }).on("touchstart", function (e) {
            return Dirt.rightClickHandler(e)
        })
        stage.addChild(this.gridsprite);
    }

    // This is not a great idea. But alas it may be the only way to get the desired result
    //      Use the background sprite as the default right click handler
    //      because it is more reliable than using the default javascript
    //      click handler which can't easily tell the difference between
    //      a sprite click and a background click
    static rightClickHandler(e) {
        if (e.data.originalEvent.button == 2) {
            let posX = e.data.originalEvent.pageX - $("#binst-canvas").position().left
            let posY = e.data.originalEvent.pageY - $("#binst-canvas").position().top;
            let popAt = new Vector(0, 0)
            popAt.x = (Uservector.x + (posX)) / unitsize
            popAt.y = (Uservector.y + (posY)) / unitsize
            createItemMenu(popAt)
            return true
        }
        return false
    }

    beginGrid() {
        this.gridGraphic.clear();
        this.gridGraphic.lineStyle(2, 0xffffff, 1);
        this.gridGraphic.beginFill(0xFF3300);
    }


    lcolgrid(weight,bri) {
        bri = bri.toString(16)
        let hstrg = bri + "" + bri + "" + bri
        this.gridGraphic.lineStyle(weight, parseInt(hstrg, 16), 1);
    }


    endGrid() {
        this.gridGraphic.endFill();
    }

    Whiteline(x,y,x2,y2) {
        this.gridGraphic.moveTo(x,y);
        this.gridGraphic.lineTo(x2,y2);
    }

    drawGrid() {
        this.beginGrid()
        this.gridGraphic.lineStyle(0, 0xffffff, 1);
        this.gridGraphic.beginFill(0x000000);
        this.gridGraphic.drawRect (0, 0, vecScreen.x, vecScreen.y)
        let startpoint = new Vector(-Uservector.x % spacer, -Uservector.y % spacer)
        let gridvec = new Vector(parseInt(startpoint.x),parseInt(startpoint.y))
        this.lcolgrid(2,200)
        let shoulddraw = true
        let valcomp = 2
        let posx = 0
        let posy = 0
        while (gridvec.x < vecScreen.x) {
            posx = Math.abs((Uservector.x) + (gridvec.x))
            posx = Math.round(posx * 100) / 100
            if ((Uservector.x) + (gridvec.x) > 0) {
                posx = posx + 1
            }
            if (parseInt(posx % (100 * spacer)) < spacer / valcomp) {
                this.lcolgrid(2,200)
            } else if (posx % (25 * spacer) < spacer / valcomp) {
                if (unitsize < 0.4) {
                    shoulddraw = false
                }
                this.lcolgrid(2,120)
            } else if (posx % (5 * spacer) < spacer / valcomp) {
                if (unitsize < 1.3) {
                    shoulddraw = false
                }
                this.lcolgrid(2,60)
            } else {
                if (unitsize < 4) {
                    shoulddraw = false
                }
                this.lcolgrid(2,30)
            }
            if (shoulddraw) {
                this.Whiteline(gridvec.x, 0, gridvec.x, vecScreen.y);
            } else {
                shoulddraw = true
            }
            gridvec.x += spacer
        }
        shoulddraw = true
        while (gridvec.y < vecScreen.y) {
            posy = Math.abs((Uservector.y) + (gridvec.y))
            posy = Math.round(posy * 100) / 100
            if ((Uservector.y) + (gridvec.y) > 0) {
                posy = posy + 1
            }
            if (posy % (100 * spacer) < spacer / valcomp) {
                this.lcolgrid(2,200)
            } else if (posy % (25 * spacer) < spacer / valcomp) {
                if (unitsize < 0.4) {
                    shoulddraw = false
                }
                this.lcolgrid(2,120)
            } else if (posy % (5 * spacer) < spacer / valcomp) {
                if (unitsize < 1.3) {
                    shoulddraw = false
                }
                this.lcolgrid(2,60)
            } else {
                if (unitsize < 4) {
                    shoulddraw = false
                }
                this.lcolgrid(2,30)
            }

            if (shoulddraw) {
                this.Whiteline(0, gridvec.y, vecScreen.x, gridvec.y + 1);
            } else {
                shoulddraw = true
            }
            gridvec.y += spacer
        }
        this.endGrid()
    }

}

//# sourceURL=Dirt.js