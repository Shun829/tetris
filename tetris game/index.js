//board init
const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 10;
const SIZE = 24;
let point = 0;
let rotateShape = []
let board = [];
let currentGhostTetromino;
let end = true;
let val;

const bgm = document.createElement("audio");
const breakSound = document.createElement("audio");
const drop = document.createElement("audio");
const rotateSound = document.createElement("audio");
const gameOverSound = document.createElement("audio");

bgm.setAttribute("src", "./assets/bgm.mp3");
bgm.muted = true;


breakSound.setAttribute("src", "./assets/clear.mp3");
breakSound.muted = true;

drop.setAttribute("src", "./assets/drop.mp3");
drop.muted = true;

rotateSound.setAttribute("src", "./assets/rotate.mp3");
rotateSound.muted = true;

gameOverSound.setAttribute("src", "./assets/gameover.wav");
gameOverSound.muted = true;

for(let i = 0; i < BOARD_HEIGHT; i++) {
    board[i] = [];
    for(let j = 0; j < BOARD_WIDTH; j++) {
        board[i][j] = 0;
    }
}

//Tetrominoes定義
let Tetrominoes = [
    {
        shape: [
            [1, 1],
            [1, 1]   
        ],
        color: "red"
    },
    {
        shape: [
            [0, 1, 1],
            [1, 1, 0]   
        ],
        color: "orange"
    },
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1]   
        ],
        color: "yellow"
    },
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1]   
        ],
        color: "green"
    },
    {
        shape: [
            [0, 0, 1],
            [1, 1, 1]   
        ],
        color: "blue"
    },
    {
        shape: [
            [1, 0, 0],
            [1, 1, 1]   
        ],
        color: "indigo"
    },
    {
        shape: [
            [1, 1, 1, 1]   
        ],
        color: "violet"
    }
];

//rand Tetromino
function randomTetromino(){
    const rand = Math.floor(Math.random() * Tetrominoes.length);
    const Tetromino = Tetrominoes[rand];
    return {
        shape: Tetromino.shape,
        color: Tetromino.color,
        row: 0,
        col: 3
    };
}

let currentTetromino = randomTetromino();
let holdTetromino = {};
let nextTetrominos = [randomTetromino(), randomTetromino(), randomTetromino()];

//Add a new Tetromino
function addNewTetromino() {
    nextTetrominos[0] = nextTetrominos[1];
    nextTetrominos[1] = nextTetrominos[2];
    nextTetrominos[2] = randomTetromino();
}

//draw hold Tetromino
function drawHoldTetromino(){
    const shape = holdTetromino.shape;
    const color = holdTetromino.color;
    let row = 1;
    let col = 1;
    //center
    if(shape.length == 1) col = 0.5, row = 1.5;
    else if(shape[0].length == 2) col = 1.5;

    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]){
                let block = document.createElement("div");
                block.classList.add("block");
                block.style.backgroundColor = color;
                block.style.top = (row + i) * SIZE + "px";
                block.style.left = (col + j) * SIZE + "px";
                block.setAttribute("id", `hold_block${row + i}-${col + j}`);
                document.getElementById("hold_board").appendChild(block);
            }
        }
    }
}

//erase HoldTetromino from board
function eraseHoldTetromino(){
    const shape = holdTetromino.shape;
    let row = 1;
    let col = 1;
    if(shape.length == 1) col = 0.5, row = 1.5;
    else if(shape[0].length == 2) col = 1.5;

    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]){
                let block = document.getElementById(`hold_block${row + i}-${col + j}`);
                document.getElementById("hold_board").removeChild(block);
            }
        }
    }
}

//draw next Tetromino 1 5 9
function drawNextTetromino(){
    for(let t = 0; t < 3; t++) {
        let shape = nextTetrominos[t].shape;
        let color = nextTetrominos[t].color;
        let row = 1 + 4 * t;
        let col = 1;
        //center
        if(shape.length == 1) col = 0.5, row += 0.5;
        else if(shape[0].length == 2) col = 1.5;

        for(let i = 0; i < shape.length; i++){
            for(let j = 0; j < shape[i].length; j++){
                if(shape[i][j]){
                    let block = document.createElement("div");
                    block.classList.add("block");
                    block.style.backgroundColor = color;
                    block.style.top = (row + i) * SIZE + "px";
                    block.style.left = (col + j) * SIZE + "px";
                    block.setAttribute("id", `next_block${row + i}-${col + j}`);
                    document.getElementById("next_board").appendChild(block);
                }
            }
        }
    }   
}

