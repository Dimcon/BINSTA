
var nametagsize = [8,1.2]

var profileImagesize = 100
var profileImageRoundness = 10

function resizeImageSprite(texture, width, height) {
    let loadedimage = new PIXI.Sprite(texture)
    let imgscale = 1
    if (loadedimage.width > loadedimage.height) {
        imgscale = (width) / loadedimage.width
    } else {
        imgscale = (height) / loadedimage.height
    }
    loadedimage.scale.x = (imgscale)
    loadedimage.scale.y = (imgscale)
    return loadedimage
}
class PeopleManager {
    constructor() {
        this.people = {}
    }

    setupSocketCallbacks() {
        socket.on('LoadPersonData', function(fromserver) {
            let bruce = peopleManager.getPerson(fromserver.email)
            bruce.name = fromserver.name
            bruce.bio = fromserver.bio
            let NewImage = false
            if (bruce.profileimageid != fromserver.profileimageid) {
                NewImage = true
            }
            bruce.profileimageid = fromserver.profileimageid
            bruce.idnum = fromserver.idnum
            bruce.ready = true
            bruce.hasdatachanged = true
            bruce.friendCount = fromserver.friendCount
            bruce.isFriends = fromserver.isFriend
            if (NewImage) {
                peopleManager.getPersonImage(bruce)
            }
            for (let counter = 0; counter < bruce.onChangeDataCallbacks.length;counter += 1) {
                bruce.onChangeDataCallbacks[counter][0](bruce,bruce.onChangeDataCallbacks[counter][1])
            }
            completedSomeLoad()
        });
    }

    getPersonImage(bruce) {
        if (bruce.profileimageid > 0) {
            bruce.loader = new PIXI.loaders.Loader();
                    var loaderOptions = {
                        loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
                        xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BLOB
                    };
                    bruce.loader.bruce = bruce
                    bruce.loader
                        .add('Img', "/getimageid-" + bruce.profileimageid,loaderOptions)
                        .on('load',function (loader,resource) {
                            let bruce = loader.bruce
                            resource.texture.mipmap = true
                            let sprite = new PIXI.Sprite(resource.texture)
                            let loadedimage = sprite
                            bruce.profileimage = resource.texture
                            //let img = image
                            //img.mask(circlemask)
                            bruce.imageready = true
                            bruce.hasdatachanged = true

                            for (var i = bruce.profileimagesprite.children.length - 1; i >= 0; i--) {
                                removeAndDestroySprite(bruce.profileimagesprite.children[i])
                            }

                            let newsprite = new PIXI.Sprite(bruce.profileimage)
                            let newloadedimage = newsprite
                            //dataComponent.image = sprite
                            let tmpscale = 50
                            let fX = 1
                            let fY = 1
                            let imgscale = 1
                            if (newloadedimage.width > newloadedimage.height) {
                                imgscale = (profileImagesize * fX) / newloadedimage.width
                            } else {
                                imgscale = (profileImagesize * fY) / newloadedimage.height
                            }
                            newloadedimage.scale.x = (imgscale)
                            newloadedimage.scale.y = (imgscale)
                            bruce.profileimagesprite.addChild(newloadedimage)

                            // Draw a small green square to indicate what is a profile iamge
                            // let graphics2 = new PIXI.Graphics()
                            // graphics2.lineStyle(0, 0x222222, 0);
                            // graphics2.beginFill(0x45ff45);
                            // graphics2.drawRoundedRect(-20, 0, 10, 10, 10);
                            // graphics2.endFill();
                            // bruce.profileimagesprite.addChild(graphics2)

                            bruce.generateFriendButtonGraphic()
                            for (let method in bruce.onChangeSpriteCallbacks) {
                                bruce.onChangeSpriteCallbacks[method][0](bruce,bruce.onChangeSpriteCallbacks[method][1])
                            }
                            completedSomeLoad()
                        });
            bruce.loader.load()
        }
    }

    loadPerson(bruce) {
            bruce.ready = false
            bruce.imageready = false
            socket.emit('LoadPerson', {data: "TestData21", email: bruce.email});
    }

    updateDetails(emailaddr) {
        for (let p in this.people) {
            if (this.people[p].email === emailaddr) {
                this.loadPerson(this.people[p])
            }
        }
    }

    MakeNewPerson(email) {
        let p = new person(email)
        this.people[email] = p
        return this.people[email]
    }

    getPerson(email) {
        if (email in this.people) {
            return this.people[email]
        } else {
            return this.MakeNewPerson(email)
        }
    }


    draw() {
        //this.drawUsers()
    }

