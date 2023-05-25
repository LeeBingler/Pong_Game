const gameBoard = document.querySelector('#gameBoard');
const resetBtn = document.querySelector('#resetBtn');
const scoreText = document.querySelector('#scoreText');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const ctx = gameBoard.getContext('2d');

const boardBg = 'darkGreen';
const player1Color = 'blue';
const player2Color = 'red';
const ballColor = 'yellow';
const borderColor = 'black';
const ballRadius = 12.5;
const paddleSpeed = 50;

let player1Score = 0;
let player2Score = 0;
let xBall = gameWidth / 2;
let yBall = gameHeight / 2;
let speedBall = 1;
let ballYDirection;
let ballXDirection;
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
};
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: 0
};
let tickGame = 10;
let intervalID;

resetBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', movePaddle);

gameStart();

function gameStart() {
    running = true;
    updateScore();
    createBall();
    drawPaddles();
    nextTick();
};

function nextTick() {
    intervalID = setTimeout(() => {
        clearBoard();
        moveBall();
        checkCollision();
        drawPaddles();
        drawBall();
        nextTick();
    }, tickGame);
}

function clearBoard() {
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    speedBall = 1;
    updateScore();
    xBall = gameWidth / 2;
    yBall = gameHeight / 2;
    paddle1.x = 0;
    paddle1.y = 0;
    paddle2.x = gameWidth - 25;
    paddle2.y = 0;

    updateScore();
    clearInterval(intervalID);
    gameStart();
};

function drawBall() {
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(xBall, yBall, ballRadius, 0 , 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
};

function drawPaddlePlayer1() {
    ctx.fillStyle = player1Color;
    ctx.stokeStyle = borderColor;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
};

function drawPaddlePlayer2() {
    ctx.fillStyle = player2Color;
    ctx.stokeStyle = borderColor;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};

function drawPaddles() {
    drawPaddlePlayer1();
    drawPaddlePlayer2();
};


function movePaddle1Up() {
    if (paddle1.y > 0)
        paddle1.y -= paddleSpeed;
}

function movePaddle1Down() {
    if (paddle1.y < gameHeight - paddle1.height)
        paddle1.y += paddleSpeed;
}

function movePaddle2Up() {
    if (paddle2.y > 0)
        paddle2.y -= paddleSpeed;
}


function movePaddle2Down() {
    if (paddle2.y < gameHeight - paddle2.height)
        paddle2.y += paddleSpeed;
}

function movePaddle(event) {
    const keyPressed = event.keyCode;

    const UP = 38;
    const DOWN = 40;
    const Z = 90;
    const S = 83;

    switch(true) {
    case (keyPressed === UP):
        movePaddle2Up();
        break;
    case (keyPressed === DOWN):
        movePaddle2Down();
        break;
    case (keyPressed === Z):
        movePaddle1Up();
        break;
    case (keyPressed === S):
        movePaddle1Down();
        break;
    }
}

function createBall() {
    speedBall = 1;
    if (Math.round(Math.random()) == 1)
        ballXDirection = 1;
    else
        ballXDirection = -1;

    if (Math.round(Math.random()) == 1)
        ballYDirection = 1;
    else
        ballYDirection = -1;

    xBall = gameWidth / 2;
    yBall = gameHeight / 2;

    drawBall();
}

function moveBall() {
    xBall += (speedBall * ballXDirection);
    yBall += (speedBall * ballYDirection);
}

function checkCollisionBorderMap() {
    if (yBall <= 0 + ballRadius)
        ballYDirection *= -1;
    if (yBall >= gameHeight - ballRadius)
        ballYDirection *= -1;

    if (xBall <= 0) {
        player2Score += 1;
        updateScore()
        createBall();
        return ;
    }
    if (xBall >= gameWidth) {
        player1Score += 1;
        updateScore()
        createBall();
        return ;
    }
}

function checkCollisionPaddles() {
    if (xBall <= (paddle1.x + paddle1.width + ballRadius)) {
        if (yBall > paddle1.y && yBall < paddle1.y + paddle1.height) {
            xBall = (paddle1.x + paddle1.width) + ballRadius;
            ballXDirection *= -1;
            speedBall += 2;
        }
    }

    if (xBall >= (paddle2.x - ballRadius)) {
        if (yBall > paddle2.y && yBall < paddle2.y + paddle2.height) {
            xBall = paddle2.x - ballRadius;
            ballXDirection *= -1;
            speedBall += 1;
        }
    }
}

function checkCollision() {
    checkCollisionBorderMap();
    checkCollisionPaddles();
}