//erase NextTetromino from board
function eraseNextTetromino(){
    for(let t = 0; t < 3; t++) {
        let shape = nextTetrominos[t].shape;
        let row =  1 + 4 * t;
        let col = 1;
        if(shape.length == 1) col = 0.5, row += 0.5;
        else if(shape[0].length == 2) col = 1.5;

        for(let i = 0; i < shape.length; i++){
            for(let j = 0; j < shape[i].length; j++){
                if(shape[i][j]){
                    let block = document.getElementById(`next_block${row + i}-${col + j}`);
                    document.getElementById("next_board").removeChild(block);
                }
            }
        }
    }
}

//draw Tetrominoes
function drawTetromino(){
    const row = currentTetromino.row;
    const col = currentTetromino.col;
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]){
                let block = document.createElement("div");
                block.classList.add("block");
                block.style.backgroundColor = color;
                block.style.top = (row + i) * SIZE + "px";
                block.style.left = (col + j) * SIZE + "px";
                block.setAttribute("id", `block${row + i}-${col + j}`);
                document.getElementById("game_board").appendChild(block);
            }
        }
    }
}

//erase Tetromino from board
function eraseTetromino(){
    const row = currentTetromino.row;
    const col = currentTetromino.col;
    const shape = currentTetromino.shape;
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]){
                let block = document.getElementById(`block${row + i}-${col + j}`);
                if(block) document.getElementById("game_board").removeChild(block);
            }
        }
    }
}

//draw one line Tetrominoes
function drawOneLineTetromino(){
    const row = currentTetromino.row - 1;
    const col = currentTetromino.col;
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;
    let i = shape.length - 1
    for(let j = 0; j < shape[i].length; j++){
        if(shape[i][j]){
            let block = document.createElement("div");
            block.classList.add("block");
            block.style.backgroundColor = color;
            block.style.top = (row + i) * SIZE + "px";
            block.style.left = (col + j) * SIZE + "px";
            block.setAttribute("id", `block${row + i}-${col + j}`);
            document.getElementById("game_board").appendChild(block);
        }
    }
}

//check if Tetromino can move to speaified direction ()
function canTetrominoMove(rowdis, coldis){
    const shape = currentTetromino.shape;
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            let row = currentTetromino.row + i + rowdis;
            let col = currentTetromino.col + j + coldis;
            if(shape[i][j]){
                if(row >= BOARD_HEIGHT || col >= BOARD_WIDTH || col < 0 || (row >= 0 && board[row][col] !== 0)){
                    return false;
                }
            }
        }
    }
    return true;
}

//check if Tetromino can move to speaified direction
function canTetrominoRotate(){
    let borderCheck = false;
    let borderDis = BOARD_WIDTH - rotateShape[0].length;
    let blockCheck = false;
    let overLen = 0;
    let col = currentTetromino.col;
    let row = currentTetromino.row;
    
    for(let i = 0; i < rotateShape.length; i++){
        for(let j = 0; j < rotateShape[i].length; j++){
            if(rotateShape[i][j] && row + i < BOARD_HEIGHT && col + j < BOARD_WIDTH && col + j >= 0
                && (row + i >= 0 && board[row + i][col + j] !== 0)) overLen += 1;
        }
    }  

    for(let i = 0; i < rotateShape.length; i++){
        for(let j = 0; j < rotateShape[i].length; j++){
            if(rotateShape[i][j]){
                if(borderDis < col ) {
                    if(row + i >= BOARD_HEIGHT || (row + i >= 0 && board[row + i][borderDis + j] !== 0)) return false;
                    else borderCheck = true;
                }
                else if(overLen) {
                    if(row + i >= BOARD_HEIGHT || col + j >= BOARD_WIDTH || col + j < 0 || 
                        (row + i >= 0 && board[row + i][col - overLen + j] !== 0)) return false;
                    else blockCheck = true;
                }
                else {
                    if(row + i >= BOARD_HEIGHT || col + j >= BOARD_WIDTH || col + j < 0 || (row + i >= 0 && board[row + i][col + j] !== 0)){
                        return false;
                    }
                }
            }  
        }
    }
    if(borderCheck){
        eraseTetromino();
        currentTetromino.col = borderDis;
    }
    else if(blockCheck){
        eraseTetromino();
        currentTetromino.col = currentTetromino.col - overLen;
    }
    return true;            
}

//lock Tetromino in the place
function lockTetromino(){
    drop.load();
    drop.play();
    const row = currentTetromino.row;
    const col = currentTetromino.col;
    const shape = currentTetromino.shape;
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]){
                board[row + i][col + j] = currentTetromino.color;
            }
        }
    }
    point += clearRow();
    document.querySelector(".point").textContent = point;
    eraseNextTetromino();
    currentTetromino = nextTetrominos[0];
    addNewTetromino();
    moveGhostTetromino();
    drawNextTetromino();
}

