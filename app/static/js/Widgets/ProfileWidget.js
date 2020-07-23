var fontsizes = {
    'nametag': 40,
    'bio': 30,
    'timetag': 30,
    'bottombar': 50,
    'bottombartext': 30
}



class Profile {
    constructor() {

        this.ItemType = "Profile"
        this.ItemSubclass = ""
        this.ItemSubclassID = ""
        this.DataComponents = {}
        this.UsersProfile = 0

    }

    initDataStructure(DataComponent, initItem) {
        widgetManager.FillDataComponentsWithBaseData(initItem,DataComponent,new Vector(50,50))
        if (DataComponent.owneremail == useremail) {
            this.UsersProfile = DataComponent
        }

        DataComponent.type = this.ItemType
        DataComponent.zdepth = 10
        let fX = 1
        let fY = DataComponent.vecsize.y / DataComponent.vecsize.x
        DataComponent.drawtext = true
        DataComponent.hasMouseMovehandler = true
        this.setupGraphics(DataComponent)
        this.DataComponents[DataComponent.coordinateID] = DataComponent
        //this.loadpost(initItem.postid)

        let owner = peopleManager.getPerson(DataComponent.owneremail)
        owner.onImageChanged(function(Person,dataComponent) {
            removeAndDestroySprite(dataComponent.sprite)
            widgetManager.getWidget("Profile").setupGraphics(dataComponent)
        },DataComponent)
        owner.onDataChanged(function(Person,dataComponent) {
            removeAndDestroySprite(dataComponent.sprite)
            widgetManager.getWidget("Profile").setupGraphics(dataComponent)
        },DataComponent)
    }

    UpdateCreate(DataComponent,updateItem) {
        console.log("Created")
        socket.emit('RequestingObjectWithCoordID',{CoordinateID: updateItem.Coordinateid});
    }

