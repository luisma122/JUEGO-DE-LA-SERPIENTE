// =========================
// CONFIGURACIONES DEL JUEGO
// =========================
let canvas, ctx;
let snake, direction, apple;
let score = 0;
const targetScore = 200;
let size = 20;
let gameInterval;
let speed = 120;
let boardSize = 400;
let isPaused = false;

// =========================
// INICIO DEL JUEGO
// =========================
function startGame() {
  boardSize = parseInt(document.getElementById("sizeSelect").value);

  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  canvas.width = boardSize;
  canvas.height = boardSize;

  snake = [{ x: 5, y: 5 }];
  direction = "RIGHT";
  score = 0;

  updateScore();

  document.getElementById("menu").style.display = "none";
  document.getElementById("instructions").style.display = "none";
  document.getElementById("hud").style.display = "flex";
  document.getElementById("gameWrap").style.display = "flex";

  placeApple();

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

// =========================
// ACTUALIZAR PUNTAJE
// =========================
function updateScore() {
  document.getElementById("scoreDisplay").innerText = "Puntaje: " + score;
}

// =========================
// COLOCAR MANZANA
// =========================
function placeApple() {
  apple = {
    x: Math.floor(Math.random() * (boardSize / size)),
    y: Math.floor(Math.random() * (boardSize / size))
  };
}

// =========================
// BUCLE PRINCIPAL DEL JUEGO
// =========================
function gameLoop() {
  if (isPaused) return;

  const head = { ...snake[0] };

  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;

  // Colisiones con paredes
  if (head.x < 0 || head.y < 0 || head.x >= boardSize / size || head.y >= boardSize / size) {
    gameOver();
    return;
  }

  // Colisiones con el cuerpo
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Comer manzana
  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    updateScore();

    if (score >= targetScore) {
      winGame();
      return;
    }

    placeApple();
  } else {
    snake.pop();
  }

  draw();
}

// =========================
// DIBUJAR TODO
// =========================
function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * size, apple.y * size, size, size);

  ctx.fillStyle = "#0f0";
  snake.forEach(part => {
    ctx.fillRect(part.x * size, part.y * size, size - 1, size - 1);
  });
}

// =========================
// MANEJO DE TECLAS (PC)
// =========================
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// =========================
// BOTONES TÁCTILES (CORREGIDO)
// =========================
function registerButton(id, dir) {
  document.getElementById(id).addEventListener("touchstart", e => {
    e.preventDefault();
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
    if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  }, { passive: false });
}

registerButton("btnUp", "UP");
registerButton("btnDown", "DOWN");
registerButton("btnLeft", "LEFT");
registerButton("btnRight", "RIGHT");

// =========================
// CONTROL POR SWIPE (MÓVIL)
// =========================
let startX, startY;

canvas.addEventListener("touchstart", e => {
  let t = e.changedTouches[0];
  startX = t.clientX;
  startY = t.clientY;
});

canvas.addEventListener("touchend", e => {
  let t = e.changedTouches[0];
  let dx = t.clientX - startX;
  let dy = t.clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < -30 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 30 && direction !== "UP") direction = "DOWN";
    else if (dy < -30 && direction !== "DOWN") direction = "UP";
  }
});

// =========================
// PAUSA
// =========================
document.getElementById("pauseBtn").onclick = () => {
  isPaused = !isPaused;
};

// =========================
// REINICIAR
// =========================
document.getElementById("restartBtn").onclick = startGame;

// =========================
// SALIR
// =========================
document.getElementById("exitBtn").onclick = () => location.reload();

// =========================
// MODALES
// =========================
function gameOver() {
  clearInterval(gameInterval);
  document.getElementById("loseModal").style.display = "flex";
}

function winGame() {
  clearInterval(gameInterval);
  document.getElementById("winModal").style.display = "flex";
}

document.getElementById("loseRestart").onclick = startGame;
document.getElementById("loseExit").onclick = () => location.reload();

document.getElementById("winRestart").onclick = startGame;
document.getElementById("winExit").onclick = () => location.reload();

// =========================
// NAVEGACIÓN MENÚ
// =========================
document.getElementById("playBtn").onclick = startGame;
document.getElementById("instBtn").onclick = () => {
  document.getElementById("menu").style.display = "none";
  document.getElementById("instructions").style.display = "flex";
};
document.getElementById("backBtn").onclick = () => {
  document.getElementById("instructions").style.display = "none";
  document.getElementById("menu").style.display = "flex";
};
