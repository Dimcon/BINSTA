
class ImageNLW extends NetComponent {

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

    }

    getPosition() {
        return new Vector(parseFloat(this.get("Position").split(";")[0]), parseFloat(this.get("Position").split(";")[1]))
    }

    incrementPosition(x, y) {
        let oldc = this.get("Position").split(";")
        this.PRVSET("Position", (parseFloat(oldc[0]) + x) + ";" + (parseFloat(oldc[1]) + y), false)
    }

    setPosition(x, y) {
        this.PRVSET("Position", x + ";" + y, false)
    }

    onUpdate() {
        //this.incrementPosition(0.01,0.01)
    }

    onDestroy() {

    }

    onKeyChanged(key, OldValue, NewValue) {
        this.setupSprite2()
    }

    onKeyAddedExternally(key, value) {

    }

}

//# sourceURL=ImagesNLW.js