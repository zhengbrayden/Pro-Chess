//click event function
function play(event){
    if (!end){
        if (event.target.dataset.piece){
            if (event.target.dataset.piece != 'board') {
                //select piece if your turn (can switch selection)
                if (event.target.dataset.piece.substring(0,5) == turn){
                    if (pieceSelected){
                        pieceSelected.classList.remove('selected')
                    }
                    //green background to show selection
                    pieceSelected = event.target
                    pieceSelected.classList.add('selected')
                } else {
                    if (pieceSelected){
                        //piece takes piece
                        movePieceAttempt(event.target.parentElement,true,pieceSelected)
                    }
                }
            //move already selected piece
            } else {
                if (pieceSelected){
                    movePieceAttempt(event.target,false,pieceSelected)
                }
            }
        }
    }
}
//makes an attempt to move the piece
function movePieceAttempt(target,captureBoolean,movingPiece) {
    let piece = movingPiece.dataset.piece.substring(5)
    let oldRow = +movingPiece.dataset.row
    let newRow = +target.dataset.row
    let oldCol = +movingPiece.dataset.col
    let newCol = +target.dataset.col


    //DETECTION VARIABLES
    let distRow = newRow - oldRow
    let absRow = Math.abs(distRow)
    let distCol = newCol - oldCol
    let absCol = Math.abs(distCol)
    let dist = Math.round(Math.sqrt(distRow ** 2 + distCol **2) * 100)/100
    let pieceMoveData = pieceSpecificMove(piece,distRow,absRow,oldRow,newRow,distCol,absCol,oldCol,newCol,dist,captureBoolean,turn,movingPiece)
    //when enpassante is true enter a unique movePiece parameter
    if (pieceMoveData){
        movePiece(target,movingPiece,pieceMoveData)
    }
    //update board array
}
//moves a piece and deletes a piece if necessary
function movePiece(target,movingPiece,pieceMoveData){
    // let boardClone = []
    // for (let i = 0; i <board.length; i ++){
    //     boardClone.push([])
    //     for (let i2 = 0; i2 <board.length; i2++){
    //         boardClone[i].push(board[i][i2])
    //     }
    // }
    //store the move before this moves data
    let piece = movingPiece.dataset.piece.substring(5)
    let oldRow = movingPiece.dataset.row
    let oldCol = movingPiece.dataset.col
    let newRow = target.dataset.row
    let newCol = target.dataset.col
    let moveData = {
        movedPiece:board[oldRow][oldCol],
        targetPiece:board[newRow][newCol]
    }
    //only update the board to check if move is legal
    board[oldRow][oldCol] = ''
    board[newRow][newCol] = movingPiece.dataset.piece
    if (pieceMoveData.code == 'enpassante'){
        globalMoveData.enpPiece = board[pieceMoveData.row][pieceMoveData.col]
        board[pieceMoveData.row][pieceMoveData.col] = ''
    }
    detectMoves(true,true)
    //detect check to see if moving player is still under check after move
    //functionize this??
    if (!detectCheck()){
        if (turn == 'white'){
            if (detectMate('white',false,true)) {
                //detect the checkmate of white (white loses)
                if (checkWhite) {
                    console.log('black wins!!')
                //detect a stalemate by white
                } else {
                    console.log('stalemate')
                }
                end = true
            }
        } else {
            if (detectMate('black',true,false)) {
                //detect the checkmate of black (black loses))
                if (checkBlack) {
                    console.log('white wins!!')
                //detect a stalemate by black
                } else {
                    console.log('stalemate')
                }
                end = true
            }
        }
    }
    function detectCheck(){
        if (turn == 'white'){
            if (!checkCheck(checkWhite)){
                turn = 'black'
                return false
            } else {
                return true
            }
        } else {
            if (!checkCheck(checkBlack)) {
                turn = 'white'
                return false
            } else {
                return true
            }
        }
        function checkCheck(check) {
            //move is illegal, reverse board
            if (check){
                board[oldRow][oldCol] = moveData.movedPiece
                board[newRow][newCol] = moveData.targetPiece
                if (pieceMoveData.code == 'enpassante') {
                    board[pieceMoveData.row][pieceMoveData.col] = moveData.enpPiece
                }
                return true
            } else {
                //the move is legal, now we can change the display board
                lastMoved = pieceSelected
                if (piece == 'Pawn') {
                    if (movingPiece.dataset.numMoves == undefined){
                        movingPiece.dataset.numMoves = 0
                    }
                    movingPiece.dataset.numMoves ++
                    if (newRow == 0 || newRow == 7){
                        let newPiece = document.getElementById(turn + 'Promote').value
                        movingPiece.dataset.piece = turn + newPiece
                        movingPiece.src = `pieces/${movingPiece.dataset.piece}.png`
                    }
                } 
                movingPiece.dataset.row = newRow
                movingPiece.dataset.col = newCol
                movingPiece.id = `${newRow}/${newCol}`
                movingPiece.classList.remove('selected')
                pieceSelected=undefined
                target.innerHTML = ''
                if (pieceMoveData.code == 'enpassate') {
                    pieceMoveData.target.remove()
                }
                target.append(movingPiece)
                return false
            }
        }
    }
}
//gives 2 arrays of all attacked squares from white and black (minus enpassante because not really needed cannot be used for checks)
function detectMoves(white,black){
    let countBlack = 0
    let countWhite = 0
    blackAttacks = []
    whiteAttacks = []
    //scan entire board for pieces
    for (let row =0; row < 8 ; row ++) {
        for (let col =0; col < 8 ; col ++){
            if (board[row][col] != ''){
                //scan entire board for possible moves of piece
                let piece = board[row][col].substring(5)
                let color = board[row][col].substring(0,5)
                for (let newRow =0; newRow < 8 ; newRow ++) {
                    for (let newCol =0; newCol < 8 ; newCol ++){
                        //DETECTION VARIABLES
                        let distRow = newRow - row
                        let absRow = Math.abs(distRow)
                        let distCol = newCol - col
                        let absCol = Math.abs(distCol)
                        let dist = Math.round(Math.sqrt(distRow ** 2 + distCol **2) * 100)/100
                        if (color == 'white' && white){
                            if (pieceSpecificMove(piece,distRow,absRow,row,newRow,distCol,absCol,col,newCol,dist,true,'white') && board[newRow][newCol].substring(0,5) != color){
                                if (!hasDupe(whiteAttacks, {row:newRow, col:newCol})){
                                    whiteAttacks.push({row:newRow, col:newCol})
                                    if (board[newRow][newCol].substring(5) == 'King'){
                                        checkBlack = true
                                    } else {
                                        countBlack ++
                                    }
                                }
                            }
                        } else if (black && color == 'black'){
                            if (pieceSpecificMove(piece,distRow,absRow,row,newRow,distCol,absCol,col,newCol,dist,true,'black') && board[newRow][newCol].substring(0,5) != color){
                                if (!hasDupe(blackAttacks, {row:newRow, col:newCol})){
                                    blackAttacks.push({row:newRow, col:newCol})
                                    if (board[newRow][newCol].substring(5) == 'King'){
                                        checkWhite = true
                                    } else {
                                        countWhite ++
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //check detection
    if (countBlack == whiteAttacks.length){
        checkBlack = false
    }
    if (countWhite == blackAttacks.length) {
        checkWhite = false
    }
}
function detectMate(sideColor,white,black){
    for (let row =0; row < 8 ; row ++) {
        for (let col =0; col < 8 ; col ++){
            if (board[row][col] != ''){
                //scan entire board for possible moves of piece
                let piece = board[row][col].substring(5)
                let color = board[row][col].substring(0,5)
                for (let newRow =0; newRow < 8 ; newRow ++) {
                    for (let newCol =0; newCol < 8 ; newCol ++){
                        //DETECTION VARIABLES
                        let distRow = newRow - row
                        let absRow = Math.abs(distRow)
                        let distCol = newCol - col
                        let absCol = Math.abs(distCol)
                        let dist = Math.round(Math.sqrt(distRow ** 2 + distCol **2) * 100)/100
                        if (color == sideColor){
                            if (!testMove(true)){
                                return false
                            } else if (!testMove(false)){
                                return false
                            }
                            function testMove(captureBoolean){
                                //if capture boolean is true, then the target must be a piece, if it is false, then the target must be empty board
                                if ((captureBoolean && board[newRow][newCol] != '') || (!captureBoolean && board[newRow][newCol].substring(0,5) =='')) {
                                    let pieceMoveData = pieceSpecificMove(piece,distRow,absRow,row,newRow,distCol,absCol,col,newCol,dist,captureBoolean,sideColor)
                                    if (pieceMoveData && board[newRow][newCol].substring(0,5) != color){
                                        let moveData = [color + piece,board[newRow][newCol]]
                                        board[row][col] = ''
                                        board[newRow][newCol] = color + piece
                                        if (pieceMoveData.code == 'enpassante'){
                                            board[pieceMoveData.row][pieceMoveData.col] = ''
                                            moveData.push(pieceMoveData.target.dataset.piece)
                                        }
                                        detectMoves(white,black)
                                        //revert moves
                                        board[row][col] = moveData[0]
                                        board[newRow][newCol] = moveData[1]
                                        if (moveData.length > 2){
                                            board[pieceMoveData.row][pieceMoveData.col] = moveData[2]
                                        }
                                        if (sideColor == 'white'){
                                            if (!checkWhite){
                                                return false
                                            } else {
                                                return true
                                            }
                                        } else {
                                            if (!checkBlack){
                                                return false
                                            } else {
                                                return true
                                            }
                                        }
                                    } else {
                                        return true
                                    }
                                } else {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //make sure we run detectMove for appropriate side one last time to get the correct check state (true or false) to determine stalemate or checkmate
    detectMoves(white,black)
    //if false has not been returned up to this point, then there is a checkmate/stalemate
    return true
}
//calculates if move is legal
function pieceSpecificMove(piece,distRow,absRow,oldRow,newRow,distCol,absCol,oldCol,newCol,dist,captureBoolean,side,movingPiece){
    if (piece == 'Knight'){
        if (dist == Math.round(Math.sqrt(5) * 100)/100) {
            return true
        }
    } else if (piece == 'Pawn') {
        if ((side == 'black' && distRow >0) || (side == 'white' && distRow < 0)){
            return pawnMoveDetect(captureBoolean,distRow,absRow,oldRow,distCol,absCol,oldCol,side)
        }
    } else if (piece == 'Rook'){
        if (distCol ==0 || distRow == 0) {
            return !detectCollisionRook(distRow,absRow,oldRow,distCol,absCol,oldCol)
        }
    } else if (piece == 'Bishop'){
        if(dist == Math.round(absCol * Math.sqrt(2) * 100)/100) {
            //detect Pieces in path
            return !detectCollisionBishop(distRow,absRow,oldRow,distCol,absCol,oldCol)
        }
    } else if (piece == 'Queen'){
        if (distCol == 0 || distRow == 0){
            return !detectCollisionRook(distRow,absRow,oldRow,distCol,absCol,oldCol)
        } else if (dist == Math.round(absCol * Math.sqrt(2) * 100)/100){
            return !detectCollisionBishop(distRow,absRow,oldRow,distCol,absCol,oldCol)
        }
    } else if (piece == 'King'){ 
        if (dist <= Math.round(Math.sqrt(2) * 100)/100){
            return true
        } else if (movingPiece){
            if (!captureBoolean && absCol == 2 && absRow == 0 && !movingPiece.dataset.numMoves) {
                if (side == 'black' && oldRow == 0){
                    return castle(distRow,absRow,oldRow,distCol,absCol,oldCol,whiteAttacks)
                } else if (side == 'white' && oldRow == 7){
                    return castle(distRow,absRow,oldRow,distCol,absCol,oldCol,blackAttacks)
                }
            }
        }
    }
}
function pawnMoveDetect(captureBoolean,distRow,absRow,oldRow,distCol,absCol,oldCol,side){
    //if pawn is moving in right direction (pawn can only move forward) we know pawn is moving in right direction
    if (captureBoolean){
        if(absCol == 1 && absRow == 1){
            return true
        }
    } else if (absCol == 0){
        if (absRow == 1){
            return true
        } else if (absRow == 2 && ((oldRow == 1 && side=='black' && board[oldRow + 1][oldCol] == '') ||(oldRow == 6 && side=='white' && board[oldRow - 1][oldCol] == ''))){
            return true
        }
    } else if (absCol == 1 && absRow == 1){
        //if it is black on row 4 or white on row 3
        if (oldRow == 4 && side == 'black'){
            return enPassente('whitePawn')
        } else if (oldRow == 3 && side == 'white') {
            return enPassente('blackPawn')
        }
        function enPassente(pawn){
            if (board[oldRow][oldCol + distCol] == pawn){
                let target = document.getElementById(`${oldRow}/${oldCol + distCol}`)
                if (target.dataset.numMoves == 1 && target == lastMoved) {
                    return {code:'enpassante',target:target, row:oldRow, col : oldCol + distCol}
                }
            }
        }
    }
}
//collision detection functions
function detectCollisionBishop(distRow,absRow,oldRow,distCol,absCol,oldCol){
    for (let n = 1; n <absCol; n ++){
        let testPoint = {row:n * distRow / absRow + oldRow, col: n * distCol/absCol + oldCol}
        if (board[testPoint.row][testPoint.col] != '') {
            return true
        }
    }
}
function detectCollisionRook(distRow,absRow,oldRow,distCol,absCol,oldCol){
    //moving vertically
    if (distCol ==0){
        for (let n =1; n <absRow; n ++){
            let testRow = n * distRow/absRow + oldRow
            if (board[testRow][oldCol] != '') {
                return true
            }
        }
    //moving horizontally
    } else {
        for (let n = 1; n <absCol; n++){
            let testCol = n * distCol/absCol + oldCol
            if (board[oldRow][testCol] != '') {
                return true
            }
        }
    }
}
//used for detectMove function, makes sure duplicate attacks are not logged
function hasDupe(array,item){
    for (let i = 0; i < array.length; i ++){
        if (array[i].row == item.row && array[i].col == item.col){
            return true
        }
    }
}
function castle(distRow,absRow,oldRow,distCol,absCol,oldCol,enemyAttacks) {
    //castle left side
    if (distCol < 0){
        //moves the castle piece if castleChecker function goes through
        if (castleChecker(-4,4,enemyAttacks) && !document.getElementById(`${oldRow}/${0}`).dataset.numMoves){
            movePiece(document.getElementById(`board-${oldRow}/${oldCol - 1}`), document.getElementById(`${oldRow}/${0}`))
            if (turn == 'white'){
                turn = 'black'
            } else {
                turn = 'white'
            }
            return true
        }
    //castle right side
    } else {
        if (castleChecker(3,3) && !document.getElementById(`${oldRow}/${7}`).dataset.numMoves){
            movePiece(document.getElementById(`board-${oldRow}/${oldCol +1}`),document.getElementById(`${oldRow}/${7}`))
            if (turn == 'white'){
                turn = 'black'
            } else {
                turn = 'white'
            }
            return true
        }
    }
    function castleChecker(distance, absDistance){
        for (let i = 0; i <= absDistance; i ++){
            let testCol = i * distance/absDistance + oldCol
            //detect if there are blocking pieces
            if (board[oldRow][testCol] != '' && testCol != oldCol + distance && testCol!= 4) {
                return false
            } else {
                //else detect if tile is being attacked by enemy
                for (let i = 0; i <enemyAttacks.length; i ++){
                    if (enemyAttacks[i].row == oldRow && enemyAttacks[i].col == testCol) {
                        return false
                    }
                }
            }
        }
        return true
    }
}
//features, undo, replace boardclone with reverse moves
//we have implemented check detection!!!!
//how to do checkmate? simulate playing all possible moves