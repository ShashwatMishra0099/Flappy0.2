document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const gameOverDisplay = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again');

    let birdY;
    let birdVelocity = 0;
    const gravity = 0.2;
    let isGameOver = false;
    let score = 0;
    let gameStarted = false;

    function resetBirdPosition() {
        birdY = gameContainer.clientHeight / 2;
        bird.style.top = `${birdY}px`;
    }

    function startGame() {
        gameStarted = true;
        isGameOver = false;
        gameOverDisplay.classList.add('hidden');
        resetBirdPosition();
        birdVelocity = 0;
        score = 0;
        scoreDisplay.innerText = score;
        document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());
        document.addEventListener('keydown', jump);
        document.addEventListener('click', jump);
        gameLoop = setInterval(update, 25); // Slowing down the game loop
        pipeInterval = setInterval(createPipe, 4000); // Increase interval to make pipes appear less frequently
    }

    function jump() {
        if (!gameStarted) {
            startGame();
        } else {
            birdVelocity = -7; // Less jump power
        }
    }

    document.addEventListener('keydown', jump);
    document.addEventListener('click', jump);
    playAgainButton.addEventListener('click', startGame);

    function createPipe() {
        if (isGameOver) return;
        const pipeTop = document.createElement('div');
        const pipeBottom = document.createElement('div');
        pipeTop.classList.add('pipe', 'pipe-top');
        pipeBottom.classList.add('pipe', 'pipe-bottom');

        const pipeGap = 150;
        const pipeHeight = Math.random() * (gameContainer.clientHeight - pipeGap - 200) + 100;

        pipeTop.style.height = `${pipeHeight}px`;
        pipeBottom.style.height = `${gameContainer.clientHeight - pipeHeight - pipeGap}px`;

        pipeTop.style.left = `${gameContainer.clientWidth}px`;
        pipeBottom.style.left = `${gameContainer.clientWidth}px`;

        gameContainer.appendChild(pipeTop);
        gameContainer.appendChild(pipeBottom);

        function movePipe() {
            if (isGameOver) return;
            const pipes = document.querySelectorAll('.pipe');
            pipes.forEach(pipe => {
                let pipeLeft = parseInt(window.getComputedStyle(pipe).getPropertyValue('left'));
                pipeLeft -= 1; // Slowing down the pipe movement
                pipe.style.left = `${pipeLeft}px`;

                if (pipeLeft <= -60) {
                    pipe.remove();
                    score++;
                    scoreDisplay.innerText = score;
                }

                if (
                    pipeLeft < bird.getBoundingClientRect().left + bird.clientWidth &&
                    pipeLeft + 60 > bird.getBoundingClientRect().left &&
                    (
                        pipe.classList.contains('pipe-top') &&
                        pipe.getBoundingClientRect().bottom > bird.getBoundingClientRect().top ||
                        pipe.classList.contains('pipe-bottom') &&
                        pipe.getBoundingClientRect().top < bird.getBoundingClientRect().bottom
                    )
                ) {
                    gameOver();
                }
            });
        }

        setInterval(movePipe, 30); // Slowing down the pipe movement interval
    }

    function gameOver() {
        isGameOver = true;
        clearInterval(gameLoop);
        clearInterval(pipeInterval);
        document.removeEventListener('keydown', jump);
        document.removeEventListener('click', jump);
        gameOverDisplay.classList.remove('hidden');
        finalScoreDisplay.innerText = `Score: ${score}`;
    }

    function update() {
        if (isGameOver || !gameStarted) return;
        birdVelocity += gravity;
        birdY += birdVelocity;
        bird.style.top = `${birdY}px`;

        if (birdY + bird.clientHeight >= gameContainer.clientHeight || birdY <= 0) {
            gameOver();
        }
    }

    let gameLoop;
    let pipeInterval;
});
