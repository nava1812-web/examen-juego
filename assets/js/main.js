const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const retryBtn = document.getElementById("retryBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScore");

let blocks, currentBlock, direction, speed, score, gameOver;
let cameraY = 0;

// 🔥 Ajustar canvas dinámicamente
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Record
let highScore = localStorage.getItem("highScore") || 0;
highScoreText.textContent = "Record: " + highScore;

// Inicializar juego
function initGame() {
  blocks = [];
  direction = 1;
  speed = 3;
  score = 0;
  gameOver = false;
  cameraY = 0;

  blocks.push({
    x: canvas.width * 0.3,
    y: canvas.height - 40,
    width: canvas.width * 0.4,
    height: 25
  });

  newBlock();
  scoreText.textContent = "Score: 0";
  gameOverScreen.classList.add("hidden");
}

// Nuevo bloque
function newBlock() {
  let last = blocks[blocks.length - 1];

  currentBlock = {
    x: (canvas.width - last.width) / 2,
    y: last.y - 25,
    width: last.width,
    height: 25,
    falling: false
  };
}

// Update
function update() {
  if (gameOver) return;

  if (!currentBlock.falling) {
    currentBlock.x += speed * direction;

    if (currentBlock.x + currentBlock.width > canvas.width || currentBlock.x < 0) {
      direction *= -1;
    }
  } else {
    currentBlock.y += 4;
  }
}

// Draw estilo 2D
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, cameraY);

  blocks.forEach(b => {
    ctx.fillStyle = "#00eaff";
    ctx.fillRect(b.x, b.y, b.width, b.height);

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(b.x, b.y + b.height - 4, b.width, 4);

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(b.x, b.y, b.width, 4);
  });

  ctx.fillStyle = "#ff4c4c";
  ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, 4);

  ctx.restore();
}

// Drop
function dropBlock() {
  if (gameOver) return;

  currentBlock.falling = true;

  setTimeout(() => {
    let last = blocks[blocks.length - 1];

    let overlap = Math.min(
      currentBlock.x + currentBlock.width,
      last.x + last.width
    ) - Math.max(currentBlock.x, last.x);

    if (overlap <= 0) {
      endGame();
      return;
    }

    currentBlock.width = overlap;
    currentBlock.x = Math.max(currentBlock.x, last.x);
    currentBlock.y = last.y - currentBlock.height;

    blocks.push({ ...currentBlock });

    score++;
    scoreText.textContent = "Score: " + score;

    if (score % 3 === 0) speed += 0.5;

    if (blocks.length > 5) {
      cameraY += 25;
    }

    newBlock();
  }, 200);
}

// Game Over
function endGame() {
  gameOver = true;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreText.textContent = "Record: " + highScore;
  }

  finalScoreText.textContent = "Puntaje: " + score;
  gameOverScreen.classList.remove("hidden");
}

// Eventos
document.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    dropBlock();
  }
});

retryBtn.addEventListener("click", initGame);

// Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start
initGame();
gameLoop();