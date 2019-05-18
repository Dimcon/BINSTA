


var canvas
var Uservector = [0,0]// Used as the map offset relative to the Screen coordinate system
var vecScreen // Vector representing the X and Y size of the screen coordinate system
var roundness // Used to determine radius of squares drawn using p5 canvas
var drawables = [] // List of Draggable derived classes that include the methods:
                    // draw() :: The drawable will draw itself onto the canvas
                    // onclick(vecRelativeClickPos,actualcoords) :: Handle click events (On render loop)
                    // ondrag(vecRelativeClickPos,actualcoords) :: click event
                    // onrelease(vecRelativeClickPos,actualcoords) :: click event
var fences = [] // List of drawables that are also fences. These get drawn below
                    // Connections.
var fXScreen // 1% of the screen width
var fYScreen // 1% of the screen height

var unitsize = 30 // Value representing map scale. ( between 1 and max zoom)
var maxzoom = 100
var spacer = (5 * unitsize) // How far apart the closest grid lines are to each other

var currentMousePos = { x: -1, y: -1 }; // Jquery mouse event handling
var firstConnLink = [] // Stores a connectable when the connectable is clicked to initiate linking
var secondConnLink = [] // Stores the second connectable during linking (Probably a connectableSocket)
var centerScreenRelToUser // TODO: Supposed to store the intersection of the ray fired into the map from the center of the screen
var loader // Caching and loading mechanism used to load and unload drawables and related data/information
var useremail = ""

var socket

var UserNeedsToPlaceProfile = false

var loadingPosition = false

var connectedToSocketIOServer = false

userposts = {}

//p5.disableFriendlyErrors = true;

function setup() {
        //disableFriendlyErrors = true;
        setupSocketIO()
        Uservector = createVector(0,0)
        setupCanvas()
        setupCircleMask()
        setupScreenDimensions()
        setupLoader()
        setupSocketIOCallbacks()
        let usersthatcanadd = [""]
        if (UserNeedsToPlaceProfile) {

        } else {
            $('#baselinebuttons').removeClass('hidden')
        }
        $('#baselinebuttons').removeClass('hidden')
        defferreddraggable = new DefferredDraggable()

        RunAfterSetup()
        invalidate()

}

function setupSocketIOCallbacks() {
    setupSocketCallbacks()
    setupSocketLoadPersonCallback()
    socket.on('Update', function(fromserver) {
        console.log("Got update from server")
    });
    socket.on('connect', function(fromserver) {
        console.log("Connection established")
        connectedToSocketIOServer = true
        //positionchanged()
        invalidate()
    });
    socket.on('disconnect', function(fromserver) {
        console.log("Connection broken")
        connectedToSocketIOServer = false
        invalidate()
    });
}

function setupLoader() {
    loader = new loaderclass(createVector(0,0))
    loader.setupSocketLoadCallback()
    loader.setupSocketUpdateCallback()
    //loader.refresh(0,0)
}

function setupScreenDimensions() {
    vecScreen = createVector(window.innerWidth, window.innerHeight);
    fYScreen = vecScreen.y / 100
    fXScreen = vecScreen.x / 100
    roundness = vecScreen.x / 100 / 3
    centerScreenRelToUser = createVector(0,0)
}

function setupSocketIO() {
    namespace = '/navengine';
    options = {
        //transports: ['websocket','polling']
    }
    socket = io.connect('http://' + document.domain + ':' + location.port + namespace,options);
}

var outstring = ""
function printout(input) {
    outstring += input
}

function setupCanvas() {
    grey = color(52,58,64,255)
    darkgrey = color(32,38,45,255)
    lightgrey = color(82,88,104,255)
    initDataStructures()
    UserVectorAcceleration = createVector(0,0)
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    setupHandlers(canvas)
    frameRate(60)
    noLoop()
}

function invalidate() {
    //loop()
    canloop = true
}
var canloop = true
var looping = 0
function MinusLoop() {
    looping -= 1
}
function AddLoop() {
    looping += 1
    if (looping > 0) {
        //loop()
        canloop = true
    }
}

var RenderTimedifference = 0
var rendering = false
var frameRenderLimit = 16
function NewRenderLoop() {

    let d = new Date();
    let before = d.getMilliseconds();
    handleKeyPresses()
    if (canloop && (!rendering)) {
        rendering = true
        redraw()
        rendering = false
    }
    d = new Date();
    let after = d.getMilliseconds();
    RenderTimedifference = after - before
}

function setupCircleMask() {
    circlemask = new Graphics();
    circlemask.beginFill(0x000000);
    circlemask.lineStyle(0);
    circlemask.drawCircle(100, 100, 10);
    circlemask.endFill();
}

function completedSomeLoad() {
    invalidate()
}

var userpositiontmp = [0,0]
var displayUsers = []

function draw() {
    centerScreenRelToUser = createVector(Uservector.x + (vecScreen.x / 2),Uservector.y + (vecScreen.y / 2))
    background(0);
    drawGrid()
    DrawRipples()
    drawUsers()
    handlePortals()
    handleFences()
    handlePosts()
    handleDragDeceleration()
    drawStructs()
    drawcoords()
    if (looping <= 0) {
        noLoop()
        looping = 0
        canloop = false
    }
}

