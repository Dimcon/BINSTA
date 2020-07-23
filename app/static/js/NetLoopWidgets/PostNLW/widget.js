var fontsizes = {
    'nametag': 40,
    'timetag': 30,
    'bottombar': 50,
    'bottombartext': 30
}

var nametagStyle = new PIXI.TextStyle({
    //font:"35px Verdana",
    fontFamily: BodyFont,
    fontSize: fontsizes['nametag'],
    fontWeight: 'normal',
    fill: '#ffffff',
    fillGradientType: 2,
    stroke: '#b8b8b8',
    strokeThickness: 0,
    wordWrap: false,
    breakWords: true,
    align: 'Justified'
})

var timetagstyle = new PIXI.TextStyle({
    //font:"35px Verdana",
    fontFamily: BodyFont,
    fontSize: fontsizes['timetag'],
    fontWeight: 'bold',
    fill: '#a3a3a3',
    fillGradientType: 2,
    stroke: '#575757',
    strokeThickness: 0,
    wordWrap: true,
    wordWrapWidth: 500,
    breakWords: true,
    align: 'Justified'
})

var textstyle = new PIXI.TextStyle({
    //font:"35px Verdana",
    fontFamily: BodyFont,
    fontSize: 8,
    fontWeight: 'normal',
    fill: '#bfbfbf',
    fillGradientType: 2,
    stroke: '#d8d8d8',
    strokeThickness: 0,
    wordWrap: true,
    wordWrapWidth: 8,
    breakWords: true,
    align: 'left'
})

var heartstyle = new PIXI.TextStyle({
    //font:"35px Verdana",
    fontFamily: BodyFont,
    fontSize: fontsizes['bottombar'],
    fontWeight: 'normal',
    fill: '#bfbfbf',
    fillGradientType: 2,
    stroke: '#d8d8d8',
    strokeThickness: 0,
    wordWrap: false,
    wordWrapWidth: 0,
    breakWords: false,
    align: 'left'
})

function splitIntoChunks(list, chunksize) {
    var i, j, temparrays=[], chunk = chunksize;
    for (i = 0, j = list.length; i < j; i += chunk) {
        temparrays.push(list.slice(i, i + chunk));
    }
    return temparrays
}

function showImageModal(imageID)
{
    let html = `
            <script>
            $('#mymodal').modal()
            $('#mymodal').on('hide.bs.modal', function (e) {
                $('#JSLoadHere').empty()
            })
            </script>
            <div id="mymodal" class="modal fade" tabindex="-1" role="dialog">
              <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content bg-dark text-light">
<!--                  <div class="modal-header">-->
<!--                    <h5 class="modal-title"></h5>-->
<!--                    <button type="button" class="close" data-dismiss="mymodal" aria-label="Close">-->
<!--                      <span aria-hidden="true">&times;</span>-->
<!--                    </button>-->
<!--                  </div>-->
                  <div class="modal-body">
                    <img style="width:100%; border-radius: 0.25rem" src="getimageid-` + imageID + `" class=""/>
                    <div class="mt-2 d-flex justify-content-end">
                    <button type="button" onclick="window.open('/getimageid-` + imageID + `','_blank');" class="btn btn-outline-secondary" style="border-radius: 5rem">
                        Open in new tab
                    </button>
                    <button type="button" onclick="$('#mymodal').modal('hide')" class="ml-2 btn btn-outline-primary" style="border-radius: 5rem">
                        <i class="fas fa-undo"></i>
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `
    replacePlaceholderWithHtml(html, '#JSLoadHere')
}


class PostNLW extends NetComponent {

    constructor(instanceIdentity, DataComp) {
        super()
        this.instanceType = "PostWidget"
        this.instanceID = instanceIdentity
        this.DataComponent = DataComp
        this.loaders = []
        this.imgwidth = 800
        this.imagesWithIDs = {}
        this.debug = false
    }

    onCreate() {
        this.setupSprite2()
    }

