

class Dirt {

    constructor() {
        this.gridGraphic = new PIXI.Graphics()
        stage.addChild(this.gridGraphic);
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
        //push()
        this.beginGrid()
        this.gridGraphic.lineStyle(0, 0xffffff, 1);
        this.gridGraphic.beginFill(0x000000);
        this.gridGraphic.drawRect (0, 0, vecScreen.x, vecScreen.y)
        let startpoint = new Vector(-Uservector.x % spacer, -Uservector.y % spacer)
        let gridvec = new Vector(parseInt(startpoint.x),parseInt(startpoint.y))
        //strokeWeight(2)
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
                //stroke(200);
                this.lcolgrid(2,200)
            } else if (posx % (25 * spacer) < spacer / valcomp) {
                //stroke(120);
                this.lcolgrid(2,120)
            } else if (posx % (5 * spacer) < spacer / valcomp) {
                if (unitsize < 1.3) {
                    shoulddraw = false
                }
                //stroke(60);
                this.lcolgrid(2,60)
            } else {
                if (unitsize < 4) {
                    shoulddraw = false
                }
                //stroke(30);
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
                //stroke(200);
                this.lcolgrid(2,200)
            } else if (posy % (25 * spacer) < spacer / valcomp) {
                //stroke(120);
                this.lcolgrid(2,120)
            } else if (posy % (5 * spacer) < spacer / valcomp) {
                if (unitsize < 1.3) {
                    shoulddraw = false
                }
                //stroke(60);
                this.lcolgrid(2,60)
            } else {
                if (unitsize < 4) {
                    shoulddraw = false
                }
                //stroke(30);
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