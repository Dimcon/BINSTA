

class NewPostUI {
    constructor() {
        this.componentname = "newpostui"
        this.components = []

        this.vecposition = new Vector(10,0)
        this.vecsize = new Vector(15,10)
        this.sprite = new PIXI.Sprite()
        this.input = []
        this.isActive = false
        this.imgs = []
        this.rawimgs = []
        this.imgsprite = []
        this.ezguiUI = []
        this.clickhandlers = []
        this.CalledByDataComponent = ""
        this.setupUI()
    }

    setupUI() {
        let guiContainer = new PIXI.Container();


        let ezguiScreen = EZGUI.create(mainScreenJSON, 'binstatheme');
        ezguiScreen.visible = true;
        guiContainer.addChild(ezguiScreen);

        this.clickhandlers.push(function() {
                                            // creating input on-the-fly
                                            let newpostui = binstuimanager.uicomponents["newpostui"]
                                            newpostui.input = $(document.createElement("input"));
                                            newpostui.input.attr("type", "file");
                                            newpostui.input.trigger("click"); // opening dialog
                                            newpostui.input.on("change", function() {
                                                if (typeof (FileReader) != "undefined") {
                                                    var reader = new FileReader();
                                                    reader.onload = function (e) {
                                                        var img = PIXI.Texture.fromImage(e.target.result);
                                                        let newpostui = binstuimanager.uicomponents["newpostui"]
                                                        newpostui.rawimgs[0] = e.target.result
                                                        newpostui.imgs[0] = img
                                                        img.on("update", newpostui.showImages)
                                                    }
                                                    let newpostui = binstuimanager.uicomponents["newpostui"]
                                                    reader.readAsDataURL(newpostui.input[0].files[0]);
                                                } else {
                                                    alert("This browser does not support FileReader.");
                                                }
                                            })
                                            return false; // avoiding navigation // Shrugs
                                        })
        EZGUI.components.btnImg.on("click", this.clickhandlers[0])
        var container = new PIXI.DisplayObjectContainer();

        // Same style options as PIXI.Text
        var style={fontFamily: BodyFont,
                               fontSize: 30,
                               fontWeight: 'normal',
                               fill: '#222222',
                               fillGradientType: 2,
                               stroke: '#d8d8d8',
                               strokeThickness: 0,
                               align:'Justified'};

        var inputField = new PixiTextInput("Type here",style);

        inputField.backgroundColor = 0xffffff;
        inputField.width = 900
        inputField.position.x = 50
        inputField.position.y = 65
        inputField.focus()

        this.clickhandlers.push(function() {
                    let newpostui = binstuimanager.uicomponents["newpostui"]
                    let posttext = inputField.text

                    let pos = new Vector(newpostui.vecposition.x,newpostui.vecposition.y)
                    let repliedTo = "None"
                    if (this.CalledByDataComponent != "") {
                        repliedTo = newpostui.CalledByDataComponent.coordinateID
                    }
                    if (newpostui.rawimgs.length == 1) {

                        $.post("/newuserimagepost",{
                    		file: newpostui.rawimgs[0],
                    		data:posttext,
                    		posx:pos.x + 4,
                        	posy:pos.y + (2),
                        	repliedToCoord: repliedTo
                    	}).done(function(fromserver) {
                    	    let posx = pos.x
                            let posy = pos.y + 2
                    	    dissuccess("pssst, yeah you, you did good kid. (Your image has been posted)")
                    	    //addDrawable(new imagepost(true,fromserver.postid,fromserver.coordid,createVector(posx,posy)))
                    	    cancelnewpost()
                    	}).fail(function() {
                    	    diserror("AAAAAAAHHHHHH. oops. I don't think you're on the internet.. Try again?")
                    	})
                    } else {
                        $.post("/newuserpost",{
                        	data: posttext,
                        	posx:pos.x + 4,
                        	posy:pos.y + 2,
                            repliedToCoord: repliedTo
                        }).done(function(fromserver) {
                            console.log(fromserver)
                            let posx =pos.x
                            let posy =pos.y
                            //addDrawable(new textpost(true,fromserver.postid,fromserver.coordid,createVector(posx,posy)))
                        	dissuccess("Woop. Your post has solid structural integrity. We put it in your crosshairs.")
                        	cancelnewpost()
                        }).fail(function() {
                            diserror("Woah okay we can't find the internet. Uhm do it again?")
                        })
                    }
                    newpostui.normalise()
                    newpostui.hideAll()
                    inputField.text = "Type here"

                })
        EZGUI.components.btnPost.on("click", this.clickhandlers[1])

        EZGUI.components.btnCancel.on("click", function() {
                    //let newpostui = binstuimanager.uicomponents["newpostui"]
                    //newpostui.normalise()
                    //EZGUI.components.btnImg.on("press", newpostui.clickhandlers[0])
                    //EZGUI.components.btnImg.text = '🖼️ Image'
                    binstuimanager.uicomponents["newpostui"].hideAll()
                    return true
                })
//
//        var input = new PIXI.Input();
        guiContainer.addChild(inputField);
        this.ezguiUI = guiContainer
        this.sprite.addChild(guiContainer)
        this.hideAll()
        uistage.addChild(this.sprite)
    }