    drawUsers() {
        let scale = unitsize / 50
        userCircleMask.scale.x = scale
        userCircleMask.scale.y = scale
        for(let email in this.people) {
            if (this.people[email].IsInRangeTimer > 0) {
                let bob = this.people[email]
                let newvecposition = ScreenCoordToPlaneCoord(new Vector(bob.MapPosition[0],bob.MapPosition[1]))

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

}

class person {
        constructor(email) {
            this.ready = false
            this.imageready = false
            this.onChangeSpriteCallbacks = []
            this.onChangeDataCallbacks = []
            this.email = email
            this.name = "..."
            this.bio = "..."
            this.profileimageid = 0
            this.profileimagesprite = new PIXI.Sprite()

            let graphic = new PIXI.Graphics()
            graphic.lineStyle(0, 0x222222, 0);
            graphic.beginFill(0xffffff);
            graphic.drawRoundedRect(0, 0, profileImagesize, profileImagesize, profileImageRoundness);
            graphic.endFill();
            let mask = new PIXI.Sprite(graphic.generateTexture());
            this.profileimageroundedoutlinemask = mask

            this.idnum = "..."
            this.callbacks = []
            this.hasdatachanged = true
            this.MapPosition = []
            this.zoomlevel = 30
            this.IsInRangeTimer = 0
            this.profileAnimationValue = 0
            this.Animating = false
            this.friendCount = 0
            this.isFriends = false
            this.friendbtnsprite = new PIXI.Sprite()
            this.friendBtn = {
                width:0,
                height:0,
                sprite: new PIXI.Sprite()
            }
            peopleManager.loadPerson(this)
        }

        getShortenedName(length) {
            let shortname = this.name.substring(0, length)
            let shortened = false
            if (shortname !== this.name) {
                shortened = true;
                shortname += ".."
            }
            return [shortname, shortened]
        }

        generateFriendButtonGraphic() {
            let friendbtnsprite = new PIXI.Sprite()
            let friendbtngraphics = new PIXI.Graphics()
            let textstyle = ""
            let text1 = ""
            if (this.isFriends) {
                textstyle = new PIXI.TextStyle({
                    fontFamily: BodyFont,
                    fontSize: 28,
                    fontWeight: 'normal',
                    fill: ['#777777'],
                    fillGradientType: 2,
                    stroke: '#777777',
                    strokeThickness: 0,
                    wordWrap: false,
                    breakWords:true,
                    align:'Justified'
                })
                text1 = "Unfollow"
                friendbtngraphics.lineStyle(0, 0x777777, 1);
                friendbtngraphics.beginFill(0x404040);
            } else {
                textstyle = new PIXI.TextStyle({
                    fontFamily: BodyFont,
                    fontSize: 28,
                    fontWeight: 'normal',
                    fill: ['#feefff'],
                    fillGradientType: 2,
                    stroke: '#3434ee',
                    strokeThickness: 0,
                    wordWrap: false,
                    breakWords:true,
                    align:'Justified'
                })
                text1 = "Follow"
                friendbtngraphics.lineStyle(0, 0x007bff, 1);
                friendbtngraphics.beginFill(0x575757);
            }
            let tmpText1 = new PIXI.Text(text1, textstyle);
            let textMetrics1 = PIXI.TextMetrics.measureText(text1, textstyle)

            let width = 50 * 2
            let height = 50 * 1
            let TextSprite = RenderTextToSprite(tmpText1)
            TextSprite.position.x = (40)
            TextSprite.position.y = (height / 2) - (textMetrics1.height / 2)

            friendbtngraphics.drawRoundedRect(0, 0, textMetrics1.width + 80, height,12);
            friendbtngraphics.endFill();

            friendbtnsprite.addChild(friendbtngraphics)
            friendbtnsprite.addChild(TextSprite)

            friendbtnsprite.interactive = true
            let bremail = this.email
            friendbtnsprite.on("click",function(e) {
                let bruce = peopleManager.getPerson(bremail)
                let uemail = bruce.email
                if (bruce.isFriends) {
                	breakfriend(uemail,function() {
                        bruce.isFriends = false
                        bruce.generateFriendButtonGraphic()
                        dissuccess("You won't hear from them!")
                        bruce.NotifyDataChanged()
                    })
                } else {
                	makefriend(uemail,function() {
                	    bruce.isFriends = true
                	    bruce.generateFriendButtonGraphic()
                        dissuccess("You have made a new friend!")
                        bruce.NotifyDataChanged()
                    })
                }
            })
            for (var i = this.friendbtnsprite.children.length - 1; i >= 0; i--) {	this.friendbtnsprite.removeChild(this.friendbtnsprite.children[i]);};
            this.friendbtnsprite.addChild(friendbtnsprite)
            this.friendBtn.width = textMetrics1.width + 40
            this.friendBtn.height = height
            this.friendBtn.sprite.addChild(friendbtnsprite)
        }

        NotifyDataChanged() {
            socket.emit('PositionUpdate', {data: this.email, posx:1, detailsChanged:1, posy:1, zoom: 1});
        }

        onImageChanged(callback,DataComponent) {
            // for (let method in this.onChangeDataCallbacks) {
            //     if ( this.onChangeDataCallbacks[method][1].coordinateID == DataComponent.coordinateID) {
            //         //delete this.onChangeDataCallbacks[method]
            //         console.log("Duplicate callback")
            //     }
            // }
            if (this.imageready) {
                callback(this,DataComponent)
            }
            this.onChangeSpriteCallbacks.push([callback,DataComponent])
        }

        onDataChanged(callback,DataComponent) {
            // for (let method in this.onChangeDataCallbacks) {
            //     if ( this.onChangeDataCallbacks[method][1].coordinateID == DataComponent.coordinateID) {
            //         //delete this.onChangeDataCallbacks[method]
            //         console.log("Duplicate callback")
            //     }
            // }
            if (this.ready) {
                callback(this,DataComponent)
            }
            this.onChangeDataCallbacks.push([callback,DataComponent])
        }

        datachanged() {
            drawUserDetails(this, new Vector(0,0), new Vector(50 * nametagsize[0], 50 * nametagsize[1]), this.personalBuffer)
        }

        getBuffer() {
            if (this.hasdatachanged) {
                this.datachanged()
                this.hasdatachanged = false
            }
            return this.personalBuffer
        }
    }


//# sourceURL=peopleManager.js