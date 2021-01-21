//create the board array 8x8 with '' for empty board and piecetype + color for pieces
function createBoard(maxRows,maxCols){
for (let row = 0; row <maxRows; row ++){
    board.push([])
    for (let col = 0; col <maxCols; col ++){
        board[row].push(piece(row,col))
    }
}
}
//create the display div grid based on the board array
function createGrid(){
    for (let row =0 ; row <board.length; row ++){
        for (let col =0; col<board[row].length; col++){
            let pieceVal = board[row][col]
            if (pieceVal == '') {
                cont.innerHTML += `<div id='board-${row}/${col}' data-piece ='board' data-row = '${row}' data-col = '${col}' class = '${color(row,col)}'></div>`
            } else {
                cont.innerHTML += `<div id='board-${row}/${col}' data-piece ='board' data-row = '${row}' data-col = '${col}' class = '${color(row,col)}'><img id ='${row}/${col}' data-row = '${row}' data-col = '${col}' data-piece=${pieceVal} src =pieces/${pieceVal}.png></div>`
            }
        }
    }
}
//create display div grid colors based on even/odd
function color(row,col){
    if (row%2 == col % 2){
        return 'white'
    } else {
        return 'black'
    }
}

//get piece color based on row
function piece(row,col){
    //pawns
    if (row == 1){
        return `blackPawn`
    } else if (row == 6){
        return `whitePawn`
        //white pieces
    } else if (row == 7){
        let pieceType = getPieceType(col)
        return `white${pieceType}`
        //black pieces pieces
    } else if (row == 0){
        let pieceType = getPieceType(col)
        return `black${pieceType}`
        //nothing
    } else {
        return ''
    }
}
//get piece type based on column
function getPieceType(col){
    if (col == 0 || col == 7){
        return 'Rook'
    } else if (col == 1 || col == 6){
        return 'Knight'
    } else if (col == 2 || col == 5) {
        return 'Bishop'
    } else if (col == 4) {
        return 'King'
    } else {
        return 'Queen'
    }
}
