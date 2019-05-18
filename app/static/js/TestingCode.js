
function runme() {
    console.log("PRessed button")
}

function createTestMenu1() {
    menus = []
    let     menu = []
    let menupos = createVector(100,100)
    let menusize = createVector(200,100)
    let squares = []
    let square = []
    let squarepos = createVector(5,75)
    let squaresize = createVector(40,20)
    let squarecol = [80,80,80]
    square.push(squarepos)
    square.push(squaresize)
    square.push(squarecol)
    square.push(runme)
    squares.push(square)
    let square2 = []
    let squarepos2 = createVector(55,75)
    let squaresize2 = createVector(40,20)
    let squarecol2 = [80,80,80]
    square2.push(squarepos2)
    square2.push(squaresize2)
    square2.push(squarecol2)
    square2.push(squarecol2)
    square2.push(runme)
    squares.push(square2)
    let texts = []
    let text1 = []
    let text1text = "Testing menu item"
    let text1pos = createVector(10,20)
    let text1col = [255,255,255]
    text1.push(text1text)
    text1.push(text1pos)
    text1.push(15)
    text1.push(text1col)
    texts.push(text1)
    menu.push(menupos)
    menu.push(menusize)
    menu.push(squares)
    menu.push(texts)
    menus.push(menu)
/*
    menus: []
        menu:
            menupos
            menusize
            squares: []
                pos
                size
                col
            texts: []
                text
                pos
                fontsize
                col
*/
}