//check if any row to be cleard
function clearRow()
{
    let rowCleared = 0;
    for(let y = BOARD_HEIGHT - 1; y >= 0; y--){
        let rowFilled = true;
        for(let j = 0; j < BOARD_WIDTH; j++){
            if(board[y][j] === 0){
                rowFilled = false;
                break;
            }
        }
        if(rowFilled){ 
            breakSound.load();
            breakSound.play();
            rowCleared += 1;
            //向下移位
            for(let i = y; i > 0; i--){
                for(let j = 0; j < BOARD_WIDTH; j++){
                    board[i][j] = board[i-1][j]
                }
            }
            //清空上層
            for(let i = 0; i < BOARD_WIDTH; i++){
                board[0][i] = 0;
            }
            //clear board
            let clearTetrominoes = document.querySelectorAll('[id ^= "block"]');
            for(let i = 0; i < clearTetrominoes.length; i++){
                if(clearTetrominoes[i]) document.getElementById("game_board").removeChild(clearTetrominoes[i]);
            }
            
            //draw board
            for(let i = 0; i < BOARD_HEIGHT; i++){
                for(let j = 0; j < BOARD_WIDTH; j++){
                    if(board[i][j]){
                        let block = document.createElement("div");
                        block.classList.add("block");
                        block.style.backgroundColor = board[i][j];
                        block.style.top =  i * SIZE + "px";
                        block.style.left = j * SIZE + "px";
                        block.setAttribute("id", `block${i}-${j}`);
                        document.getElementById("game_board").appendChild(block);
                    }
                }
            }
            y++;//邏輯重點
        }
    }
    return rowCleared;
}
//rotate the Tetromino and draw
// 010  10
// 111  11
//      10
function rotateTetromino(){
    rotateShape = [];
    for(let i = 0; i < currentTetromino.shape[0].length; i++){
        let array = [];
        for(let j = currentTetromino.shape.length - 1; j >= 0; j--){
            array.push(currentTetromino.shape[j][i])
        }
        rotateShape.push(array);
    }
    if(canTetrominoRotate()){
        eraseTetromino();
        currentTetromino.shape = rotateShape;
        drawTetromino();
        rotateSound.load();
        rotateSound.play();
    }
    moveGhostTetromino();
}

//rotate the Hold Tetromino but don't draw
function rotateHoldTetromino() {
    rotateShape = [];
    for(let i = 0; i < holdTetromino.shape[0].length; i++){
        let array = [];
        for(let j = holdTetromino.shape.length - 1; j >= 0; j--){
            array.push(holdTetromino.shape[j][i])
        }
        rotateShape.push(array);
    }
    holdTetromino.shape = rotateShape;
}

//play the tetris game
function playGame(){
    drawTetromino();
    moveGhostTetromino();
    drawNextTetromino();
    val = setInterval(moveTetromino, 1000);
}



//move the Tetromino
function moveTetromino(direction){
    if(direction === "left"){
        if(canTetrominoMove(0, -1)){
            eraseTetromino();
            currentTetromino.col--;
            drawTetromino();
            moveGhostTetromino();
        }
    }
    else if(direction === "right"){
        if(canTetrominoMove(0, 1)){
            eraseTetromino();
            currentTetromino.col++;
            drawTetromino();
            moveGhostTetromino();
        }
    }
    else {
        if(canTetrominoMove(1, 0)){
            eraseTetromino();
            currentTetromino.row++;
            moveGhostTetromino();
            drawTetromino();
        }
        else {
            lockTetromino();
            if(checkGameOver()) drawOneLineTetromino();
            else drawTetromino();
        }
    }
}

function checkGameOver(){
    if(!canTetrominoMove(0,0)) {
        bgm.loop = false;
        bgm.pause();
        gameOverSound.play();
        eraseGhostTetromino();
        clearInterval(val);
        end = true;
        document.getElementById("fail_board").style.display = "block";
        return true;
    }
    return false;
}

