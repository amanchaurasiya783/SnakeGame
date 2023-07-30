//Game Constants
let lastPaintTime = 0;
let snakeSpeed = 10;
const gameBoard = document.querySelector('#gameContainer');
const scoreBox = document.querySelector('#scoreBox');
let inputDirection = {x: 1, y: 0};
let lastInputDirection = inputDirection;
let score = 0;
const snakeEXPANTION = 1;
const snakeBody = [{x: 1, y:20},];
let food = getRandomFood();


//Game Functions

function paint(cTime){
    let time = (cTime - lastPaintTime)/1000;
    requestAnimationFrame(paint);
    if((1/snakeSpeed) > time) return;
    lastPaintTime = cTime;
    
    update();
    draw();
}

window.requestAnimationFrame(paint);

function draw(){
    drawSnake();
    drawFood();
}

function update(){
    gameBoard.innerHTML = "";
    snakeMove();
    snakeEatFood();
}


function drawSnake(){
    snakeBody.forEach((segment, index)=>{
        let snakeElement = document.createElement("div");
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.style.gridRowStart = segment.y;
        // snakeElement.style.transform = "rotate(0deg)";
        if(index  == 0){
            snakeElement.classList.add("snakeHead", "body");
            snakeElement.setAttribute('id', 'pixel:'+index+1);
            // if(inputDirection.x == 1){}
            // else if(inputDirection.x == -1){}
            // else if(inputDirection.y == -1){}
            // else if(inputDirection.y == 1){}
        }else{
            snakeElement.classList.add("snakeBodyPixel", "body");
            snakeElement.setAttribute('id', 'pixel:'+index+1);
        }
        gameBoard.appendChild(snakeElement);
    });
}

function drawFood(){
        let foodElement = document.createElement("div");
        foodElement.style.gridColumnStart = food.x;
        foodElement.style.gridRowStart = food.y;
        foodElement.classList.add("food", "body");
        foodElement.setAttribute('id', 'pixel:'+1);
        gameBoard.appendChild(foodElement);
}


function snakeMove(){
    inputDirection = getInputDirection();
    if(inputDirection.x != 0 || inputDirection.y != 0){
        for(i=snakeBody.length-2; i >=0; i--){
            snakeBody[i+1] = {...snakeBody[i]};
        }
    }
    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
    checkGameOver();
}

function getInputDirection(){
    window.addEventListener(`keydown`, e=>{

        switch (e.key) {
            case 'ArrowUp':    
                if(lastInputDirection.y == 1) break;
                inputDirection = {x: 0, y: -1};
                break;
            case 'ArrowRight':
                if(lastInputDirection.x == -1) break;
                inputDirection = {x: 1, y: 0}
                break;
            case 'ArrowDown':
                if(lastInputDirection.y == -1) break;
                inputDirection = {x: 0, y: 1}
                break;
            case 'ArrowLeft':
                if(lastInputDirection.x == 1) break;
                inputDirection = {x: -1, y: 0}
                break;
            case 'Space':
                inputDirection = {x: 0, y: 0}
                break;
            default: inputDirection = { x : 0, y : 0};
        }
    })
    lastInputDirection = inputDirection;
    return inputDirection;
}

function snakeEatFood(){
    if(isEat()){
        score += 10;
        scoreBox.innerHTML = score;
        food = getRandomFood();
        expandSnake();
        // snakeSpeed += 0.5;
    }
}

function isEat(){
    return snakeBody[0].x === food.x && snakeBody[0].y === food.y;
}

function getRandomFood(){
    let a, b, myCondition = true;
    while(myCondition){
        a = Math.ceil(Math.random()*40);
        b = Math.ceil(Math.random()*40);
        myCondition = snakeBody.some(segment=>{
            return (segment.x === a && segment.y === b)
        })
    }
    return {x : a, y : b};
}

function expandSnake(){
    for(i=0; i<snakeEXPANTION; i++){
        snakeBody.push(snakeBody[snakeBody.length-1]);
    }
}

function checkGameOver(){
    if(snakeOutOfGrid() || snakeIntersection()){
        location.reload();
        alert("Game Over : Your Score : "+score);
    }
}

function snakeOutOfGrid(){
    return snakeBody[0].x < 0 || snakeBody[0].x > 40 || snakeBody[0].y < 0 || snakeBody[0].y > 40;
}

function snakeIntersection(){
    for(i=1; i<snakeBody.length; i++){
        if(snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y){
            return true;
        }
    }
}