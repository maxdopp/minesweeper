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
    for(let i = 0; i < boardSize; i++){
        tiles.push([]);
        for(let j = 0; j < boardSize; j++){
            let tile = document.createElement("div");
            if(mines[i][j]){
                tile.className = "tile mine";
                tile.addEventListener("click", gameLost);
            }
            else{
                tile.className = "tile safe";
                tile.addEventListener("click", updateBoard);
            }
            tile.style.width = tileSize + "px";
            tile.style.height = tileSize + "px";
            tile.index = [i, j];
            tiles[i].push(tile);
            board.appendChild(tile);
        }
    }
}

function placeMines() {
    mines = [];
    for(let i = 0; i < boardSize; i++){
        mines.push([]);
        for(let j = 0; j < boardSize; j++){
            mines[i].push(0);
        }
    }
    for(let i = 0; i < mineCount; i++){
        rand = [Math.floor(Math.random() * boardSize), Math.floor(Math.random() * boardSize)];
        if(mines[rand[0]][rand[1]]){
            i--;
        }
        else{
            mines[rand[0]][rand[1]] = true;
        }
    }
    console.log(mines);
}

function updateBoard(event) {
    let tile = event.target;
    determineNumber(tile);
    if(tile.count == 0){
        //branch method
        //go out in all four directions and branch off every step
        //recursion?
        //end branch when hit a numbered tile
    }
}

function determineNumber(tile) {
    tile.count = 0;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            let x = tile.index[0] - 1 + i;
            let y = tile.index[1] - 1 + j;
            if(x < 0 || y < 0 || x >= boardSize || y >= boardSize){
                continue;
            }
            if(mines[x][y]){
                console.log("mine");
                tile.count++;
            }
        }
    }
    tile.innerHTML = tile.count;
}

function gameLost(event){
    if(turn == 0){
        event.target.className = "tile safe";
        updateBoard(event);
    }
    turn++;
}