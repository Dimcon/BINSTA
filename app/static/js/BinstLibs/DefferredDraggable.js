var defferreddraggable

class DefferredDraggable {

    StartDrag(dataComponent,actualcoords) {
        if (!dataComponent.dragdata.isdragging) {
           return false
        }
        dataComponent.dragdata.startedDrag = true
        dataComponent.dragdata.oldmousepoints = copyvec(actualcoords)
        dataComponent.dragdata.olduserpointsForTouchEvent = copyvec(dataComponent.vecposition)
    }

    StopDrag(dataComponent) {
        dataComponent.dragdata.hasdrag = false
        dataComponent.dragdata.startedDrag = false
        return false
    }

    PerformDrag(dataComponent,actualcoords) {
        if (dataComponent.dragdata.startedDrag) {
            let dragdata = dataComponent.dragdata
            if (dragdata.isdragging) {
                let deltapoints = new Vector(actualcoords.x -  dragdata.oldmousepoints.x,actualcoords.y -  dragdata.oldmousepoints.y)
                let posx = parseFloat(dragdata.olduserpointsForTouchEvent.x) + parseFloat(deltapoints.x / unitsize)
                let posy = parseFloat(dragdata.olduserpointsForTouchEvent.y) + parseFloat(deltapoints.y / unitsize)
                dataComponent.vecposition.x = posx
                dataComponent.vecposition.y = posy

                let intersecting = true
                let counter = 0
                while (counter < 5 && intersecting) {
                    let fences = getUnownedFences()
                    let intersectingFences = []
                    intersecting = false
                    for (let i = 0; i < fences.length;i++) {
                        let fence = fences[i]
                        if (areRectsIntersecting(dataComponent.vecposition,dataComponent.vecsize)) {
                            intersectingFences.push(fence)
                            intersecting = true
                        }
                    }
                    if (intersecting) {
                        for (let i = 0; i < intersectingFences.length;i++) {
                            let fence = intersectingFences[i]
                            let fenceCenter = getCenter(fence.vecposition,fence.vecsize)
                            let ownCenter = getCenter(dataComponent.vecposition,dataComponent.vecsize)
                            let verticalDisplace = false
                            if (abs(fenceCenter.x - ownCenter.x) < abs(fenceCenter.y - ownCenter.y)) {
                                verticalDisplace = true
                            }
                            let newCenter = fence.rectNewCenterOnPosBan(dataComponent.vecposition,dataComponent.vecsize)
                            let newposx = newCenter.x - (dataComponent.vecsize.x / 2)
                            let newposy = newCenter.y - (dataComponent.vecsize.y / 2)
                            dataComponent.vecposition.x = newposx
                            dataComponent.vecposition.y = newposy
                        }
                    }
                    counter += 1
                }
                dataComponent.hasdrag = true
                return true
            }
            return false
         }
         return false
    }
}

//# sourceURL=Datastructures.js.js