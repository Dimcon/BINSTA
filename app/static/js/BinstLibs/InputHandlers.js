

// #######  JS CLICK HANDLERS and EVENT MISC
var draggingCanvas = false
clicked = false
var drawablewithdrag = [false]
var mobileclickagg = 0
Mousewaspressed = false

var touched = false
var onmobile = false
var interactiondisabled = false

var LastMouseCoords
var LastUservectorPosition
var deltamousepoints
var UserVectorAcceleration

var mouseIsPressed = false


function setupHandlers(canvas) {
// TODO: Find a way to make pinch to zoom work better on mobile
    //canvas.mousePressed(onClick);
    //canvas.mouseReleased(onReleaseClick)
    //canvas.mouseMoved(onmousemove)
    //canvas.touchStarted(ontouch)
    //canvas.touchEnded(releaseTouch)
    //canvas.touchMoved(onMouseDrag)
    $("#binst-canvas").on('pointerdown',onClick)
    $("#binst-canvas").on('pointerup',onReleaseClick)
    $("#binst-canvas").on('pointermove',onmousemove)
    $("#binst-canvas").bind('mousewheel DOMMouseScroll', mouseWheel);

    window.onkeydown = function(event) {
       invalidate()
                       console.log("Keypressed")
    }
    $("#binst-canvas").bind("keypress",function() {
                invalidate()
                console.log("Keypressed")
            })
    UserVectorAcceleration = new Vector(0,0)
}

function resetCanvasDrag() {
    LastMouseCoords = undefined
    LastMouseCoords = new Vector(mouseX, mouseY)
    LastUservectorPosition = new Vector(Uservector.x,Uservector.y)
}

function ontouch() {
    touched = true
    console.log("Touch at " + mouseX + " " + mouseY)

}

function releaseTouch() {
    touched = false
    console.log("Release at " + mouseX + " " + mouseY)
    onClick()
    onReleaseClick()
}

let KeyboardMoveFactor


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    value = 255;
  } else if (keyCode === RIGHT_ARROW) {
    value = 0;
  }
}
function handleKeyPresses() {
    if (keyIsPressed == true) {
        let xMoveFactor = 15
        let yMoveFactor = 10
        if (keyIsDown(LEFT_ARROW) || (key == 'a') || (key == 'A')) {
            //Uservector.x -= xMoveFactor
            UserVectorAcceleration.x = -xMoveFactor
            StartDragDeceleration()

        }
        if (keyIsDown(RIGHT_ARROW) ||(key == 'd') || (key == 'D')) {
           // Uservector.x += xMoveFactor
           UserVectorAcceleration.x = xMoveFactor
           StartDragDeceleration()
        }
        if (keyIsDown(UP_ARROW) ||(key == 'w') || (key == 'W')) {
            UserVectorAcceleration.y = -yMoveFactor
            StartDragDeceleration()
        }
        if (keyIsDown(DOWN_ARROW) || (key == 's') || (key == 'S')) {
            UserVectorAcceleration.y = yMoveFactor
            StartDragDeceleration()
        }
        if ((key == 'q') || (key == 'Q')) {
            mouseX = vecScreen.x/2
            mouseY = vecScreen.y / 2
            doubleClicked()
        }
    }
}

var mouseDebug = false

function disableAllDataComponentInteractivity() {
    disableStageInteractivity()
    disableBinstInteractivity()
}

function disableStageInteractivity() {
    stage.interactiveChildren = false
}

function disableBinstInteractivity() {
    interactiondisabled = true
}

function enableAllDataComponentInteractivity() {
    enableStageInteractivity()
    enableBinstInteractivity()
}

function enableStageInteractivity() {
    stage.interactiveChildren = true
}

function enableBinstInteractivity() {
     interactiondisabled = false
}



