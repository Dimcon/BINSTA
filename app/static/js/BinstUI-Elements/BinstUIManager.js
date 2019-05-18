

class UIComponent {
    constructor() {
        this.vecposition = new Vector(0,0)
        this.vecsize = new Vector(1,1)
        this.sprite = new PIXI.Sprite()
    }
}

class BinstUIManager {
    constructor() {
        let listofcomponents = [
            new NewPostUI()
            //,new NavigationUI()
        ]
        this.uicomponents = {}
        for (let item in listofcomponents) {
            this.uicomponents[listofcomponents[item].componentname] = listofcomponents[item]
        }
    }

    update() {
        for (let item in this.uicomponents) {
            let component = this.uicomponents[item]
            component.update()
        }
    }
}


//# sourceURL=BinstUIManager.js