
class Link {
    constructor() {
        this.vecposition = new Vector()
        this.vecsize = new Vector()
        this.sprite = new PIXI.Sprite()
        this.LinksTo = new Vector()
        this.datacomponent = "None"
    }
}
class PostLinkManager {
    constructor() {
        this.links = []
    }

    newLink(Datacomponent, LinkToCoord, linksToCoordId) {
        let link = new Link()


        let vec1 = new Vector(parseFloat(Datacomponent.vecposition.x),parseFloat(Datacomponent.vecposition.y))
        vec1.x += 2
        vec1.y -= 0
        let vec2 = new Vector(parseFloat(LinkToCoord.x),parseFloat(LinkToCoord.y))
        vec2.x += 2
        vec2.y += 1.5

        let dist = getDist(vec1,vec2) * 50
        let angle = getAngleRads(vec1,vec2)
        let middle = getMiddle(vec1,vec2)

        let vecDiff = new Vector((vec2.x - vec1.x) * 50,(vec2.y - vec1.y) * 50)

        let graphics = new PIXI.Graphics()
        let linkHeight = 40

        let bezlink = new Link()
        let bezierGraphics = new PIXI.Graphics()

        let endVec = new Vector()

        bezierGraphics.beginFill(0xffffff,0);
        bezierGraphics.lineStyle(10, 0x888888, 1);
        //bezierGraphics.drawRect(0,0,(vec2.x - vec1.x) * 50,(vec2.y - vec1.y) * 50)
        bezierGraphics.moveTo(0,0)
        bezierGraphics.bezierCurveTo(0,-200,vecDiff.x,vecDiff.y+200,vecDiff.x,vecDiff.y)
        bezierGraphics.endFill();

        bezlink.datacomponent = Datacomponent
        bezlink.LinksTo = vec2
        bezlink.vecposition = vec1.clone()
        bezlink.vecsize = new Vector(100,100)
        bezlink.vecposition.x = vec1.x
        bezlink.vecposition.y = vec1.y

        let bezLinkSprite = new PIXI.Sprite()
        bezLinkSprite.addChild(bezierGraphics)


        bezlink.sprite = bezLinkSprite
        stage.addChild(bezLinkSprite)
        this.links.push(bezlink)

        graphics.lineStyle(0, 0x000000, 1);
        graphics.beginFill(0x484848);
        let shape = new PIXI.Polygon(0,linkHeight*0.4
                                    //,dist * 0.7,linkHeight*0.4
                                    //,dist * 0.7,linkHeight*0.1
                                    ,dist,linkHeight*0
                                    ,dist + (linkHeight/2),linkHeight*0.5
                                    ,dist,linkHeight*1
                                    ,0,linkHeight*0.6
                                    ,-20,linkHeight/2)
        graphics.drawPolygon(shape)
        //graphics.drawRoundedRect(0, 0, dist, linkHeight,1);
        graphics.endFill();

        link.datacomponent = Datacomponent
        link.LinksTo = vec2
        link.vecposition = vec1.clone()
        link.vecsize = new Vector(100,100)

        let LinkSprite = new PIXI.Sprite()
        LinkSprite.addChild(graphics)

        LinkSprite.position.x = middle.x * 50
        LinkSprite.position.y = middle.y * 50
        LinkSprite.pivot.set(LinkSprite.width/2, linkHeight/2);
        LinkSprite.rotation = angle

        link.sprite = LinkSprite
        //stage.addChild(LinkSprite)

        //this.links.push(link)
    }

    createLink(Datacomponent, LinkCoords, LinkedCompID) {
        let vec1 = new Vector(parseFloat(Datacomponent.vecposition.x),parseFloat(Datacomponent.vecposition.y))
                vec1.x += 2
                vec1.y -= 0
                let vec2 = new Vector(parseFloat(LinkCoords.x),parseFloat(LinkCoords.y))
                vec2.x += 2
                vec2.y += 1.5

                let bezlink = new Link()
                let bezierGraphics = new PIXI.Graphics()

                bezlink.datacomponent = Datacomponent
                bezlink.SecondDataComponentExists = false
                if (LinkedCompID in widgetManager.Allitems) {
                    bezlink.LinksToDataComponent = widgetManager.Allitems[LinkedCompID]
                    bezlink.SecondDataComponentExists = true
                }
                bezlink.LinksTo = vec2
                bezlink.LinksToCoordID = LinkedCompID
                bezlink.vecposition = vec1.clone()
                bezlink.vecsize = new Vector(100,100)
                bezlink.vecposition.x = vec1.x
                bezlink.vecposition.y = vec1.y

                let bezLinkSprite = new PIXI.Sprite()
                bezLinkSprite.addChild(bezierGraphics)

                this.DrawLinkBetweenCoords(bezLinkSprite,Datacomponent.vecposition,LinkCoords)

                bezlink.sprite = bezLinkSprite
                stage.addChild(bezLinkSprite)
                this.links.push(bezlink)
    }