function onClick(e) {
    mouseIsPressed = true
    popupmenumanager.closeAll()
    let posX = e.pageX - $("#binst-canvas").position().left
    let posY = e.pageY - $("#binst-canvas").position().top;
    //if (nlwinput.onMouseClick(posX,posY)) {
    //    return true
    //}
    if (mouseDebug) console.log("Clicked: " + posX + ", " + posY)
    if (!interactiondisabled) {
        if( e.button == 2 ) {
            vecPopMenuAt = new Vector(posX, posY)
            let newvec = new Vector(0,0)
            newvec.x = (Uservector.x + (vecPopMenuAt.x)) / unitsize
            newvec.y = (Uservector.y + (vecPopMenuAt.y)) / unitsize

            //createTestMenu(newvec)
            mouseIsPressed = false
            return false;
        }
        absorbed = false
        clicked = true
        let posx = posX
        let posy = posY

        if (posx == 0 && posy == 0) {
            onmobile = true
        }
        if (true) {
            mobileclickagg = 1

            for (let widget in widgetManager.widgets) {
                let dataComponents = widgetManager.widgets[widget].DataComponents
                for (let itemkey in dataComponents) {
                    let dataitem = dataComponents[itemkey]
                    newvecposition = ScreenCoordToPlaneCoord(dataitem.vecposition)
                    let relx = posx - newvecposition.x
                    let rely = posy - newvecposition.y
                    let tsize = ScreenSizeToPlaneSize(dataitem.vecsize)
                    relx = relx / tsize.x
                    rely = rely / tsize.y
                    absorbed = widgetManager.getWidget(widget).onClickDown(dataitem,new Vector(relx,rely),new Vector(posx,posy))
                    if (absorbed) {
                        break
                    }
                }
                if (absorbed) {
                    break
                }
            }
            if (!absorbed && !onmobile) {

                LastMouseCoords = new Vector(posx,posy)
                LastUservectorPosition = new Vector(Uservector.x,Uservector.y)
            }
        }
    }
    invalidate()
}

function StartMouseDrag(posx,posy) {
    LastMouseCoords = new Vector(posx,posy)
    LastUservectorPosition = new Vector(Uservector.x,Uservector.y)
}

function StartDragDeceleration() {
    if (!Deccelerating) {
        AddLoop()
        Deccelerating = true
    }
}

var Deccelerating = false

function handleDragDeceleration() {
    if ((UserVectorAcceleration.x > -0.1) && (UserVectorAcceleration.x < 0.1)) {
        UserVectorAcceleration.x = 0
    }
    if ((UserVectorAcceleration.y > -0.1) && (UserVectorAcceleration.y < 0.1)) {
        UserVectorAcceleration.y = 0
    }
    if ((UserVectorAcceleration.x > -0.1) && (UserVectorAcceleration.x < 0.1)) {
        if ((UserVectorAcceleration.y > -0.1) && (UserVectorAcceleration.y < 0.1) && Deccelerating) {
            Deccelerating = false
            MinusLoop()
        }
    }
    if (!draggingCanvas && Deccelerating) {
        Uservector.x += UserVectorAcceleration.x
        Uservector.y += UserVectorAcceleration.y
        let factor = 5
        UserVectorAcceleration = new Vector(UserVectorAcceleration.x - (UserVectorAcceleration.x/factor),UserVectorAcceleration.y - (UserVectorAcceleration.y / factor))
        //invalidate()
    }
}

