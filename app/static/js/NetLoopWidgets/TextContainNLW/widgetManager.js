(function () {
    let nlw = new NetLoopWidgetBase("BINSTA", "TextContainerWidget")
    let loaderID = 'TextContainNLW'
    let NLWcurrentURL = NLWWidgetList[loaderID][0]
    loadJavascriptFromUrl(NLWcurrentURL + "widget.js", ()=> {
        nlw.setDisplayImage(null)

        nlw.setDisplayDescription("Text Post", "Add text to the plane", "Add Text Post")
        nlw.setDisplayRequiredInfo({"Text": "String"})

        nlw.doOnCreate(function (Position, args) {
            this.createNLWInstance(Position, {
                "Text": args["Text"],
                "Position": Position.x + ";" + Position.y,
                "CreateDate": new Date().toISOString()
            })
        })
        nlw.doOnLoad(function (iID, DataComp) {
            return new TextContainerNLW(iID, DataComp)
        })
        nlw.doOnDestroy(function () {

        })

        nlw.Save()
    })
}());

//# sourceURL=TextContainNLWManager.js

