

class RadialFence {
    constructor() {
        this.ItemType = "RadialFence"
        this.ItemSubclass = ""
        this.ItemSubclassID = ""
        this.DataComponents = {}
    }

    initDataStructure(DataComponent, initItem) {
        widgetManager.FillDataComponentsWithBaseData(initItem,DataComponent,createVector(50,50))
        DataComponent.zdepth = 10

        DataComponent.diameter = initItem.xsize
        DataComponent.vecsize = createVector(DataComponent.diameter,DataComponent.diameter)
        DataComponent.buffer = createGraphics(
            DataComponent.vecsize.x * 50,
            DataComponent.vecsize.y * 50
        );

        DataComponent.EntranceList = initItem.accessgrants.split(';')
        DataComponent.EntranceList.indexOf(useremail)
        DataComponent.owned = () => DataComponent.EntranceList.indexOf(useremail) > -1
        //let fX = 1
        //let fY = DataComponent.vecsize.y / DataComponent.vecsize.x

        DataComponent.hasMouseMovehandler = true
        DataComponent.maxdrawscale = 1
        this.DataComponents[DataComponent.coordinateID] = DataComponent
    }

    loadpost(postid) {
    }

    loadCallBack(fromserver) {
    }

    resizeFromText(datacomponent) {
    }

    setupSocketCallbacks() {
    }

    onMouseMoveOutside(DataComponent,vecRelativeClickPos,actualcoords) {
        //animProfileLineOut(DataComponent)
        //invalidate()
    }

    onMouseMove(DataComponent,vecRelativeClickPos,actualcoords) {
        //animProfileLineIn(DataComponent)
        //invalidate()
    }

    onClickDown(dataComponent,vecRelativeClickPos,actualcoords) {
        if (IsWithinViewingRectangle(dataComponent,unitsize)) {
            if (ispointinrect(vecRelativeClickPos, createVector(0,0), createVector(1,1))) {
                return defferreddraggable.StartDrag(dataComponent,actualcoords)
            }
        }
        return false
    }

    onClickUp(dataComponent,vecRelativeClickPos,actualcoords) {
        return defferreddraggable.StopDrag(dataComponent)
    }

    onClickDrag(dataComponent,vecRelativeClickPos,actualcoords) {
        if (defferreddraggable.PerformDrag(dataComponent,actualcoords)) {
            return true
        }
        return false
    }

    draw(DataComponent,UnitSize) {
    }
}

//# sourceURL=FenceWidget.js