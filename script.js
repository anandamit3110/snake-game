// Basic Snake Game Implementation

// Select the canvas and set up the context
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

// Adjust canvas dimensions
canvas.width = 480; // Increased by 20%
canvas.height = 480; // Increased by 20%

// Game variables
const cellSize = 20;
let snake = [{ x: 200, y: 200 }]; // Initial snake position
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let gameInterval;

// Add functionality for speed slider and buttons
let gameSpeed = 150; // Default speed
const speedSlider = document.getElementById('speed-slider');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
let isPaused = false;

// Add functionality for the 'End Game' button
const endButton = document.getElementById('end-button');
endButton.addEventListener('click', endGame);

// Add countdown timer functionality
const countdownDiv = document.getElementById('countdown');

// Add background music functionality
const backgroundMusic = new Audio('assets/background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Set default volume

// Ensure background music is off by default
backgroundMusic.pause();
backgroundMusic.currentTime = 0;

// Add functionality for the music toggle button
const musicToggleButton = document.getElementById('music-toggle');

musicToggleButton.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggleButton.textContent = 'Switch Off Music'; // Update button text
    } else {
        backgroundMusic.pause();
        musicToggleButton.textContent = 'Switch On Music'; // Update button text
    }
});

// Draw an idle cartoonish snake in the initial state
function drawIdleSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    const idleSnake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];
    idleSnake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
        if (index === 0) {
            // Draw eyes on the head
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(segment.x + 5, segment.y + 5, 3, 0, Math.PI * 2);
            ctx.arc(segment.x + 15, segment.y + 5, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'green';
        }
    });
}

// Ensure the drawGame function is called during initialization
window.onload = () => {
    speedSlider.value = (parseInt(speedSlider.max) + parseInt(speedSlider.min)) / 2; // Center the slider
    gameSpeed = 350 - parseInt(speedSlider.value); // Set initial speed based on the centered slider
    drawIdleSnake(); // Draw the idle snake
    drawGame(); // Draw the checkerboard background and initial state
};

// Modify the countdown animation
function startCountdown(callback) {
    let countdown = 3;
    const colors = ['red', 'blue', 'yellow'];
    countdownDiv.style.display = 'block';
    countdownDiv.style.position = 'absolute';
    countdownDiv.style.width = `${canvas.width}px`;
    countdownDiv.style.height = `${canvas.height}px`;
    countdownDiv.style.display = 'flex';
    countdownDiv.style.justifyContent = 'center';
    countdownDiv.style.alignItems = 'center';
    countdownDiv.style.fontSize = '5rem';
    countdownDiv.style.fontWeight = 'bold';

    const countdownInterval = setInterval(() => {
        countdownDiv.textContent = countdown;
        countdownDiv.style.color = colors[countdown - 1];
        countdownDiv.style.transform = 'scale(1)';
        countdownDiv.style.transition = 'transform 0.5s';
        setTimeout(() => {
            countdownDiv.style.transform = 'scale(2)';
        }, 100);

        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownDiv.style.display = 'none';
            callback(); // Start the game after countdown
        }
    }, 1000);
}

// Correct the slider logic to ensure extreme left corresponds to minimum speed and extreme right to maximum speed
speedSlider.addEventListener('input', (e) => {
    const sliderValue = parseInt(e.target.value);
    gameSpeed = 350 - sliderValue; // Adjust speed dynamically based on slider position
});

// Start the game when the start button is clicked or Enter is pressed
startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startGame();
    }
});

// Pause or resume the game when the pause button is clicked or Spacebar is pressed
pauseButton.addEventListener('click', togglePause);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        togglePause();
    }
});

// Fix the togglePause function to resume the game without resetting
function togglePause() {
    console.log('Toggle Pause triggered'); // Debugging log
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = 'Pause Game'; // Change button text back to 'Pause Game'
        gameInterval = setInterval(() => {
            updateSnake();
            drawGame();
        }, gameSpeed); // Resume the game without resetting
        console.log('Game resumed'); // Debugging log
    } else {
        isPaused = true;
        pauseButton.textContent = 'Resume Game'; // Change button text to 'Resume Game'
        clearInterval(gameInterval); // Pause the game
        console.log('Game paused'); // Debugging log
    }
}

// Generate random food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
        y: Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize
    };
}

// Load the apple image for food
const appleImage = new Image();
appleImage.src = 'assets/apple.png';

// Modify the drawFood function to use the apple image
function drawFood() {
    if (appleImage.complete) {
        ctx.drawImage(appleImage, food.x, food.y, cellSize, cellSize);
    } else {
        appleImage.onload = () => {
            ctx.drawImage(appleImage, food.x, food.y, cellSize, cellSize);
        };
    }
}

