var boardSize;
var tileSize = 30;
var mineCount;
var board;
var tiles = [];
var divs;
var mines;
var turn = 0;

var easyButton;
var mediumButton;
var hardButton;

document.addEventListener("DOMContentLoaded", function() {
    board = document.getElementById("board");
    easyButton = document.querySelector(".easy");
    mediumButton = document.querySelector(".medium");
    hardButton = document.querySelector(".hard");
    easyButton.addEventListener("click", function() {
        boardSize = 10;
        mineCount = 10;
        createBoard(board);
    });
    mediumButton.addEventListener("click", function() {
        boardSize = 16;
        mineCount = 40;
        createBoard(board);
    });
    hardButton.addEventListener("click", function() {
        boardSize = 24;
        mineCount = 110;
        createBoard(board);
    });
});

function createBoard(board) {
    while(board.firstChild){
        board.removeChild(board.firstChild);
    }
    let sideLength = boardSize * tileSize + "px";
    board.style.width = sideLength;
    placeMines();
    for(let i = 0; i < boardSize * boardSize; i++){
        let tile = document.createElement("div");
        if(mines[i]){
            tile.className = "tile mine";
            tile.addEventListener("click", gameLost);
        }
        else{
            tile.className = "tile safe";
            tile.addEventListener("click", updateBoard);
        }
        tile.style.width = tileSize + "px";
        tile.style.height = tileSize + "px";
        tile.number = i;
        tiles.push(tile);
        board.appendChild(tile);
    }
}

function placeMines() {
    mines = [];
    for(let i = 0; i < boardSize * boardSize; i++){
        mines.push(0);
    }
    for(let i = 0; i < mineCount; i++){
        rand = Math.floor(Math.random() * boardSize * boardSize);
        if(mines[rand]){
            i--;
        }
        else{
            mines[rand] = true;
        }
    }
}

function updateBoard(event) {
    let tile = event.target;
    determineNumber(tile);
}

function determineNumber(tile) {
    tile.count = 0;
    //top
    if(tile.number >= boardSize){
        if(tile.number % boardSize == 0){
            for(let i = 0; i < 2; i++){
                if(mines[tile.number - boardSize + i]){
                    tile.count++;
                }
            }
        }
        else if((tile.number + 1) % boardSize == 0){
            for(let i = 0; i < 2; i++){
                if(mines[tile.number - boardSize - 1 + i]){
                    tile.count++;
                }
            }
        }
        else{
            for(let i = 0; i < 3; i++){
                if(mines[tile.number - boardSize - 1 + i]){
                    tile.count++;
                }
            }
        }
    }
    //middle
    if(tile.number % boardSize == 0|| tile.number == 0){
        if(mines[tile.number + 1]){
            tile.count++;
        }
    }
    else if((tile.number + 1) % boardSize == 0){
        if(mines[tile.number - 1]){
            tile.count++;
        }
    }
    else{
        if(mines[tile.number + 1]){
            tile.count++;
        }
        if(mines[tile.number - 1]){
            tile.count++;
        }
    }
    //bottom
    if(tile.number < (boardSize * boardSize) - boardSize){
        if(tile.number % boardSize == 0){
            if(mines[tile.number + boardSize]){
                tile.count++;
            }
            if(mines[tile.number + boardSize + 1]){
                tile.count++;
            }
        }
        else if((tile.number + 1) % boardSize == 0){
            if(mines[tile.number + boardSize - 1]){
                tile.count++;
            }
            if(mines[tile.number + boardSize]){
                tile.count++;
            }
        }
        else{
            for(let i = 0; i < 3; i++){
                if(mines[tile.number + boardSize - 1 + i]){
                    tile.count++;
                }
            }
        }
    }
}

function gameLost(event){
    if(turn == 0){
        event.target.className = "tile safe";
        updateBoard();
    }
}