function handlePosts() {
    if (tmpimagedat[0] == 1) {
        var img = tmpimagedat[1]
        var startx = (50*fXScreen)
        var starty = (50*fYScreen)
        var size = 6 * unitsize
        let imgscale = 1
        if (img.width > img.height) {
            imgscale = (size) / img.width
        } else {
            imgscale = (size) / img.height
        }
        var startdrawat = createVector(startx - (img.width * imgscale/2),starty - (img.height * imgscale/2))
        image(img,startdrawat.x,startdrawat.y,img.width * imgscale,img.height * imgscale)
    }
}

function drawUsers() {
    for(email in people) {
        if (people[email].IsInRangeTimer > 0) {
            let bob = people[email]
            newvecposition = ScreenCoordToPlaneCoord(createVector(bob.MapPosition[0],bob.MapPosition[1]))

            if (useremail == bob.email) {
                fill(180,100)
                noStroke()
            } else {
                fill(180,50,50,100)
                noStroke()
            }

            if (bob.imageready) {
                let img = bruce.profileImageBuffer
                //img.mask(circlemask)
                let size = 2*unitsize
                image(img,newvecposition.x - (size/2), newvecposition.y - (size/2),size,size)
            } else {
                ellipse(newvecposition.x, newvecposition.y,1*unitsize,1*unitsize);
            }
            if (useremail != bob.email) {
                noFill()
                strokeWeight(3)
                stroke(180,50,50,100)
                let zoomlevel = 1000
                ellipse(newvecposition.x, newvecposition.y,zoomlevel*unitsize/bob.zoomlevel,zoomlevel*unitsize/bob.zoomlevel);
            }

        }
    }
}

function drawcoords() {
    textSize(20)
    fill(180)

    let displaystring = ""
    displaystring += parseInt(centerScreenRelToUser.x / spacer) + " "
    displaystring += parseInt(centerScreenRelToUser.y/spacer) + " ("
    displaystring += (unitsize) + "%) "
    if (connectedToSocketIOServer) {
         displaystring += "     [Link] Up "
         if (loadingPosition) {
            displaystring += "     [Data] Dirty, Updating "
        } else {
            displaystring += "     [Data] Updated    "
        }
    } else {
        displaystring += "     [Link] Down! connecting "
        if (loadingPosition) {
            displaystring += "     [Data] Dirty, waiting for connection "
        } else {
            displaystring += "     [Data] Link down    "
        }
    }
    //outstring = ""
    noStroke()
    text(displaystring,(vecScreen.x/100) *1,(vecScreen.y/100)*3)
}

function onresize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.size(w,h);
  width = w;
  height = h;
};

function drawGrid() {
    push()
    let startpoint = createVector(-Uservector.x % spacer, -Uservector.y % spacer)
    let gridvec = createVector(parseInt(startpoint.x),parseInt(startpoint.y))
    strokeWeight(2)
    let shoulddraw = true
    let valcomp = 2
    let posx = 0
    let posy = 0
    while (gridvec.x < vecScreen.x) {
        posx = abs((Uservector.x) + (gridvec.x))
        posx = Math.round(posx * 100) / 100
        if ((Uservector.x) + (gridvec.x) > 0) {
            posx = posx + 1
        }
        if (parseInt(posx % (100 * spacer)) < spacer / valcomp) {
            stroke(200);
        } else if (posx % (25 * spacer) < spacer / valcomp) {
            stroke(120);
        } else if (posx % (5 * spacer) < spacer / valcomp) {
            if (unitsize < 1.3) {
                shoulddraw = false
            }
            stroke(60);
        } else {
            if (unitsize < 4) {
                shoulddraw = false
            }
            stroke(30);
        }
        if (shoulddraw) {
            line(gridvec.x, 0, gridvec.x, vecScreen.y);
        } else {
            shoulddraw = true
        }
        gridvec.x += spacer
    }
    shoulddraw = true
    while (gridvec.y < vecScreen.y) {
        posy = abs((Uservector.y) + (gridvec.y))
        posy = Math.round(posy * 100) / 100
        if ((Uservector.y) + (gridvec.y) > 0) {
            posy = posy + 1
        }
        if (posy % (100 * spacer) < spacer / valcomp) {
            stroke(200);
        } else if (posy % (25 * spacer) < spacer / valcomp) {
            stroke(120);
        } else if (posy % (5 * spacer) < spacer / valcomp) {
            if (unitsize < 1.3) {
                shoulddraw = false
            }
            stroke(60);
        } else {
            if (unitsize < 4) {
                shoulddraw = false
            }
            stroke(30);
        }

        if (shoulddraw) {
            line(0, gridvec.y, vecScreen.x, gridvec.y + 1);
        } else {
            shoulddraw = true
        }
        gridvec.y += spacer
    }
    pop()
}

	//# sourceURL=navigator.js