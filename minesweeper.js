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
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
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
    tiles = [];
    turn = 0;
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
            tile.addEventListener("contextmenu", flag);
            tile.flagged = false;
            tile.style.width = tileSize + "px";
            tile.style.height = tileSize + "px";
            tile.index = [i, j];
            tiles[i].push(tile);
            tiles[i][j].break = false;
            tiles[i][j].searched = false;
            tiles[tile.index[0]][tile.index[1]].clicked = false;
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
    if(tile.flagged == true){
        return;
    }
    determineNumber(tile);
    if(tile.count == 0){
        tile.break = true;
        tile.className = "tile broken";
        breakTiles(tile);
        turn++;
    }
    else{
        if(turn == 0){
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    let x = tile.index[0] - 1 + i;
                    let y = tile.index[1] - 1 + j;
                    if(x < 0 || y < 0 || x >= boardSize || y >= boardSize){
                        continue;
                    }
                    if(mines[x][y] == true){
                        while(true){
                            rand = [Math.floor(Math.random() * boardSize), Math.floor(Math.random() * boardSize)];
                            if(mines[rand[0]][rand[1]] == false && (rand[0] < x - i || rand[0] > x - i + 2) && (rand[1] < y - j || rand[1] > y - j + 2)){
                                mines[rand[0]][rand[1]] = true;
                                tiles[rand[0]][rand[1]].className = "tile mine";
                                tiles[rand[0]][rand[1]].addEventListener("click", gameLost);
                                break;
                            }
                        }
                        mines[x][y] = false;
                        tiles[x][y].removeEventListener("click", gameLost);
                        tiles[x][y].addEventListener("click", updateBoard);
                        tiles[x][y].className = "tile safe";
                    }
                       
                }
            }
            tile.count = 0;
            tile.break = true;
            tile.className = "tile broken";
            breakTiles(tile);
        }
        if(tile.count > 0){
            tile.className = "tile number";
            tile.innerHTML = tile.count;
        }
        else{
            tile.className = "tile broken";
        }
        tile.break = true;
        tiles[tile.index[0]][tile.index[1]].clicked = true;
        turn++;
    }
    let safeCount = 0;
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){
            if(tiles[i][j].className == "tile safe"){
                safeCount++;
            }
            determineNumber(tiles[i][j]);
            if(tiles[i][j].count > 0 && mines[i][j] == false && checkSurroundingTiles(tiles[i][j]) == true){
                tiles[i][j].className = "tile number"
            }
        }
    }
    if(safeCount == 0){
        alert("You Win!");
        stopGame();
    }
}

function determineNumber(tile) {
    tile.count = 0;
    if(tile.className != "tile mine"){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let x = tile.index[0] - 1 + i;
                let y = tile.index[1] - 1 + j;
                if(x < 0 || y < 0 || x >= boardSize || y >= boardSize){
                    continue;
                }
                if(mines[x][y]){
                    tile.count++;
                    tiles[x][y].count++;
                }
            }
        }
        if(checkSurroundingTiles(tile) == true && tile.count > 0){
            tile.className = "tile number";
            tile.innerHTML = tile.count;
        }
    }
}

function gameLost(event){
    if(turn == 0 && event.target.flagged == false){
        event.target.className = "tile safe";
        updateBoard(event);
        turn++;
    }
    else if(event.target.flagged == false){
        alert("BOOM!");
        stopGame();
        turn++;
    }
}

function stopGame(){
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){
            if(mines[i][j] == true){
                tiles[i][j].style.backgroundColor = "red";
            }
            tiles[i][j].replaceWith(tiles[i][j].cloneNode(true));
        }
    }
}

function breakTiles(tile) {
    for(let z = 0; z < boardSize; z++){
        let count = 0;
        let step = 1;
        while(true){
            count = 0;
            for(let i = 0; i < 2 * step + 1; i++){//top
                let x = tile.index[0] - step + i;
                let y = tile.index[1] - step;
                if(x >= 0 && y >= 0 && x < boardSize && y < boardSize){
                    determineNumber(tiles[x][y]);
                    if(tiles[x][y].count == 0 && checkSurroundingTiles(tiles[x][y]) == true){
                        tiles[x][y].break = true;
                        tiles[x][y].className = "tile broken";
                        count++;
                    }
                }    
            }
            for(let i = 0; i < 2 * (step - 1) + 1; i++){//left
                let x = tile.index[0] - step;
                let y = tile.index[1] - step + 1 + i;
                if(x >= 0 && y >= 0 && x < boardSize && y < boardSize){
                    determineNumber(tiles[x][y]);
                    if(tiles[x][y].count == 0 && checkSurroundingTiles(tiles[x][y]) == true){
                        tiles[x][y].break = true;
                        tiles[x][y].className = "tile broken";
                        count++;
                    }
                }
            }
            for(let i = 0; i < 2 * step + 1; i++){//bottom
                let x = tile.index[0] - step + i;
                let y = tile.index[1] + step;
                if(x >= 0 && y >= 0 && x < boardSize && y < boardSize){
                    determineNumber(tiles[x][y]);
                    if(tiles[x][y].count == 0 && checkSurroundingTiles(tiles[x][y]) == true){
                        tiles[x][y].break = true;
                        tiles[x][y].className = "tile broken";
                        count++;
                    }
                }
            }
            for(let i = 0; i < 2 * (step - 1) + 1; i++){//right
                let x = tile.index[0] + step;
                let y = tile.index[1] - step + 1 + i;
                if(x >= 0 && y >= 0 && x < boardSize && y < boardSize){
                    determineNumber(tiles[x][y]);
                    if(tiles[x][y].count == 0 && checkSurroundingTiles(tiles[x][y]) == true){
                        tiles[x][y].break = true;
                        tiles[x][y].className = "tile broken";
                        count++;
                    }
                }
            }
            step++;
            if(count == 0){
                break;
            }
        }
    }
}

function checkSurroundingTiles(tile) {
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            let x = tile.index[0] - 1 + i;
            let y = tile.index[1] - 1 + j;
            if(x < 0 || y < 0 || x >= boardSize || y >= boardSize){
                continue;
            }
            if(tiles[x][y].break == true && tiles[x][y].clicked == false){
                return true;
            }
        }
    }
    return false;
}

function flag(event) {
    let tile = event.target;
    if(tile.flagged == false && tile.className != "tile number" && tile.className != "tile broken"){
        tile.flagged = true;
        tile.classList.add("flag");
    }
    else{
        tile.flagged = false;
        tile.classList.remove("flag");
    }
}