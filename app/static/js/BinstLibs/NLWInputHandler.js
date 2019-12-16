


class NLWInputHandler {

    onMouseClick(mouseX,mouseY) {
        return false
    }

    onMouseRelease(mouseX,mouseY) {
        return false
    }

    onMouseMove(mouseX,mouseY) {
        return false
    }

    onMouseDrag(mouseX,mouseY) {
        return false
    }

    setupSpriteClickHandlers(Datacomponent,draggable) {
        if (draggable) {
            this.setAsDraggable(Datacomponent)
        }
    }

    setAsDraggable(Datacomponent) {
        Datacomponent.sprite.interactive = true

        Datacomponent.sprite
        .on("mousedown", function (e) {
                nlwinput.spriteClick(Datacomponent, e.data.global)
        }).on("touchstart", function (e) {
            return nlwinput.spriteClick(Datacomponent, e.data.global)
        }).on("pointerdown", function (e) {
            return nlwinput.spriteClick(Datacomponent, e.data.global)
        })
        .on("mouseup", function (e) {
            return nlwinput.spriteRelease(Datacomponent, e.data.global)
        }).on("mouseupoutside", function (e) {
            return nlwinput.spriteRelease(Datacomponent, e.data.global)
        }).on("touchend", function (e) {
            return nlwinput.spriteRelease(Datacomponent, e.data.global)
        }).on("touchendoutside", function (e) {
            return nlwinput.spriteRelease(Datacomponent, e.data.global)
        }).on("pointerup", function (e) {
            return nlwinput.spriteRelease(Datacomponent, e.data.global)
        })
        .on("mousemove", function (e) {
            return nlwinput.spriteDrag(Datacomponent, e.data.global)
        }).on("touchmove", function (e) {
            return nlwinput.spriteDrag(Datacomponent, e.data.global)
        })
    }

    setupRightClickHandler(Datacomponent,Handler) {
        Datacomponent.sprite
                    .on("pointerdown", function(e) {
                        return nlwinput.onRightClickHandler(Datacomponent,Handler,e)
                    }).on("touchstart", function(e) {
                        return nlwinput.onRightClickHandler(Datacomponent,Handler,e)
                    })

    }

    onRightClickHandler(Datacomponent, Handler, e) {
        if( e.data.originalEvent.button == 2 ) {
            let posX = e.data.originalEvent.pageX - $("#binst-canvas").position().left
            let posY = e.data.originalEvent.pageY - $("#binst-canvas").position().top;
            let popAt = new Vector(0,0)
            popAt.x = (Uservector.x + (posX)) / unitsize
            popAt.y = (Uservector.y + (posY)) / unitsize
            Handler(Datacomponent,e.data.global,popAt)
            return true
        }
        return false
    }

    spriteClick(Datacomponent,event) {
        let dragdata = Datacomponent.dragdata

        let returnable = false
        if (!Datacomponent.dragdata.startedDrag) {
            let posX = event.x - $("#binst-canvas").position().left
            let posY = event.y - $("#binst-canvas").position().top;
            let actualcoords = new Vector(posX,posY)
            Datacomponent.dragdata.oldmousepoints = copyvec(actualcoords)
            Datacomponent.dragdata.olduserpointsForTouchEvent = Datacomponent.NLWInstance.getPosition()
            Datacomponent.dragdata.hasdrag = true
            Datacomponent.dragdata.startedDrag = true
            interactiondisabled = true
            returnable = true
        }
        return returnable
    }

    spriteRelease(Datacomponent,event) {
        Datacomponent.dragdata.hasdrag = false
        Datacomponent.dragdata.startedDrag = false
        Datacomponent.NLWInstance.set("Position",Datacomponent.NLWInstance.get("Position"),false)
        interactiondisabled = false
        return false
    }

    spriteReleaseDefault(Datacomponent) {
        Datacomponent.dragdata.hasdrag = false
        Datacomponent.dragdata.startedDrag = false
        interactiondisabled = false
        return false
    }

    spriteDrag(Datacomponent,event) {
        let posX = event.x - $("#binst-canvas").position().left
        let posY = event.y - $("#binst-canvas").position().top;
        let actualcoords = new Vector(posX,posY)

        let dragdata = Datacomponent.dragdata
        if (dragdata.hasdrag) {
            let deltapoints = new Vector(actualcoords.x - dragdata.oldmousepoints.x,actualcoords.y -  dragdata.oldmousepoints.y)
            let posx = parseFloat(dragdata.olduserpointsForTouchEvent.x) + parseFloat(deltapoints.x / unitsize)
            let posy = parseFloat(dragdata.olduserpointsForTouchEvent.y) + parseFloat(deltapoints.y / unitsize)
            //Datacomponent.vecposition.x = posx
            //Datacomponent.vecposition.y = posy
            //console.log(posx + ":" + posy)
            Datacomponent.NLWInstance.setPosition(posx,posy)
            invalidate()
            return true
        }
        return false
    }

    spriteMouseOver() {

    }



}



	//# sourceURL=NLWInputHandlers.js