//drop the Tetromino
function dropTetromino(){
    eraseTetromino();
    while(canTetrominoMove(1, 0)){   
        currentTetromino.row++; 
    }
    drawTetromino();
    lockTetromino();
    if(checkGameOver()) drawOneLineTetromino();
    else drawTetromino();
    
}
//swap the Tetromino
function swapTetromino() {
    
    if(Object.keys(holdTetromino).length === 0) {
        holdTetromino = { ...currentTetromino }
        holdTetromino.row = 0;
        holdTetromino.col = 3;
        if(holdTetromino.shape.length > 2) rotateHoldTetromino();
        drawHoldTetromino();
        eraseTetromino();
        eraseGhostTetromino();
        currentTetromino = nextTetrominos[0];
        drawTetromino();
        moveGhostTetromino();
        eraseNextTetromino();
        addNewTetromino();
        drawNextTetromino();
    }
    else {
        nullTetromino = { ...holdTetromino }
        eraseHoldTetromino();
        holdTetromino = { ...currentTetromino };
        holdTetromino.row = 0;
        holdTetromino.col = 3;
        if(holdTetromino.shape.length > 2) rotateHoldTetromino();
        drawHoldTetromino();
        eraseTetromino();
        eraseGhostTetromino();
        currentTetromino = { ...nullTetromino }
        drawTetromino();
        moveGhostTetromino();
    }
}

//add event
document.addEventListener("keydown", handleKeyPress)
function handleKeyPress(event){
    if(end == false) {
        switch(event.keyCode){
            case 16:
                swapTetromino();
                break;
            case 37:
                moveTetromino("left");
                break;
            case 39:
                moveTetromino("right");
                break;
            case 40:
                moveTetromino("down");
                break;
            case 38:
                rotateTetromino();
                break;
            case 32:
                dropTetromino();
                break;
            default:
                break;    
        }
    }
}

//play putton
let playButton = document.getElementById("play_button");
playButton.addEventListener("click", () => {
    document.getElementById("menu").style.display = "none";
    bgm.muted = false;
    bgm.play();
    bgm.loop = true;
    drop.muted = false;
    breakSound.muted = false;
    rotateSound.muted = false;
    gameOverSound.muted = false;
    playGame();
    end = false;
});

//menu botton
let menuButton = document.getElementById("menu_button");
menuButton.addEventListener("click", () => {
    document.getElementById("fail_board").style.display = "none";
    document.getElementById("menu").style.display = "block";
    let clearTetrominoes = document.querySelectorAll('[id ^= "block"]');
    for(let i = 0; i < clearTetrominoes.length; i++){
        if(clearTetrominoes[i]) document.getElementById("game_board").removeChild(clearTetrominoes[i]);
    }
    document.getElementById("hold_board").innerHTML = "";
    document.getElementById("next_board").innerHTML = "";
    document.querySelector(".point").textContent = 0;
    end = true;
    point = 0;
    for(let i = 0; i < BOARD_HEIGHT; i++) {
        board[i] = [];
        for(let j = 0; j < BOARD_WIDTH; j++) {
            board[i][j] = 0;
        }
    }
    currentTetromino = randomTetromino();
    nextTetrominos = [randomTetromino(), randomTetromino(), randomTetromino()];
    holdTetromino = {};
    gameOverSound.load();
    bgm.load();
});

// Draw Ghost tetromino
function drawGhostTetromino(){
    const row = currentGhostTetromino.row;
    const col = currentGhostTetromino.col;
    const shape = currentGhostTetromino.shape;
    const color = "rgba(255, 255, 255, 0.5)";
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]){
                let block = document.createElement("div");
                block.classList.add("ghost");
                block.style.top = (row + i) * SIZE + "px";
                block.style.left = (col + j) * SIZE + "px";
                block.style.backgroundColor = color;
                block.setAttribute("id", `ghost${row+i}-${col+j}`);
                document.getElementById("game_board").appendChild(block);
            }
        }
    }
}

//erase Ghost tetromino
function eraseGhostTetromino(){
    let ghostTetrominoies = document.querySelectorAll(".ghost");
    for(let i = 0; i < ghostTetrominoies.length; i++){
        if(ghostTetrominoies[i]) document.getElementById("game_board").removeChild(ghostTetrominoies[i]);
    }
}

// Check if ghost tetromino can move in the specified direction
function canGhostTetrominoMove(rowdis, coldis){
    const shape = currentGhostTetromino.shape;
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            let row = currentGhostTetromino.row + i + rowdis;
            let col = currentGhostTetromino.col + j + coldis;
            if(shape[i][j]){
                if(row >= BOARD_HEIGHT || col >= BOARD_WIDTH || col < 0 || (row >= 0 && board[row][col] !== 0)){
                    return false;
                }
            }
        }
    }
    return true;
}

//ghost tetromino move
function moveGhostTetromino(){
    currentGhostTetromino = { ...currentTetromino };
    eraseGhostTetromino();
    while(canGhostTetrominoMove(1, 0)){
        currentGhostTetromino.row++;
    }
    drawGhostTetromino();
}