    reDrawLinkBetweenDC(sprit,Datacomponent1,Datacomponent2) {
        this.DrawLinkBetweenCoords(sprit,Datacomponent1.vecposition,Datacomponent2.vecposition)
    }

    DrawLinkBetweenCoords(sprit, Coord1,Coord2) {
            let vec1 = new Vector(parseFloat(Coord1.x),parseFloat(Coord1.y))
            vec1.x += 2
            vec1.y -= 0
            let vec2 = new Vector(parseFloat(Coord2.x),parseFloat(Coord2.y))
            vec2.x += 2
            vec2.y += 1.5

            let dist = getDist(vec1,vec2) * 50
            let angle = getAngleRads(vec1,vec2)
            let middle = getMiddle(vec1,vec2)

            let vecDiff = new Vector((vec2.x - vec1.x) * 50,(vec2.y - vec1.y) * 50)
            let bezierGraphics = sprit.children[0]

            bezierGraphics.clear()

            bezierGraphics.beginFill(0xffffff,0);
            bezierGraphics.lineStyle(10, 0x888888, 1);
            //bezierGraphics.drawRect(0,0,(vec2.x - vec1.x) * 50,(vec2.y - vec1.y) * 50)
            bezierGraphics.moveTo(0,0)
            bezierGraphics.bezierCurveTo(0,-200,vecDiff.x,vecDiff.y+200,vecDiff.x,vecDiff.y)
            bezierGraphics.endFill();
    }

    removeLink() {

    }

    reDrawLink(link) {
        if (link.SecondDataComponentExists) {
            let vec1 = new Vector(parseFloat(link.datacomponent.vecposition.x),parseFloat(link.datacomponent.vecposition.y))
            vec1.x += 2
            vec1.y -= 0
            this.reDrawLinkBetweenDC(link.sprite,link.datacomponent,link.LinksToDataComponent)
            link.vecposition.x = vec1.x
            link.vecposition.y = vec1.y
        }
    }

    UpdateLink(link) {
        if (!link.SecondDataComponentExists) {
            if (link.LinksToCoordID in widgetManager.Allitems) {
                link.LinksToDataComponent = widgetManager.Allitems[link.LinksToCoordID]
                link.SecondDataComponentExists = true
            }
        }
        if (link.SecondDataComponentExists) {
            if (link.LinksToDataComponent.ServiceBooleans["LinkManagerDirty"]) {
                this.reDrawLink(link)
                link.LinksToDataComponent.ServiceBooleans["LinkManagerDirty"] = false
            }
        }
        if (link.datacomponent.ServiceBooleans["LinkManagerDirty"]) {
            this.reDrawLink(link)
            link.datacomponent.ServiceBooleans["LinkManagerDirty"] = false
        }
    }

    update() {
        for (let items in this.links) {
            let link = this.links[items]
            this.UpdateLink(link)
            let newvecposition = ScreenCoordToPlaneCoord(link.vecposition)
            let scale = unitsize / 50
            link.sprite.position.x = newvecposition.x
            link.sprite.position.y = newvecposition.y
            link.sprite.scale.x = scale
            link.sprite.scale.y = scale
        }
    }
}

function getMiddle(vec1, vec2) {
    let middle = new Vector(parseFloat(vec1.x + vec2.x) / 2.0,parseFloat(vec1.y + vec2.y) / 2.0)
    return middle
}

function getDist(vec1, vec2) {
    let dist = Math.sqrt(Math.pow(vec2.x - vec1.x,2.0) + Math.pow(vec2.y - vec1.y,2.0))
    return dist
}

function getAngleRads(vec1, vec2) {
    let angleRadians = Math.atan2(vec2.y - vec1.y, vec2.x - vec1.x);
    return angleRadians
}
function getAngleDegs(vec1, vec2) {
    // angle in degrees
    let angleDeg = Math.atan2(vec2.y - vec1.y, vec2.x - vec1.x) * 180 / Math.PI;
    return angleDeg
}

//# sourceURL=PostLinkManager.js