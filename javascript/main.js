//chess program
//create the board
let cont = document.getElementById('container')
let board = []
let turn = 'white'
let pieceSelected;
let end = false
let whiteAttacks = []
let blackAttacks = []
let lastMoved;
let checkBlack = false
let checkWhite = false
createBoard(8,8)

createGrid()
document.addEventListener('click',play)

detectMoves()