    showImages() {
        let newpostui = binstuimanager.uicomponents["newpostui"]
        let loadedimage = newpostui.imgs[0]

        let tmpscale = 50
        let fX = 12 * 50 / 100
        let fY = 12 * 50 / 100
        let imgscale = 1
        if (loadedimage.width > loadedimage.height) {
            imgscale = (100*fX) / loadedimage.width
        } else {
            imgscale = (100*fY) / loadedimage.height
        }
        let loadedimageSprite = new PIXI.Sprite(loadedimage)
        loadedimageSprite.scale.x = (imgscale)
        loadedimageSprite.scale.y = (imgscale)
        newpostui.imgsprite = loadedimageSprite
        newpostui.sprite.addChild(loadedimageSprite)
        loadedimageSprite.position.x = 500 - (loadedimageSprite.width/2)

        newpostui.ezguiUI.position.y = loadedimageSprite.height + 20
        EZGUI.components.btnImg.text = '🖼️ Image ❌'
        EZGUI.components.btnImg.on("click", function() {
            let newpostui = binstuimanager.uicomponents["newpostui"]
            newpostui.normalise()
            EZGUI.components.btnImg.on("press", newpostui.clickhandlers[0])
            EZGUI.components.btnImg.text = '🖼️ Image'
            return true
        })

        invalidate()
    }

    showAtPosition(vecPos, CalledByDataComponent) {
        if (typeof CalledByDataComponent !== 'undefined') {
            this.CalledByDataComponent = CalledByDataComponent
        }
        this.vecposition = vecPos
        this.vecposition.x -= (450 / 50)
        this.sprite.alpha = 1
        //disableAllDataComponentInteractivity()
        this.isActive = true
        this.sprite.interactive = true
    }

    normalise() {
        let newpostui = binstuimanager.uicomponents["newpostui"]
        newpostui.imgs = []
        removeAndDestroySprite(newpostui.imgsprite)
        newpostui.ezguiUI.position.y = 0
    }

    hideAll() {
        //enableAllDataComponentInteractivity()
        this.sprite.alpha = 0
        this.sprite.position.x = -10000
        this.isActive = false
        this.sprite.interactive = false
    }

    update() {
        if (this.isActive) {
            let newvecposition = ScreenCoordToPlaneCoord(this.vecposition)
            let fX = ScreenSizeToPlaneSize(this.vecsize).x / 100
            let fY = ScreenSizeToPlaneSize(this.vecsize).y / 100
            let scale = unitsize / 50
            this.sprite.position.x = newvecposition.x
            this.sprite.position.y = newvecposition.y
            this.sprite.scale.x = scale
            this.sprite.scale.y = scale
        }
    }
}

//# sourceURL=NewPostUI.js