    loadImageID(imageID, pSprite) {
        if (imageID in this.imagesWithIDs) {
            let imgobj = this.imagesWithIDs[imageID]
            pSprite.addChild(imgobj)
            return
        }
        let tmploader = new PIXI.loaders.Loader();
        var loaderOptions = {
            loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
            xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BLOB
        };
        tmploader.loadintosprite = pSprite
        tmploader.imgwidth = this.imgwidth
        tmploader.imgID = imageID
        tmploader.imglist = this.imagesWithIDs
        tmploader.add('Img', "/getimageid-" + imageID, loaderOptions)
            .on('load', function (loader, resource) {
                resource.texture.mipmap = true
                resource.texture.baseTexture.resolution = 0.01
                resource.texture.baseTexture.mipmap = true
                let bt = new PIXI.BaseTexture(resource.texture.baseTexture.source, 0, 10)
                bt.mipmap = true
                let tx = new PIXI.Texture(bt)
                let holderSprite = loader.loadintosprite
                let loadedimage = new PIXI.Sprite(tx)
                holderSprite.addChild(loadedimage)
                loader.imglist[loader.imgID] = loadedimage
                loadedimage.interactive = true
                loadedimage.on("click", () => {
                    showImageModal(loader.imgID)
                })
                let imgscale = 1
                let imgsquare = loader.imgwidth
                let xyadjust = [0,0]
                if (loadedimage.width > loadedimage.height) {
                    imgscale = (imgsquare) / loadedimage.width
                    let newheight = imgscale * loadedimage.height
                    xyadjust= [
                        0,
                        (imgsquare - newheight) / 2
                    ]
                } else {
                    imgscale = (imgsquare) / loadedimage.height
                    let newwidth = imgscale * loadedimage.width
                    xyadjust = [
                        (imgsquare - newwidth) / 2,
                        0
                    ]
                }
                loadedimage.position.x = xyadjust[0]
                loadedimage.position.y = xyadjust[1]
                loadedimage.scale.x = (imgscale)
                loadedimage.scale.y = (imgscale)

                completedSomeLoad()
            });
        tmploader.load()
        this.loaders.push(tmploader)
    }

    buildTopBar(owner,graphics, nametagLength,totalwidth) {
        let amOwner = useremail === owner.email
        let profileTextSprite = new PIXI.Sprite()
        let textMetrics2 = PIXI.TextMetrics.measureText('...', nametagStyle)
        let nameTagSprite = RenderTextToSprite(new PIXI.Text('...', nametagStyle))
        profileTextSprite.addChild(nameTagSprite)
        let timetext = moment(this.get('CreateDate')).fromNow();
        let timeTagMetrics = PIXI.TextMetrics.measureText(timetext, timetagstyle)
        let timeTagSprite = RenderTextToSprite(new PIXI.Text(timetext, timetagstyle))
        let profileImageSprite = new PIXI.Sprite()
        let profileImageHolder = new PIXI.Sprite()
        profileImageSprite.addChild(profileImageHolder)
        owner.onDataChanged(function (Person, Datacomponent) {
                let RenderText = new PIXI.Text(Person.getShortenedName(nametagLength)[0], nametagStyle);
                let TextSprite = RenderTextToSprite(RenderText)
                removeAndDestroySprite(nameTagSprite)
                profileTextSprite.addChild(TextSprite)
            }
            , this.DataComponent
        )
        owner.onImageChanged(function (Person, Datacomponent) {
                removeAndDestroySprite(profileImageHolder)
                profileImageHolder = resizeImageSprite(Person.profileimage, profileImagesize, profileImagesize)
                profileImageSprite.addChild(profileImageHolder)
            }
            , this.DataComponent
        )
        let profilePadding = {"l": 0.6 * 50, "t": 0.6 * 50, "r": 0.3 * 50, "b": 0.6 * 50}
        let padding = {"l": 0.75 * 50, "t": 0.75 * 50, "r": 0.75 * 50, "b": 0.9 * 50}
        let roundness = 32
        let toppad = 10
        let nametagheight = profilePadding.t + profilePadding.b + profileImagesize
        profileTextSprite.position.x = profilePadding.l + profilePadding.r + profileImagesize
        profileTextSprite.position.y = toppad + profilePadding.t + (profileImagesize / 2) - textMetrics2.height
        let timtaggap = 0.3 * 50
        timeTagSprite.position.x = profilePadding.l + profilePadding.r + profileImagesize
        timeTagSprite.position.y = toppad + profilePadding.t + (profileImagesize / 2) - textMetrics2.height + timeTagMetrics.height + timtaggap
        // Header bkg
        let linewidth = 0//(amOwner) ? 2 : 0
        graphics.lineStyle(0, 0xa95c1b, 1,1 ,true);
        graphics.beginFill(
            (amOwner)? headerBarColors.blue:
                (isEmailInFriendList(owner.email))?
                    headerBarColors.orange: headerBarColors.grey);
        graphics.drawRoundedRect(-linewidth, -linewidth, totalwidth + (2* linewidth), nametagheight + roundness + (2 * linewidth), roundness);
        graphics.endFill();
        let tmpSprite = new PIXI.Sprite()
        tmpSprite.addChild(profileImageSprite)
        tmpSprite.addChild(profileTextSprite)
        tmpSprite.addChild(timeTagSprite)
        profileImageSprite.position.x = profilePadding.l
        profileImageSprite.position.y = profilePadding.t
        return [nametagheight, tmpSprite]
    }



