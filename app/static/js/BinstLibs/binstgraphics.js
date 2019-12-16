

function createDefaultText(params) {
    let textstyle = new PIXI.TextStyle({
        //font:"35px Verdana",
        fontFamily: BodyFont,
        fontSize: params.fontsize,
        fontWeight: 'normal',
        fill: BodyColor,
        fillGradientType: 2,
        stroke: '#d8d8d8',
        strokeThickness: 0,
        wordWrap: "wrap" in params,
        wordWrapWidth: "wrapwidth" in params? params.wrapwidth: 0,
        breakWords: "breakwords" in params,
        align: 'Justified'
    })
    let RenderText = new PIXI.Text(params.text, textstyle);
    let textMetrics = PIXI.TextMetrics.measureText(params.text, textstyle)
    return {"RenderText": RenderText, "textMetrics": textMetrics}
}

function onUserUpdate() {
}

function getProfilePic() {

}