function onReleaseClick(e) {
    mouseIsPressed = false
    let posX = e.pageX - $("#binst-canvas").position().left
    let posY = e.pageY - $("#binst-canvas").position().top;
    //if (nlwinput.onMouseRelease(posX,posY)) {
        //return true
    //}
    if (!interactiondisabled) {

        if (mouseDebug) console.log("released: " + posX + ", " + posY)
        clicked = false
        let posx = posX
        let posy = posY
        draggingCanvas = false
        absorbed = false
        for (let widget in widgetManager.widgets) {
                let dataComponents = widgetManager.widgets[widget].DataComponents
                for (let itemkey in dataComponents) {
                 let dataitem = dataComponents[itemkey]
                 newvecposition = ScreenCoordToPlaneCoord(dataitem.vecposition)
                 let relx = posx - newvecposition.x
                 let rely = posy - newvecposition.y
                 let tsize = ScreenSizeToPlaneSize(dataitem.vecsize)
                 relx = relx / tsize.x
                 rely = rely / tsize.y
                 absorbed = widgetManager.getWidget(widget).onClickUp(dataitem,new Vector(relx,rely),new Vector(posx,posy))
                 if (absorbed) {
                     break
                 } else {
                 // Replaced with PIX sprite native click handling functionality
                    //if (dataitem.owned()) {
                    //    let width = tsize.x
                    //    let height = tsize.y
                    //    let margin = (0.2*unitsize)
                    //    let indexer = 0
                    //    for (index in dataitem.defaultbuttons) {
                    //        let button = dataitem.defaultbuttons[index]
//
                    //        if ("sprite" in button) {
                    //            let sprite = button["sprite"]
                    //            let size = sprite.width * (unitsize / 50)
                    //            let btnpos = new Vector(sprite.worldTransform.tx - size,
                    //                sprite.worldTransform.ty + size)
                    //            if (posx > btnpos.x && posx < btnpos.x + size) {
                    //                if (posy > btnpos.y && posy < btnpos.y + size) {
                    //                    if ("onclick" in button) {
                    //                        absorbed = button["onclick"](dataitem)
                    //                    }
                    //                }
                    //            }
                    //            indexer += 1
                    //        }
                    //        //if (absorbed) {
                    //        //    break
                    //        //}
                    //    }
                    //    if (absorbed) {
                    //        break
                    //    }
                    //}
                }
             }
             if (absorbed) {
                 break
             }
        }
        if (!absorbed) {
            userNavigation.positionchanged()
            StartDragDeceleration()
        }
    }
    //loader.updatePosition((Uservector.x + (vecScreen.x/2)) / unitsize,(Uservector.y + (vecScreen.y/2)) / unitsize)
    invalidate()
}

var zoomstops = [1,1.5,2,3,5,9.7,12.288,15.36,19.2,24,30,37.5,46.8,75,100]
let display =   ["1","5","10","15","25","50","75","90","100"]
var zoomstoppos = 10
var MouseZoomAnim = "NaN"

function mouseWheel(event) {
    //if (!interactiondisabled) {
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            // scroll up
            zoomstoppos += 1
        }
        else {
            // scroll down
            zoomstoppos -= 1
        }
        //if (event.delta < 0) zoomstoppos += 1
        //if (event.delta > 0) zoomstoppos -= 1
        if (zoomstoppos > zoomstops.length - 1) {
            zoomstoppos = zoomstops.length - 1
        } else if (zoomstoppos < 0) {
            zoomstoppos = 0
        }
        if (MouseZoomAnim != "NaN") {
            MouseZoomAnim.stop()
        }
        MouseZoomAnim = userNavigation.ZoomTo(zoomstops[zoomstoppos],60,true)
        $("#zoombtn").html("<i class=\"fas fa-search-plus\"></i> " + zoomstops[zoomstoppos])
}

function doubleClicked() {
    if (MouseZoomAnim != "NaN") {
         MouseZoomAnim.stop()
     }
     //if (unitsize < 30) {
     //   MouseZoomAnim = ZoomTo(zoomstops[7],160,true)
     //}
     if (unitsize != 30) {
        MouseZoomAnim = userNavigation.ZoomTo(zoomstops[7],750,true)
     }
    let mvecx = (Uservector.x + mouseX) / unitsize
    let mvecy = (Uservector.y + mouseY ) / unitsize
    let tmpvec = new Vector(mvecx,mvecy)
    //tmpvec = ScreenCoordToPlaneCoord(tmpvec)
     userNavigation.gotoRelative(tmpvec,500)
     if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}

function onmousemove(e) {
    let posX = e.pageX - $("#binst-canvas").position().left
    let posY = e.pageY - $("#binst-canvas").position().top;
   //if (nlwinput.onMouseMove(posX,posY)) {
   //    return true
   //}
    if (mouseDebug && 0) console.log("Moved: " + posX + ", " + posY)
    let posx = posX
    let posy = posY
    for (let widget in widgetManager.widgets) {
        let dataComponents = widgetManager.widgets[widget].DataComponents
        for (let itemkey in dataComponents) {
        let dataitem = dataComponents[itemkey]
        if (unitsize > 12) {
            let relx = posx - ScreenCoordToPlaneCoord(dataitem.vecposition).x
            let rely = posy - ScreenCoordToPlaneCoord(dataitem.vecposition).y
            relx = relx / (ScreenSizeToPlaneSize(dataitem.vecsize).x + (2*unitsize))
            rely = rely / ScreenSizeToPlaneSize(dataitem.vecsize).y
            if (relx <= 1 && relx >=0 && rely >=0 && rely <= 1) {
                //dataitem.MouseIsInside = true
                widgetManager.getWidget(widget).onMouseMove(dataitem,new Vector(relx,rely),new Vector(posx,posy))
            } else {
                //dataitem.MouseIsInside = false
                widgetManager.getWidget(widget).onMouseMoveOutside(dataitem,new Vector(relx,rely),new Vector(posx,posy))
            }
        }
         }
    }
    if (clicked && mouseIsPressed) {
        onMouseDrag(e)
    } else {
        clicked = false
    }
}