// Update the drawSnake function to make the snake look cartoonish
function drawSnake() {
    snake.forEach((segment, index) => {
        // Draw rounded body
        ctx.fillStyle = 'green'; // Snake body color
        ctx.beginPath();
        ctx.arc(segment.x + cellSize / 2, segment.y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes on the head segment
        if (index === 0) {
            ctx.fillStyle = 'white'; // Eye color
            const eyeRadius = cellSize / 6;
            const eyeOffset = cellSize / 4;

            // Left eye
            ctx.beginPath();
            ctx.arc(segment.x + eyeOffset, segment.y + eyeOffset, eyeRadius, 0, Math.PI * 2);
            ctx.fill();

            // Right eye
            ctx.beginPath();
            ctx.arc(segment.x + cellSize - eyeOffset, segment.y + eyeOffset, eyeRadius, 0, Math.PI * 2);
            ctx.fill();

            // Pupils
            ctx.fillStyle = 'darkblue'; // Pupil color

            // Left pupil
            ctx.beginPath();
            ctx.arc(segment.x + eyeOffset, segment.y + eyeOffset, eyeRadius / 2, 0, Math.PI * 2);
            ctx.fill();

            // Right pupil
            ctx.beginPath();
            ctx.arc(segment.x + cellSize - eyeOffset, segment.y + eyeOffset, eyeRadius / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Update the score display outside the canvas
function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;
}

// Load the sound effect for when the snake eats food
const eatSound = new Audio('assets/Swallow_Sound.mp4');

// Modify the updateSnake function to gradually increase the snake's speed
function updateSnake() {
    console.log('Updating snake position'); // Debugging log
    const head = { ...snake[0] };

    // Move the head in the current direction
    switch (direction) {
        case 'UP':
            head.y -= cellSize;
            break;
        case 'DOWN':
            head.y += cellSize;
            break;
        case 'LEFT':
            head.x -= cellSize;
            break;
        case 'RIGHT':
            head.x += cellSize;
            break;
    }

    // Check for collisions with walls or itself
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        alert('Game Over!');
        return;
    }

    // Add the new head to the snake
    snake.unshift(head);

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore(); // Update the score display
        food = generateFood();
        eatSound.play(); // Play the eating sound

        // Gradually increase the speed
        gameSpeed = Math.max(50, gameSpeed - 10); // Decrease interval time to increase speed
        clearInterval(gameInterval); // Clear the current interval
        gameInterval = setInterval(() => {
            console.log('Game loop iteration after speed increase'); // Debugging log
            updateSnake();
            drawGame();
        }, gameSpeed); // Restart the game loop with the new speed
    } else {
        // Remove the tail if no food is eaten
        snake.pop();
    }
}

// Remove the score display inside the canvas
function drawGame() {
    console.log('Drawing game state'); // Debugging log
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
    });

    // Draw the food
    drawFood();
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') direction = 'DOWN';
            break;
        case 'ArrowLeft':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
    }
});

// Reset the snake and game variables when restarting the game
function resetGame() {
    console.log('Resetting game state'); // Debugging log
    snake = [{ x: 200, y: 200 }]; // Reset snake to initial position
    direction = 'RIGHT'; // Reset direction
    food = generateFood(); // Generate new food position
    score = 0; // Reset score
    gameSpeed = parseInt(speedSlider.value); // Use the slider's value for initial speed
    console.log('Game state reset complete', { snake, direction, food, score, gameSpeed }); // Debugging log
}

// Modify the game loop to adjust speed dynamically
function startGame() {
    console.log('Start Game triggered'); // Debugging log
    if (isPaused) return; // Do not start a new interval if the game is paused

    resetGame(); // Reset the game state before starting
    console.log('Game state reset'); // Debugging log

    backgroundMusic.play(); // Start playing background music
    console.log('Background music started'); // Debugging log

    // Use the selected speed from the slider
    clearInterval(gameInterval); // Clear any existing interval
    startCountdown(() => {
        console.log('Countdown completed, starting game loop'); // Debugging log
        gameInterval = setInterval(() => {
            console.log('Game loop iteration'); // Debugging log
            updateSnake();
            drawGame();
        }, gameSpeed);
    });
}

// Define the endGame function
function endGame() {
    console.log('End Game triggered'); // Debugging log
    clearInterval(gameInterval); // Stop the game loop
    backgroundMusic.pause(); // Pause the background music
    backgroundMusic.currentTime = 0; // Reset the music to the beginning
    score = 0; // Reset the score
    updateScore(); // Update the score display
    alert('Game Over!'); // Notify the user that the game has ended
}