const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const retryBtn = document.getElementById("retryBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreText = document.getElementById("finalScore");

let blocks, currentBlock, direction, speed, score, gameOver;
let cameraY = 0;

// High score
let highScore = localStorage.getItem("highScore") || 0;
highScoreText.textContent = "Record: " + highScore;

function initGame() {
  blocks = [];
  direction = 1;
  speed = 3;
  score = 0;
  gameOver = false;
  cameraY = 0;

  blocks.push({
    x: 150,
    y: 550,
    width: 100,
    height: 20
  });

  newBlock();
  scoreText.textContent = "Score: 0";
  gameOverScreen.classList.add("hidden");
}

function newBlock() {
  currentBlock = {
    x: 0,
    y: -20,
    width: blocks[blocks.length - 1].width,
    height: 20,
    falling: false
  };
}

function update() {
  if (gameOver) return;

  if (!currentBlock.falling) {
    currentBlock.x += speed * direction;

    if (currentBlock.x + currentBlock.width > canvas.width || currentBlock.x < 0) {
      direction *= -1;
    }
  } else {
    currentBlock.y += 8; // caída
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, cameraY);

  // Bloques
  blocks.forEach(b => {
    ctx.fillStyle = "#00eaff";
    ctx.fillRect(b.x, b.y, b.width, b.height);

    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 10;
  });

  // Bloque actual
  ctx.fillStyle = "#ff4c4c";
  ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);

  ctx.restore();
}

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

    // mover cámara
    if (blocks.length > 6) {
      cameraY += 20;
    }

    newBlock();
  }, 200);
}

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

document.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    dropBlock();
  }
});

retryBtn.addEventListener("click", initGame);

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

initGame();
gameLoop();