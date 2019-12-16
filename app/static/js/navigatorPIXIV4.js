


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
var maxzoom = 150
var minzoom = 0.05
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

var renderer
var stage, uistage, mainstage


var dirt
var peopleManager
var userNavigation
var widgetManager
var popupmenumanager
var binstuimanager = []
var postlinkmanager
var networkLooper
var nlwinput
var comms

var debugDisableUserContent = false

var tmptextrue

var BodyFont = 'Helvetica'
var NameFont = 'Helvetica'
var ButtonFont = 'Helvetica'

var BodyColor = ['#d0c4bd']
var NameColor = ['#d80058']
var ButtonColor = ['#607d8b']
var colOrange = ['#ff4700']
var colLightOrange = ['#ff8100']
var ButtonColorFaded = ['#545454']

var BlenderGradient = ['#00c0c0','#ee82ee']
var gradOrange = ['#ff4700','#ff8100']
var gradCleanMirror = ['#e4efe9','#93a5cf']
var gradCleanMirrorRev =  ['#93a5cf','#e4efe9']
var gradHeavyRain = ['#cfd9df','#e2ebf0']
var gradCloudyKnoxville = ['#fdfbfb','#ebedee']
var NameGradient = gradOrange
var horizontalGradient = 1

var addProfileFlow = null

var NLWFunctions = []

function setup() {
    console.log("[i] Started setup")
    //PIXI.loader.add('Verdana', 'static/bmpFonts/Verdana/verdana2.fnt')
    //    .load(setupV2);
    // We seriously have to delay the rest of the system until we download an asset cos PIXI asset management is shit.
    setupV2()
}

function isNull(variable) {
    return variable === undefined || variable === null
}

function setupV2() {
    setupPIXI()
    setupSocketIO()
    Uservector = new Vector(UserPosition[0],UserPosition[1])

    setupHandlers()
    setupCoordText()
    setupScreenDimensions()
    postlinkmanager = new PostLinkManager()
    widgetManager = new WidgetManager()
    loader = new NetworkLoader(new Vector(0,0))
    networkLooper = new NetworkLooper()
    nlwinput = new NLWInputHandler()
    comms = new Comms()

    setupSocketIOCallbacks()
    let usersthatcanadd = [""]
    widgetManager.initWidgets()
    if (UserNeedsToPlaceProfile) {

    } else {
        $('#baselinebuttons').removeClass('hidden')
    }
    $('#baselinebuttons').removeClass('hidden')
    defferreddraggable = new DefferredDraggable()

    RunAfterSetup()
    invalidate()

    if (!hasPlacedProfile) {
        addProfileFlow = new AddProfileFlow()
    }

    WidgetTests()
}

function WidgetTests() {
    //NetLoopWidgetManagers["TextContainerWidget"].Create(new Vector(50,-20),"Lorem ipsum")
}


var Bloomfilter

function setupPIXI() {
    mainstage = new PIXI.Container();
    stage = new PIXI.Container();
    uistage = new PIXI.Container();
    mainstage.addChild(stage)
    mainstage.addChild(uistage)

    var width = $("#binst-canvas").width();
    var height = $("#binst-canvas").height();
    vecScreen = new Vector(width,height)
    renderer = PIXI.autoDetectRenderer(width,height,
      {view:document.getElementById("binst-canvas"),
      resolution:1,
      roundPixels:false,
      autoResize:true,
      //legacy:false,
      //clearBeforeRender:true,
      //preserveDrawingBuffer:false,
      powerPreference:"high-performance"
      //,antialias:true
      //,forceFXAA:true
      }
    );
    setupEZGUI()

    peopleManager = new PeopleManager()
    dirt = new Dirt()
    userNavigation = new UserNavigation()
    popupmenumanager = new PopupMenuManager()


    Bloomfilter = new PIXI.filters.BloomFilter (10,4,0.5,11)
    //stage.filters = [filter];

    stage.interactiveChildren = true
    uistage.interactiveChildren = true
    mainstage.interactiveChildren = true

    let Circlegraphic = new PIXI.Graphics() //datastructures.js
    Circlegraphic.lineStyle(4, 0x55dd55, 0);
    Circlegraphic.beginFill(0xffffff,1);
    Circlegraphic.drawCircle (50*4, 50*4, 50*2);
    Circlegraphic.endFill()

    userCircleMask = new PIXI.Sprite()
    userCircleMask.addChild(Circlegraphic)
}




var ezguiScreen;