function mouseMoved() {
    if (firstConnLink.length > 0) {
        //invalidate()
    }
}

function onMouseDrag(e) {
    let posX = e.pageX - $("#binst-canvas").position().left
    let posY = e.pageY - $("#binst-canvas").position().top;
    if (nlwinput.onMouseDrag(posX,posY)) return true
    if (mouseDebug && 0) console.log("Clicked: " + posX + ", " + posY)
    if (!interactiondisabled) {
        let posy = 0
        let posx = 0
        if (onmobile) {
            posx = posX
            posy = posY
            console.log(mouseX + " " + mouseY)
            if (mobileclickagg <= 2) {
                //onClick()
                mobileclickagg++
                LastMouseCoords = new Vector(posx,posy)
                LastUservectorPosition = new Vector(Uservector.x,Uservector.y)
                return false
            }
            mobileclickagg++
        } else {
            posx = posX
            posy = posY
        }
        absorbed = false
        if (!draggingCanvas) {
            if (drawablewithdrag[0]) {
                dataitem = widgetManager.getWidget(drawablewithdrag[1]).DataComponents[drawablewithdrag[2]]
                absorbed = dataitem.dragdata.hasdrag
            }
            if (!absorbed) {
               for (let widget in widgetManager.widgets) {
                    let dataComponents = widgetManager.widgets[widget].DataComponents
                    for (let itemkey in dataComponents) {
                         let dataitem = dataComponents[itemkey]
                         let relx = posx - ScreenCoordToPlaneCoord(dataitem.vecposition).x
                         let rely = posy - ScreenCoordToPlaneCoord(dataitem.vecposition).y
                         relx = relx / ScreenSizeToPlaneSize(dataitem.vecsize).x
                         rely = rely / ScreenSizeToPlaneSize(dataitem.vecsize).y
                         absorbed = widgetManager.getWidget(widget).onClickDrag(dataitem,new Vector(relx,rely),new Vector(posx,posy))
                         if (absorbed) {
                            drawablewithdrag = [true,widget,itemkey]
                             break
                         }
                     }
                     if (absorbed) {
                         break
                     }
                }
            } else {
               dataitem = widgetManager.getWidget(drawablewithdrag[1]).DataComponents[drawablewithdrag[2]]
               let relx = posx - ScreenCoordToPlaneCoord(dataitem.vecposition).x
               let rely = posy - ScreenCoordToPlaneCoord(dataitem.vecposition).y
               relx = relx / ScreenSizeToPlaneSize(dataitem.vecsize).x
               rely = rely / ScreenSizeToPlaneSize(dataitem.vecsize).y
               widgetManager.getWidget(drawablewithdrag[1]).onClickDrag(dataitem,new Vector(relx,rely),new Vector(posx,posy))
            }
        }
        if (!absorbed && ! (typeof  LastMouseCoords == 'undefined')) {
            if (!draggingCanvas) {
                StartMouseDrag(posx,posy)
                draggingCanvas = true
            } else {
                deltamousepoints = new Vector(posx - LastMouseCoords.x,posy - LastMouseCoords.y)
                let OldUserVector = Uservector.clone()
                Uservector = new Vector((LastUservectorPosition.x - deltamousepoints.x), (LastUservectorPosition.y - deltamousepoints.y))
                UserVectorAcceleration = new Vector(Uservector.x - OldUserVector.x, Uservector.y - OldUserVector.y)
                loader.updatePosition(new Vector((Uservector.x + (vecScreen.x/2)) / unitsize,(Uservector.y + (vecScreen.y/2)) / unitsize))
            }
        }
        invalidate()
    }
}

// ###################

	//# sourceURL=InputHandlers.js