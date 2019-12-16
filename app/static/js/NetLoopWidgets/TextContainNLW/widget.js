
class TextContainerNLW extends NetComponent {

    constructor(instanceIdentity, DataComp) {
        super()
        this.instanceType = "TextContainerWidget"
        this.instanceID = instanceIdentity
        this.DataComponent = DataComp
    }

    onCreate() {
        this.setupSprite2()
    }

    setupSprite2() {
        removeAndDestroySprite(this.DataComponent.sprite)
        this.DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let tsize = getScaleText(this.get("Text"))
        let owner = peopleManager.getPerson(this.get("OwnerEmail"))

        let twidth = 800;
        let nametagLength = 30
        if (tsize > 30) {
            twidth = 600;
            nametagLength = 20
        }

        let textstyle = new PIXI.TextStyle({
            //font:"35px Verdana",
            fontFamily: BodyFont,
            fontSize: tsize,
            fontWeight: 'normal',
            fill: '#bfbfbf',
            fillGradientType: 2,
            stroke: '#d8d8d8',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: twidth,
            breakWords: true,
            align: 'left'
        })
        let RenderText = new PIXI.Text(this.get("Text"), textstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let textMetrics = PIXI.TextMetrics.measureText(this.get("Text"), textstyle)
        let TextSprite = RenderTextToSprite(RenderText)
        let width = Math.max(600, textMetrics.width)
        let mainTextHeight = textMetrics.height

        let profileTextSprite = new PIXI.Sprite()

        let fontsizes = {
            'nametag': 40,
            'timetag': 30,
            'bottombar':50,
            'bottombartext': 30
        }

        let nametagStyle = new PIXI.TextStyle({
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
        let RenderText2 = new PIXI.Text('...', nametagStyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let textMetrics2 = PIXI.TextMetrics.measureText('...', nametagStyle)
        let nameTagSprite = RenderTextToSprite(RenderText2)
        profileTextSprite.addChild(nameTagSprite)

        let timetagstyle = new PIXI.TextStyle({
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
        let timetext = moment(this.get('CreateDate')).fromNow();
        let timeTagRT = new PIXI.Text(timetext, timetagstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let timeTagMetrics = PIXI.TextMetrics.measureText(timetext, timetagstyle)
        let timeTagSprite = RenderTextToSprite(timeTagRT)

        let profileImageSprite = new PIXI.Sprite()
        let profileImageHolder = new PIXI.Sprite()
        profileImageSprite.addChild(profileImageHolder)

        owner.onDataChanged(function (Person, Datacomponent) {
                let RenderText = new PIXI.Text(Person.getShortenedName(nametagLength)[0], nametagStyle);
                //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
                let textMetrics = PIXI.TextMetrics.measureText(Person.getShortenedName(nametagLength)[0], nametagStyle)
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


        let graphics2 = new PIXI.Graphics()
        let padding = {
            "l": 0.75 * 50,
            "t": 0.75 * 50,
            "r": 0.75 * 50,
            "b": 0.9 * 50
        }
        let profilePadding = {
            "l": 0.6 * 50,
            "t": 0.6 * 50,
            "r": 0.3 * 50,
            "b": 0.6 * 50
        }
        let nametagheight = profilePadding.t + profilePadding.b + profileImagesize
        let bottombarheight = 100

        let roundness = 32
        let toppad = 10
        profileTextSprite.position.x = profilePadding.l + profilePadding.r + profileImagesize
        profileTextSprite.position.y = toppad + profilePadding.t + (profileImagesize / 2) - textMetrics2.height
        let timtaggap = 0.3 * 50
        timeTagSprite.position.x = profilePadding.l + profilePadding.r + profileImagesize
        timeTagSprite.position.y = toppad + profilePadding.t + (profileImagesize / 2) - textMetrics2.height + timeTagMetrics.height + timtaggap
        let amOwner = useremail === owner.email
        // Header bkg
        graphics2.lineStyle(0, 0x222222, 0);
        graphics2.beginFill(
            (amOwner) ? headerBarColors.blue :
                (isEmailInFriendList(owner.email)) ?
                    headerBarColors.orange : headerBarColors.grey);

        graphics2.drawRoundedRect(0, 0, width + padding.l + padding.r, nametagheight + bottombarheight + mainTextHeight + padding.t + padding.b, roundness);
        graphics2.endFill();

        // Dark bottom bar
        graphics2.lineStyle(0, 0x222222, 0);
        graphics2.beginFill(0x252525);
        graphics2.drawRoundedRect(0, nametagheight, width + padding.l + padding.r, bottombarheight + mainTextHeight + padding.t + padding.b, roundness);
        graphics2.endFill();

        // Middle bar covering lower upper rounded corners
        graphics2.lineStyle(2, 0x222222, 1);
        graphics2.beginFill(0x333333);
        graphics2.drawRoundedRect(0, nametagheight, width + padding.l + padding.r, mainTextHeight + padding.t + padding.b, 0);
        graphics2.endFill();

        graphics2.alpha = 1

        TextSprite.position.x = padding.l
        TextSprite.position.y = nametagheight + padding.t
        this.DataComponent.ContainerSprite = new PIXI.Sprite();




        // Mask doesn't work with this version of PIXI
        //profileImageSprite.mask = owner.profileimageroundedoutline
        profileImageSprite.position.x = profilePadding.l
        profileImageSprite.position.y = profilePadding.t

        let contSprite = this.DataComponent.ContainerSprite
        contSprite.addChild(graphics)
        contSprite.interactive = true

        let dataComponent = this.DataComponent

        //graphics2.filters = [Bloomfilter]
        this.DataComponent.sprite.addChild(graphics2)
        this.DataComponent.sprite.addChild(contSprite)
        this.DataComponent.sprite.addChild(profileImageSprite)
        this.DataComponent.sprite.addChild(profileTextSprite)
        this.DataComponent.sprite.addChild(timeTagSprite)
        this.DataComponent.sprite.addChild(TextSprite)
        this.setupHeartsAndCounters(
            [width + padding.l + padding.r, bottombarheight + nametagheight + mainTextHeight + padding.t + padding.b],
            nametagheight + mainTextHeight + padding.t + padding.b,
            this.DataComponent,
            fontsizes
        )

        this.DataComponent.sprite.interactive = true
        let datacomp = this.DataComponent

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
        //DataComponent.sprite.cacheAsCanvas = true
        if (!debugDisableUserContent)
            stage.addChild(this.DataComponent.sprite)
        // if (this.keyExists("OwnerEmail")) {
        //     this.DataComponent.owneremail = this.get("OwnerEmail")
        //     this.DataComponent.paddings["ProfilePosition"] = new Vector(-50,-70)
        //     widgetManager.setupDataComponentProfileDraw(this.DataComponent)
        // }
        dataComponent.profileDisplay[0].alpha = 0
        dataComponent.profileDisplay[1].alpha = 0
    }

    setupHeartsAndCounters(dimens, bottomstart, DataComponent, fontsizes) {
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
        let heartchars = "🤍"
        let iLiked = likes.indexOf(useremail) >= 0
        let iDisliked = dislikes.indexOf(useremail) >= 0
        if (iLiked) {
            heartchars = "❤️"
        }
        let heartstyle = new PIXI.TextStyle({
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
        let RenderHeartText = new PIXI.Text(heartchars, heartstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let heartMetrics = PIXI.TextMetrics.measureText(heartchars, heartstyle)
        let HeartSprite = RenderTextToSprite(RenderHeartText)
        heartchars = "🤍"
        if (iDisliked) {
            heartchars = "💔"
        }
        RenderHeartText = new PIXI.Text(heartchars, heartstyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        heartMetrics = PIXI.TextMetrics.measureText(heartchars, heartstyle)
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

        let likeCountChars = likes.length + ""
        let likedCountStyle = new PIXI.TextStyle({
            //font:"35px Verdana",
            fontFamily: BodyFont,
            fontSize: fontsizes['bottombartext'],
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
        let likeCountText = new PIXI.Text(likeCountChars, likedCountStyle);
        //let RenderText = new PIXI.extras.BitmapText(DataComponent.text, { font: '35px Verdana', align: 'Left' })
        let likeCountMetrics = PIXI.TextMetrics.measureText(likeCountChars, likedCountStyle)
        let likeCountSprite = RenderTextToSprite(likeCountText)

        likeCountSprite.position.x = centerX - likeCountMetrics.width - HeartSprite.width - (gap / 2)
        likeCountSprite.position.y = centerY - (likeCountMetrics.height / 2)

        let dislikeCountChars = dislikes.length + ""
        let dislikedCountStyle = new PIXI.TextStyle({
            //font:"35px Verdana",
            fontFamily: BodyFont,
            fontSize: fontsizes['bottombartext'],
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
        DataComponent.sprite.addChild(bottomsprite)
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

//# sourceURL=TextContainerNLW.js