    buildTopBar(owner, graphics, nametagLength, totalwidth) {
        var profilenametagStyle = new PIXI.TextStyle({
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

        var profileemailtagstyle = new PIXI.TextStyle({
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
        let amOwner = useremail === owner.email
        let profileTextSprite = new PIXI.Sprite()
        let nameTagMetrics = PIXI.TextMetrics.measureText('...', profilenametagStyle)
        let nameTagSprite = RenderTextToSprite(new PIXI.Text('...', profilenametagStyle))
        profileTextSprite.addChild(nameTagSprite)
        let emailText = owner.email;
        let emailTagMetrics = PIXI.TextMetrics.measureText(emailText, profileemailtagstyle)
        let emailTagSprite = RenderTextToSprite(new PIXI.Text(emailText, profileemailtagstyle))
        let profileImageSprite = new PIXI.Sprite()
        let profileImageHolder = new PIXI.Sprite()
        profileImageSprite.addChild(profileImageHolder)
        let profileImageSize = 600
        owner.onDataChanged(function (Person, Datacomponent) {
                let RenderText = new PIXI.Text(Person.getShortenedName(nametagLength)[0], profilenametagStyle);
                let TextSprite = RenderTextToSprite(RenderText)
                removeAndDestroySprite(nameTagSprite)
                profileTextSprite.addChild(TextSprite)
            }
            , this.DataComponent
        )
        owner.onImageChanged(function (Person, Datacomponent) {
                removeAndDestroySprite(profileImageHolder)
                profileImageHolder = resizeImageSprite(Person.profileimage, profileImageSize, profileImageSize)
                profileImageSprite.addChild(profileImageHolder)
            }
            , this.DataComponent
        )
        let profilePadding = {"l": 0.7 * 50, "t": 0.6 * 50, "r": 0.8 * 50, "b": 0.6 * 50}
        let padding = {"l": 0.75 * 50, "t": 0.75 * 50, "r": 0.9 * 50, "b": 0.9 * 50}
        let roundness = 50
        let toppad = 10
        let timtaggap = 0.1 * 50
        let leftgap = 0*  0.3 * 50
        let nametagheight = toppad + profilePadding.t + nameTagMetrics.height + timtaggap + profilePadding.t + emailTagMetrics.height
        profileTextSprite.position.x = profilePadding.l + profilePadding.r + profileImageSize
        profileTextSprite.position.y = toppad + profilePadding.t // - nameTagMetrics.height

        emailTagSprite.position.x = leftgap + profilePadding.l + profilePadding.r + profileImageSize
        emailTagSprite.position.y = toppad + profilePadding.t + nameTagMetrics.height + timtaggap
        // Header bkg
        let linewidth = 0//(amOwner) ? 2 : 0
        graphics.lineStyle(0, 0xa95c1b, 1, 1, true);
        graphics.beginFill(
            (amOwner) ? headerBarColors.blue :
                // (isEmailInFriendList(owner.email)) ?
                //     headerBarColors.orange :
                    headerBarColors.grey);
        graphics.drawRoundedRect(-linewidth, -linewidth, totalwidth + (2 * linewidth), nametagheight + roundness + (2 * linewidth), roundness);
        graphics.endFill();
        let tmpSprite = new PIXI.Sprite()
        tmpSprite.addChild(profileImageSprite)
        tmpSprite.addChild(profileTextSprite)
        tmpSprite.addChild(emailTagSprite)
        let profilePopUpDist = 100
        profileImageSprite.position.x = profilePadding.l
        profileImageSprite.position.y = - profilePopUpDist
        let linecol = 0x252525
        // graphics.lineStyle(0, linecol, 1, 0.5, false);
        // graphics.beginFill(linecol);
        // graphics.drawRoundedRect(profilePadding.l - 5, -profilePopUpDist - 5, profileImageSize+10, profileImageSize+10, 20);
        // graphics.endFill();
        let imageBottom = -profilePopUpDist + profileImageSize
        return [nametagheight, tmpSprite, imageBottom, profileImageSize]
    }

    drawText(Text, textsize, width) {
        let tsize = textsize
        textstyle.fontSize = tsize
        textstyle.wordWrapWidth = width
        let RenderText = new PIXI.Text(Text, textstyle);
        let textMetrics = PIXI.TextMetrics.measureText(Text, textstyle)
        let PostText = RenderTextToSprite(RenderText)
        return [textMetrics, PostText]
    }

    buildBottomBar(graphics, fillcol, width, startHeight, bottombarheight) {
        let roundness = 50
        // Dark bottom bar
        graphics.lineStyle(0, 0x222222, 0);
        graphics.beginFill(fillcol);
        graphics.drawRoundedRect(0, startHeight - roundness, width, roundness + bottombarheight, roundness);
        graphics.endFill();
        return []
    }

    drawFollowCountAndButton(owner, imagesize, padding, imageBottom) {
        let friendbtn = new PIXI.Sprite()
        friendbtn.addChild(owner.friendBtn.sprite)
        let imgCenter = padding.l + (imagesize / 2)
        let gap = 0.15 * 50
        let leftweight = 1 * 50
        friendbtn.position.x = -leftweight + gap + imgCenter + (friendbtn.width / 2)
        friendbtn.position.y = imageBottom + (0.5 * 50)


        var friendCountStyle = new PIXI.TextStyle({
            //font:"35px Verdana",
            fontFamily: BodyFont,
            fontSize: fontsizes['timetag'],
            fontWeight: 'bold',
            fill: '#ffffff',
            fillGradientType: 2,
            stroke: '#575757',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 500,
            breakWords: true,
            align: 'Justified'
        })
        let friendCountText = owner.friendCount + "👥";
        let friendCountMetrics = PIXI.TextMetrics.measureText(friendCountText, friendCountStyle)
        let friendCountSprite = RenderTextToSprite(new PIXI.Text(friendCountText, friendCountStyle))

        friendCountSprite.position.x = -leftweight + imgCenter - (friendCountMetrics.width) - gap
        friendCountSprite.position.y = imageBottom + (0.7 * 50)
        return [friendbtn, friendCountSprite]
    }

    setupGraphics(DataComponent) {
        let owner = peopleManager.getPerson(DataComponent.owneremail)
        DataComponent.sprite = new PIXI.Sprite();
        let graphics = new PIXI.Graphics()
        let tsize = 10//getScaleText(DataComponent.text)
        let nametagLength = 25
        let width = 1300

        let padding = {"l": 0.7 * 50, "t": 0.6 * 50, "r": 0.8 * 50, "b": 0.6 * 50}


        let nametagstuff = this.buildTopBar(owner, graphics, nametagLength, width)
        let topBarSprite = nametagstuff[1]
        let nametagheight = nametagstuff[0]
        let imageBottom = nametagstuff[2]
        let imagesize = nametagstuff[3]

        let posttextstuff = this.drawText("dfghdfgdfgdf", tsize, width - padding.l - padding.r)
        let textMetrics = posttextstuff[0]
        let PostText = posttextstuff[1]


        // let mainAreaHeight = (imageBottom - nametagheight) + padding.b + bottomareaheight
        let midareaStop = (imageBottom - nametagheight)
        let bkgcol = 0x252525
        graphics.lineStyle(2, 0x222222, 1);
        graphics.beginFill(bkgcol);
        graphics.drawRoundedRect(0, nametagheight, width, midareaStop, 0);
        graphics.endFill();

        let followcountstuff = this.drawFollowCountAndButton(owner, imagesize, padding, imageBottom)
        let friendbtn = followcountstuff[0]
        let friendCountSprite = followcountstuff[1]

        var bioStyle = new PIXI.TextStyle({
            //font:"35px Verdana",
            fontFamily: BodyFont,
            fontSize: 25,
            fontWeight: 'normal',
            fill: '#b0b0b0',
            fillGradientType: 2,
            stroke: '#575757',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: width - (imagesize + (padding.l)) - (2*padding.r),
            breakWords: true,
            align: 'Justified'
        })
        let bioText = owner.bio
        // let bioText = ". Sit amet aliquam id diam maecenas ultricies mi eget. Volutpat commodo sed egestas  amet aliquam id diam maecenas ultricies mi eget. Volutpat commodo sed egestas egestas amet aliquam id diam maecenas ultricies mi eget. Volutpat commodo sed egestas egestas amet aliquam id diam maecenas ultricies mi eget. Volutpat commodo sed egestas egestas amet aliquam id diam maecenas ultricies mi eget. Volutpat commodo sed egestas egestas amet aliquam id diam maecenas ultricies mi eget. Volutpat commodo sed egestas egestasegestas fringilla. Mauris ultrices eros in cursus turpis. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Fringilla phasellus faucibus scelerisque eleifend. Venenatis a condimentum vitae sapien pellentesque habitant. Quis blandit turpis cursus in hac. Tortor pretium viverra suspendisse potenti. Platea dictumst quisque sagittis purus sit amet volutpat consequat. Libero nunc consequat interdum varius sit. Nibh ipsum consequat nisl vel pretium lectus quam. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt."
        let bioMetrics = PIXI.TextMetrics.measureText(bioText, bioStyle)
        let bioSprite = RenderTextToSprite(new PIXI.Text(bioText, bioStyle))

        bioSprite.position.x = imagesize + (padding.l) + (padding.r)
        bioSprite.position.y = nametagheight + padding.t
        let biotextBottom = nametagheight + padding.t + bioMetrics.height + padding.b
        if (imageBottom > biotextBottom) {
            let bottomareaheight = (0.5 * 50) + owner.friendBtn.height + padding.b
            let bottomBarstuff = this.buildBottomBar(graphics, bkgcol, width, imageBottom, bottomareaheight)
        } else {
            let bottomareaheight = (biotextBottom) - imageBottom
            let diff = Math.max((0.5 * 50) + owner.friendBtn.height + padding.b, bottomareaheight)
            let bottomBarstuff = this.buildBottomBar(graphics, bkgcol, width, imageBottom, diff)
        }

        DataComponent.sprite.addChild(graphics)
        DataComponent.sprite.addChild(topBarSprite)
        DataComponent.sprite.addChild(bioSprite)
        DataComponent.sprite.addChild(friendbtn)
        DataComponent.sprite.addChild(friendCountSprite)
        let amOwner = useremail === owner.email
        //nlwinput.setupSpriteClickHandlers(DataComponent, amOwner)
        DataComponent.sprite.interactive = true

        nlwinput.setupRightClickHandler(DataComponent, function (datacomp, event, pos) {
            popupmenumanager.resetCurrentmenuopts()
            popupmenumanager.startMenu(pos, "Menu")
            if (amOwner) {
                popupmenumanager.addPlainButton("Edit profile", "textStyle", function () {
                    let html = `
                            <script>
                            
                            </script>
                            <div id="mymodal" class="modal fade" tabindex="-1" role="dialog">
                              <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                                <div class="modal-content bg-dark text-light">
                                   <!--<div class="modal-header">
                                     <h5 class="modal-title">${owner.name}</h5>
                                   </div>-->
                                  <div class="modal-body">
                                    <div class="bg-dark text-light justify-content-md-center" style="width:100%">
                                      <div class="d-flex flex-wrap justify-content-md-center" style="text-align:justify">
                                          <div  class="m-3">
                                              <div id="cover-drop-zonecover"style="height:100%">
                                                  <img id="cover-drop-zone" class="image-drop-zone" type="file" src="/getimageid-${owner.profileimageid}"
                                                    style="width:100%;max-width:20vh"class="img-circle" alt="Just drag a picture here and it automatically becomes the face of {{ user.name }}">
                                              </div>
                                                  <h5 style="display:block">
                                                  <label>&nbsp &nbsp &nbsp </label></h5>
                                          </div>
                                          <div class=" m-3">
                                                <span id="profileName" contenteditable="true" type="text" class="modal-title bg-dark text-light border-0" style="font-size: 18px" value="">${owner.name}</span>
                                                <p class="lead"><b style="
                                                    background: linear-gradient(-15deg, #f16581, orange);
                                                    background-clip: text;
                                                    -webkit-background-clip: text;
                                                    -webkit-text-fill-color: transparent;">${owner.email}</b></p> 
                                                <span id="profileBio" contenteditable="true" class="form-control bg-dark text-light border-0 mb-3">${owner.bio}</span>
                                                <div id="fileselectorwrapper" class="btn btn-sm btn-outline-secondary" style="position: relative;overflow: hidden;direction: ltr;">
                                                    <div>Select New Profile Image</div>
                                                <input id="btnNewDP" style="position: absolute;right: 0px;top: 0px;font-family: Arial;font-size: 118px;margin: 0px;padding: 0px;cursor: pointer;opacity: 0;height: 100%;" class="btn btn-outline-light" type="file"/>
                                                </div>
                                                <button  onclick="acceptClick()" id="btnAccept" class="hidden ml-1 mt-1 btn btn-sm btn-outline-primary">
                                                    Accept
                                                </button>
                                                <button  onclick="rotateClick()" id="btnRotate" class="hidden ml-1 mt-1 btn btn-sm btn-outline-light">
                                                    Rotate
                                                </button>
                                                <button  onclick="cancelClick()" id="btnCancel" class="hidden ml-1 mt-1 btn btn-sm btn-outline-warning">
                                                    Cancel
                                                </button>
                                          </div>
                                      </div>
                                        </div>
                                    <div class="w-100 mt-2 d-flex justify-content-end">
                                    <button type="button" onclick="profileSaveClick()" class="ml-2 btn btn-outline-success" style="border-radius: 5rem">
                                        Save <i class="fas fa-save"></i>
                                    </button>
                                    <button type="button" onclick="$('#mymodal').modal('hide')" class="ml-2 btn btn-outline-primary" style="border-radius: 5rem">
                                        <i class="fas fa-undo"></i>
                                    </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <script>
                            $('#mymodal').modal()
                            $('#mymodal').on('hide.bs.modal', function (e) {
                                $('#JSLoadHere').empty()
                            })
                            function profileSaveClick() {
                                let newbio = $('#profileBio').html()
                                let newname = $('#profileName').html()
                                $.post("/profile-0",{
                                        update: true,
                                        updateBio:newbio,
                                        updateName: newname
                                    }).done(function(fromserver) {
                                        $('#mymodal').modal('hide')
                                        window.location.reload()
                                    }).fail(function() {
                                        alert("Something went wrong. Please try again")
                                    })
                            }
                        
                            function acceptClick() {
                                opts = {
                                    type : 'base64',
                                    size : 'original',
                                    format : 'jpeg',
                                    quality : '1',
                                    circle : false
                                }
                                img = croppieimage.result(opts).then(function(blob) {
                                    cancelClick()
                                    $('#cover-drop-zone').attr("src",blob)
                                    $.post("/updateprofileimage",{
                                        file: blob,
                                        moredata:'data'
                                    }).done(function(fromserver) {
                                    }).fail(function() {
                                    })
                                })
                            }
                        
                            function rotateClick() {
                                if (croppieimage === '') {
                        
                                } else {
                                        croppieimage.rotate('270')
                                }
                            }
                        
                            function cancelClick() {
                                $('#btnAccept').addClass("hidden")
                                $('#btnCancel').addClass("hidden")
                                $('#btnRotate').addClass("hidden")
                                $('#fileselectorwrapper').removeClass("hidden")
                                croppieimage.destroy()
                                $("#cover-drop-zonecover").empty()
                                $("#cover-drop-zonecover").append(old)
                                croppieimage = ''
                                delete croppieimage
                                setDropZoneListeners()
                            }
                        
                            
                        
                            function changeProfileClick() {
                                if (typeof (FileReader) != "undefined") {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        activateCroppie(e,'cover-drop-zone',croppieinit)
                                    }
                        
                                    reader.readAsDataURL($('#btnNewDP')[0].files[0]);
                                } else {
                                    alert("This browser does not support FileReader.");
                                }
                            }
                        
                            var croppieimage = '';
                            var old;
                        
                            function croppieinit() {
                                $('#btnAccept').removeClass("hidden")
                                $('#btnRotate').removeClass("hidden")
                                $('#btnCancel').removeClass("hidden")
                                $('#fileselectorwrapper').addClass("hidden")
                            }
                        
                            function activateCroppie(e2,itemid,thendothis) {
                                if (croppieimage === '') {
                        
                                } else {
                                    cancelClick()
                                }
                                opts = {
                                    showZoomer: true,
                                    enableOrientation: true,
                                    enableZoom: true,
                                    customClass: 'croppitcustom'
                                }
                                old = $('#' + itemid).clone()
                                $('#' + itemid).attr("src",e2.target.result)
                                croppieimage = new Croppie(document.getElementById('cover-drop-zone'), opts);
                                thendothis()
                            }
                        
                            function processFiles(files) {
                                for (var i=0, file; file=files[i]; i++) {
                                    if (file.type.match(/image.*/)) {
                                        var reader = new FileReader();
                        
                                        reader.onload = function(e2) {
                                            // finished reading file data.
                                            activateCroppie(e2,'cover-drop-zone',croppieinit)
                                        }
                                        reader.readAsDataURL(file); // start reading the file data.
                                    }
                                }
                            }
                            function setDropZoneListeners() {
                                var dropzone = $('#cover-drop-zone');
                        
                                dropzone.on('dragover', function() {
                                    //add hover class when drag over
                                    dropzone.addClass('hover');
                                    return false;
                                });
                        
                                dropzone.on('dragleave', function() {
                                    //remove hover class when drag out
                                    dropzone.removeClass('hover');
                                    return false;
                                });
                        
                                dropzone.on('drop', function(e) {
                                    //prevent browser from open the file when drop off
                                    e.stopPropagation();
                                    e.preventDefault();
                                    dropzone.removeClass('hover');
                        
                                    //retrieve uploaded files data
                                    var files = e.originalEvent.dataTransfer.files;
                                    processFiles(files);
                        
                                    return false;
                                });
                            }
                            setDropZoneListeners()
                            $("#btnNewDP").on('change',changeProfileClick)
                            </script>
                        `
                    replacePlaceholderWithHtml(html, '#JSLoadHere')
                }, 5, 2)
            } else {
                popupmenumanager.addPlainButton("Report", "textStyle", function () {
                    console.log("Profile REPORTED")
                }, 5, 2)
            }
            let popupnum = popupmenumanager.endMenu()
            popupmenumanager.animatePopupIn(popupnum)
        })


        if (!debugDisableUserContent)
            stage.addChild(DataComponent.sprite)

         //widgetManager.setupDataComponentReportButton(DataComponent, height + (70), height - 20)
         if (false && DataComponent.owneremail == useremail) {
             widgetManager.setupDataComponentMoveButton(DataComponent, -0.9 * 50, 0.75 * 50,
                 function(DataComponent) {
                     DataComponent.dragdata.isdragging = !DataComponent.dragdata.isdragging
                     if (!DataComponent.dragdata.isdragging) {
                         widgetManager.getWidget("Profile").broadcastChange(DataComponent)
                         DataComponent.sprite.alpha = 1
                     } else {
                         DataComponent.sprite.alpha = 0.7
                     }
                    DataComponent.dirty = true
                    return true
                 }
             )
         }
    }

    UpdatePosition(DataComponent,updateItem) {
        console.log("Updated position")
        widgetManager.animateDataComponentTo(DataComponent,[updateItem.posx,updateItem.posy])
    }



    UpdateCreate(DataComponent,updateItem) {
        console.log("Created")
        // After we've sent the create data to the server, instead of manually adding the new object, we
        //  Tell the server to send us a Loader update with the new object so it can be added as if
        //  it was part of the initial data package
        socket.emit('RequestingObjectWithCoordID',{CoordinateID: updateItem.Coordinateid});
    }

    UpdateDelete(DataComponent,updateItem) {
        let centre = getCenter(DataComponent.vecposition,DataComponent.vecsize)
        //AddRipple({
        //    "color":color(255,80,80),
        //    "duration":3000,
        //    "maxRadius":50,
        //    "maxTransparency":200,
        //    "position": centre,
        //    "maxthickness":5,
        //    "CoordsRelative":true
        //})
        delete widgetManager.getWidget(this.ItemType).DataComponents[DataComponent.coordinateID]
    }

    UpdateOther(DataComponent,updateItem) {
        console.log("Other kind of update")
    }

    broadcastChange(DataComponent) {
        $.post("/setposition",{
			objecttype: "Profile",
			objectid:DataComponent.owneremail,
			posx:DataComponent.vecposition.x,
			posy:DataComponent.vecposition.y,
			sizex:DataComponent.vecsize.x,
			sizey:DataComponent.vecsize.y
		}).done(function(fromserver) {
			dissuccess("You've found a new home!")
		}).fail(function() {
		    diserror("Woah okay we can't find the internet. Try drag it around a little bit again.")
		})
    }

    setupSocketCallbacks() {
    }

    onMouseMoveOutside(DataComponent,vecRelativeClickPos,actualcoords) {
        animProfileLineOut(DataComponent)
        //invalidate()
    }

    onMouseMove(DataComponent,vecRelativeClickPos,actualcoords) {
        animProfileLineIn(DataComponent)
        //invalidate()
    }

    onClickDown(dataComponent,vecRelativeClickPos,actualcoords) {
        if (IsWithinViewingRectangle(dataComponent,unitsize)) {
            if (ispointinrect(vecRelativeClickPos, new Vector(0,0), new Vector(1,1))) {
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
        let newvecposition = ScreenCoordToPlaneCoord(DataComponent.vecposition)
        let fX = ScreenSizeToPlaneSize(DataComponent.vecsize).x / 100
        let fY = ScreenSizeToPlaneSize(DataComponent.vecsize).y / 100
        let scale = unitsize / 50
        DataComponent.sprite.position.x = newvecposition.x
        DataComponent.sprite.position.y = newvecposition.y
        DataComponent.sprite.scale.x = scale
        DataComponent.sprite.scale.y = scale

    }
}



//# sourceURL=ProfileWidget.js