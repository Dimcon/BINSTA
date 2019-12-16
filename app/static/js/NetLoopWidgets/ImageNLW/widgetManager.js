(function () {
    let nlw = new NetLoopWidgetBase("BINSTA", "ImagesWidget")
    let loaderID = 'ImageNLW'
    let NLWcurrentURL = NLWWidgetList[loaderID][0]
    loadJavascriptFromUrl(NLWcurrentURL + "widget.js", () => {
        nlw.setDisplayImage(null)

        nlw.setDisplayDescription("Image/s Post", "Add images to the plane", "Create image Post")
        nlw.setDisplayRequiredInfo({
            "Text": "String",
            "images": "ImagesWithCaptions"
        })

        nlw.doOnCreate(function (Position, args) {
            this.createNLWInstance(Position, {
                "Text": args["Text"],
                "Position": Position.x + ";" + Position.y,
                "CreateDate": new Date().toISOString()
            })
        })
        nlw.doOnLoad(function (iID, DataComp) {
            return new ImageNLW(iID, DataComp)
        })
        nlw.doOnDestroy(function () {

        })

        nlw.Save()
    })
}());

//# sourceURL=ImageNLWManager.js
