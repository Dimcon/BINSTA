

class HistoryUI {
    constructor() {
        this.componentname = "historyui"
        this.components = []
        this.sprite = new PIXI.Sprite()
        this.setup()

        this.historyitems = {}
    }

    generateListItem(Position) {

    }

    setup() {
        uistage.addChild(this.sprite)
    }

    update() {
        //It's static UI. Not much to do here.
    }

}