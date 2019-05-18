

class MCQuestionNLWManager extends NetLoopWidgetBase {
    constructor() {
        super()
        this.ApplicationID = "BINSTA"
        this.instanceType = "MultipleChoiceWidget"
    }
    Create(Position,answers,question) {
        this.createNLWInstance(Position,{
                "Question":question,
                "Answers":answers,
                "Position":Position.x + ";" + Position.y
            })
    }

    Destroy() {

    }

    Load(iID,DataComp) {
        return new MCQuestionNLW(iID,DataComp)
    }
}
let mcw = new MCQuestionNLWManager()
NetLoopWidgetManagers[tw.instanceType] = mcw

class MCQuestionNLW extends NetComponent {
    constructor(instanceIdentity, DataComp) {
            super()
            this.instanceType = "MultipleChoiceWidget"
            this.instanceID = instanceIdentity
            this.DataComponent = DataComp
        }

        onCreate() {
            this.setupSprite()
        }

        onDestroy() {

        }
        onKeyChangedExternally(key, OldValue, NewValue) {
            this.setupSprite()
        }
        onKeyAddedExternally(key, value) {

        }
}

//# sourceURL=MCquestionNLW.js