function setupEZGUI() {
    var guiContainer = new PIXI.Container();

    EZGUI.Theme.load(['static/EZGUI-themes/binsta-theme/binsta-theme.json'], function () {
        //EZGUI.themes['metalworks'].override(themeOverride);
    	//ezguiScreen = EZGUI.create(mainScreenJSON, 'metalworks');
    	//ezguiScreen.visible = true;
    	//guiContainer.addChild(ezguiScreen);

    	binstuimanager = new BinstUIManager()
    });
    mainstage.addChild(guiContainer)
}

// Called from Dirt.js on right click
createItemMenuItems = {}
function createItemMenu(pos) {
    popupmenumanager.startMenu(pos, "Add")
    for (let itemindex in createItemMenuItems) {
        item = createItemMenuItems[itemindex]
        // Text, TextStyle, Onpress, Data item 1, Data item 2
        popupmenumanager.addPlainButton(item[0],item[1],item[2],item[3], item[4])
    }
    let popupnum = popupmenumanager.endMenu()
    popupmenumanager.animatePopupIn(popupnum)
}
function setupSocketIOCallbacks() {
    widgetManager.setupSocketCallbacks()
    peopleManager.setupSocketCallbacks()
    comms.setupSocketCallbacks()
    networkLooper.registerSocketIORecievers()
    socket.on('Update', function(fromserver) {
        console.log("Got update from server")
    });
    socket.on('connect', function(fromserver) {
        console.log("Connection established")

        $('#statusbtn').html('<i class="fas fa-hands-helping"></i>')
        $('#statusbtn').removeClass('disconnected')
        $('#baselinebuttons').removeClass('bbdisconnected')
        connectedToSocketIOServer = true
        //positionchanged()
        //networkLooper.CreateNetComponent({'dataitem1':"Value item 1 is a test","Dataitem2":"Value 2 is a longer test"})
        invalidate()
    });
    socket.on('disconnect', function(fromserver) {
        console.log("Connection broken")
        $('#statusbtn').html('<i class="fas fa-satellite"></i>')
        $('#statusbtn').addClass('disconnected')
        $('#baselinebuttons').addClass('bbdisconnected')
        connectedToSocketIOServer = false
        invalidate()
    });
}

function setupScreenDimensions() {
    var width = $("#binst-canvas").width();
    var height = $("#binst-canvas").height();
    vecScreen = new Vector(width, height);
    fYScreen = vecScreen.y / 100
    fXScreen = vecScreen.x / 100
    roundness = vecScreen.x / 100 / 3
    centerScreenRelToUser = new Vector(0,0)
}

function setupSocketIO() {
    namespace = '/navengine';
    options = {
        transports: ['websocket','polling']
    }
    socket = io.connect('http://' + document.domain + ':' + location.port + namespace,options);
}

var outstring = ""
function printout(input) {
    outstring += input
}

function invalidate() {
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
function RenderLoop() {

    let d = new Date();
    let before = d.getMilliseconds();
    //handleKeyPresses()
    if (canloop && (!rendering)) {
        rendering = true
        draw()
        rendering = false
    }
    d = new Date();
    let after = d.getMilliseconds();
    RenderTimedifference = after - before
    //requestAnimationFrame(NewRenderLoop);
}

function setupCircleMask() {
    circlemask = createGraphics(500, 500);
    circlemask.fill(255,255,255,255)
    circlemask.ellipse(250,250,500,500)
}

function completedSomeLoad() {
    invalidate()
}

var userpositiontmp = [0,0]
var displayUsers = []

function draw() {
    centerScreenRelToUser = new Vector(Uservector.x + (vecScreen.x / 2),Uservector.y + (vecScreen.y / 2))
    dirt.drawGrid()
    peopleManager.draw()
    handleDragDeceleration()
    widgetManager.draw()
    popupmenumanager.update()
    postlinkmanager.update()
    networkLooper.pollForUpdatedData()
    if (binstuimanager.constructor == BinstUIManager) {
        binstuimanager.update()
    }
    drawcoords()
    renderer.render(mainstage);
    if (looping <= 0) {
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
        var startdrawat = new Vector(startx - (img.width * imgscale/2),starty - (img.height * imgscale/2))
        image(img,startdrawat.x,startdrawat.y,img.width * imgscale,img.height * imgscale)
    }
}



var CoordText
var LastDisplaySTring = ""
function setupCoordText() {
}
function drawcoords() {
    if (!$('#CoordinateEditor').is(":focus")) {
        $('#CoordinateEditor').val(parseInt(centerScreenRelToUser.x/unitsize) + "::" + parseInt(centerScreenRelToUser.y/unitsize))
    }
}

function onresize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.size(w,h);
  width = w;
  height = h;
};


//# sourceURL=navigator.js