    buildBottomBar(graphics, width, startHeight) {
        let roundness = 32
        let bottombarheight = 100
        // Dark bottom bar
        graphics.lineStyle(0, 0x222222, 0);
        graphics.beginFill(0x252525);
        graphics.drawRoundedRect(0, startHeight - roundness, width, roundness + bottombarheight, roundness);
        graphics.endFill();
        let heartcounters = this.setupHeartsAndCounters(
            [width, bottombarheight + startHeight],
            startHeight,
            this.DataComponent
        )
        return [heartcounters]
    }

    drawText(Text,textsize, width) {
        let tsize = textsize
        textstyle.fontSize = tsize
        textstyle.wordWrapWidth = width
        let RenderText = new PIXI.Text(Text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(Text, textstyle)
        let PostText = RenderTextToSprite(RenderText)
        return [textMetrics, PostText]
    }

    setupSprite2() {
        removeAndDestroySprite(this.DataComponent.sprite)
        this.DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let temptext = this.get("Text")
        if (isNull(temptext)) {
            temptext = "AERIGHEIRGH"
        }
            //"Lorem ipsum Lorem ipsum Lorem ipsum LorLoremem ipsum Loremum rem ipum LorLoremem ipsum Lorem ipsum"

        let owner = peopleManager.getPerson(this.get("OwnerEmail"))
        let listofItems = this.get("Fileids")
        if (isNull(listofItems)) {
            listofItems = []
        } else {
            listofItems = JSON.parse(listofItems)
        }
        if (this.debug) console.log(listofItems)
        let padding = {"l": 0.75 * 50, "t": 0.75 * 50, "r": 0.75 * 50, "b": 0.75 * 50}
        let itempadding = {
            "l": 0.25 * 50,
            "t": 0.25 * 50,
            "r": 0.25 * 50,
            "b": 0.25 * 50,}
        // Split into chunks so we can draw them in rows
        let chunks = splitIntoChunks(listofItems, 4)
        let itemWidth = 695 / ((chunks.length > 0)? chunks[0].length:1)
        this.imgwidth = itemWidth
        let twidth = 875;
        let nametagLength = 30
        let tsize = getScaleText(temptext)
        if (tsize > 30) {
            twidth = 675;
            nametagLength = 20
        }
        let width = Math.max(600, twidth)
        if (chunks.length > 0) { // If there's no content, just draw the text
            width = padding.l + padding.r + (chunks[0].length * (itempadding.l + itemWidth + itempadding.r))
            tsize -= 5
        }
        width = Math.max(600, width)

        let posttextstuff = this.drawText(temptext, tsize, width - padding.l - padding.r)
        let textMetrics = posttextstuff[0]
        let PostText = posttextstuff[1]

        let graphics2 = new PIXI.Graphics()

        let roundness = 32

        let nametagstuff = this.buildTopBar(owner, graphics2, nametagLength, width)
        let profileText = nametagstuff[1]
        let nametagheight = nametagstuff[0]
        let contentHeight = padding.t + (chunks.length * (itempadding.t + itemWidth + itempadding.b)) + padding.b
        if (listofItems.length === 0) {
            contentHeight = padding.t
        }
        let mainAreaHeight = contentHeight + textMetrics.height + padding.b

        let bottomBarstuff = this.buildBottomBar(graphics2, width, nametagheight + mainAreaHeight)
        let heartcounters = bottomBarstuff[0]
        // Middle bar covering lower upper rounded corners
        graphics2.lineStyle(2, 0x222222, 1);
        graphics2.beginFill(0x333333);
        graphics2.drawRoundedRect(0, nametagheight, width, mainAreaHeight, 0);
        graphics2.endFill();
        let imgsprites = []
        for (let y in chunks) {
            for (let x in chunks[y]) {
                let imgSprite = new PIXI.Sprite()
                let imgGraphics = new PIXI.Graphics()
                imgSprite.addChild(imgGraphics)
                imgGraphics.lineStyle(2, 0x222222, 1);
                imgGraphics.beginFill(0x111111);
                let startx = padding.l + itempadding.l + (x * (itempadding.l + itemWidth + itempadding.r))
                let starty = nametagheight + padding.t + itempadding.t + (y * (itempadding.t + itemWidth + itempadding.b))
                imgSprite.position.x = startx
                imgSprite.position.y = starty
                imgGraphics.drawRoundedRect(0, 0, itemWidth, itemWidth, 0);
                this.loadImageID(chunks[y][x], imgSprite)
                imgGraphics.endFill();
                imgsprites.push(imgSprite)
            }
        }

        // Not sure why we're setting the alpha. Should already be 1
        graphics2.alpha = 1
        // Set post text position. Simple enough
        PostText.position.x = padding.l
        PostText.position.y = nametagheight + contentHeight
        this.DataComponent.ContainerSprite = new PIXI.Sprite();
        // There was a reason for seperating this graphics into a container. Not sure though.
        let contSprite = this.DataComponent.ContainerSprite
        contSprite.addChild(graphics)
        contSprite.interactive = true

        // Lists just make life a tad easier.
        let spritesToAdd = [
            graphics2,
            contSprite,
            profileText,
            heartcounters,
            PostText,
        ]
        for (let sprite in spritesToAdd)
            this.DataComponent.sprite.addChild(spritesToAdd[sprite])

        for (let sprite in imgsprites)
            this.DataComponent.sprite.addChild(imgsprites[sprite])

        this.setupClickHandlers(owner)
        if (!debugDisableUserContent)
            stage.addChild(this.DataComponent.sprite)
    }

    setupClickHandlers(owner) {
        this.DataComponent.sprite.interactive = true
        let amOwner = useremail === owner.email
        nlwinput.setupSpriteClickHandlers(this.DataComponent, amOwner)
        nlwinput.setupRightClickHandler(this.DataComponent, function (datacomp, event, pos) {
            popupmenumanager.resetCurrentmenuopts()
            popupmenumanager.startMenu(pos, "Menu")
            if (amOwner) {
                popupmenumanager.addPlainButton("Delete", "textStyle", function () {
                    console.log("DELYEET")
                    widgetManager.deleteClick(datacomp)
                }, 5, 2)
            } else {
                popupmenumanager.addPlainButton("Report", "textStyle", function () {
                    console.log("POST REPORTED")
                }, 5, 2)
            }
            let popupnum = popupmenumanager.endMenu()
            popupmenumanager.animatePopupIn(popupnum)
        })
    }

    setupHeartsAndCounters(dimens, bottomstart, DataComponent) {
        heartstyle.fontSize = fontsizes['bottombar']
        let likes = this.get("Likes")
        if (likes == null) {
            this.set("Likes", "")
            likes = ""
        }
        likes = likes.split(";")
        let dislikes = this.get("Dislikes")
        if (dislikes == null) {
            this.set("Dislikes", "")
            dislikes = ""
        }
        dislikes = dislikes.split(";")

        let bottomsprite = new PIXI.Sprite()
        let iLiked = likes.indexOf(useremail) >= 0
        let iDisliked = dislikes.indexOf(useremail) >= 0
        let RenderHeartText = new PIXI.Text((iLiked) ? "❤️" : "🤍", heartstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let heartMetrics = PIXI.TextMetrics.measureText((iLiked) ? "❤️" : "🤍", heartstyle)
        let HeartSprite = RenderTextToSprite(RenderHeartText)
        RenderHeartText = new PIXI.Text((iDisliked)? "💔": "🤍", heartstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        heartMetrics = PIXI.TextMetrics.measureText((iDisliked) ? "💔" : "🤍", heartstyle)
        let HeartSprite2 = RenderTextToSprite(RenderHeartText)

        let centerY = (dimens[1] - bottomstart) / 2
        let centerX = dimens[0] /2
        let gap = 0
        HeartSprite.position.x = centerX - heartMetrics.width - (gap/2)
        HeartSprite.position.y = centerY - (heartMetrics.height/2)


        HeartSprite2.pivot.x = heartMetrics.width
        HeartSprite2.pivot.y = heartMetrics.height
        HeartSprite2.rotation = Math.PI
        HeartSprite2.position.x = centerX + (gap / 2)
        HeartSprite2.position.y = centerY - (heartMetrics.height / 2)

        let likeCountChars = likes.length -1 + ""
        let likedCountStyle = heartstyle
        likedCountStyle.fontSize = fontsizes['bottombartext']
        let likeCountText = new PIXI.Text(likeCountChars, likedCountStyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let likeCountMetrics = PIXI.TextMetrics.measureText(likeCountChars, likedCountStyle)
        let likeCountSprite = RenderTextToSprite(likeCountText)

        likeCountSprite.position.x = centerX - likeCountMetrics.width - HeartSprite.width - (gap / 2)
        likeCountSprite.position.y = centerY - (likeCountMetrics.height / 2)

        let dislikeCountChars = dislikes.length -1 + ""
        let dislikedCountStyle = heartstyle
        dislikedCountStyle.fontSize = fontsizes['bottombartext']
        let dislikeCountText = new PIXI.Text(dislikeCountChars, dislikedCountStyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let dislikeCountMetrics = PIXI.TextMetrics.measureText(dislikeCountChars, dislikedCountStyle)
        let dislikeCountSprite = RenderTextToSprite(dislikeCountText)

        dislikeCountSprite.position.x = centerX + HeartSprite.width + (gap / 2)
        dislikeCountSprite.position.y = centerY - (dislikeCountMetrics.height / 2)

        HeartSprite.interactive = true
        HeartSprite2.interactive = true
        HeartSprite.buttonMode = true
        HeartSprite2.buttonMode = true
        HeartSprite.on("click", () => {
            if (!iLiked) {
                likes.push(useremail)
                this.set("Likes", likes.join(";"))
                dislikes = dislikes.filter(e => e !== useremail);
                this.set("Dislikes", dislikes.join(";"))
            } else {
                likes = likes.filter(e => e !== useremail);
                this.set("Likes", likes.join(";"))
            }
        })
        HeartSprite2.on("click", () => {
            if (!iDisliked) {
                dislikes.push(useremail)
                this.set("Dislikes", dislikes.join(";"))
                likes = likes.filter(e => e !== useremail);
                this.set("Likes", likes.join(";"))
            } else {
                dislikes = dislikes.filter(e => e !== useremail);
                this.set("Dislikes", dislikes.join(";"))
            }
        })
        bottomsprite.addChild(HeartSprite)
        bottomsprite.addChild(HeartSprite2)
        bottomsprite.addChild(likeCountSprite)
        bottomsprite.addChild(dislikeCountSprite)

        bottomsprite.position.y = bottomstart
        return bottomsprite
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

//# sourceURL=PostNLW.js