// Configuración inicial
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.85;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let score = 0;
let balloons = [];
let startTime = Date.now();
let gameOver = false;

// Velocidad de los globos constante
const balloonSpeed = 2;

// Mostrar el mensaje de inicio
function showStartMessage() {
    const startMessage = document.createElement("div");
    startMessage.className = "start-message";
    startMessage.textContent = "Consigue 200 puntos y gana la partida";
    document.body.appendChild(startMessage);
    setTimeout(() => {
        startMessage.remove();
        startTime = Date.now(); // Iniciar el tiempo después del mensaje de inicio
        gameLoop();
    }, 3000);
}

function showWinningMessage() {
    const winMessage = document.createElement("div");
    winMessage.className = "has-ganado";
    winMessage.textContent = "¡Has ganado!";
    document.body.appendChild(winMessage);
    gameOver = true;
    setTimeout(() => {
        winMessage.remove();
        canvas.addEventListener("click", resetGame, { once: true });
    }, 3000);
}

// Reiniciar el juego
function resetGame() {
    score = 0;
    balloons = [];
    startTime = Date.now();
    gameOver = false;
    showStartMessage();
}

// Crear un globo
function createBalloon() {
    const radius = Math.floor(Math.random() * 20) + 20;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = canvas.height + radius;
    const color = getRandomColor();
    return { x, y, radius, color };
}

// Mover el globo hacia arriba
function moveBalloon(balloon) {
    balloon.y -= balloonSpeed;
}

// Generar un color aleatorio para el globo
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Dibujar un globo
function drawBalloon(balloon) {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
        balloon.x - balloon.radius / 4, balloon.y - balloon.radius / 4, balloon.radius / 6,
        balloon.x, balloon.y, balloon.radius
    );
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, balloon.color);
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Dibujar la puntuación
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Puntos: ${score}`, canvas.width - 120, 30);
}

// Dibujar el tiempo transcurrido
function drawTime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Tiempo: ${minutes}:${seconds}`, 10, 30);
}

// Comprobar si el jugador ha ganado
function checkWin() {
    if (score >= 200) {
        gameOver = true;
        const winMessage = document.createElement("div");
        winMessage.className = "has-ganado";
        winMessage.textContent = "¡Has ganado!";
        document.body.appendChild(winMessage);
    }
}

// Bucle principal del juego
function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.02) {
        balloons.push(createBalloon());
    }

    balloons.forEach((balloon, index) => {
        moveBalloon(balloon);
        drawBalloon(balloon);

        if (balloon.y + balloon.radius < 0) {
            balloons.splice(index, 1);
            score = Math.max(0, score - 1);
        }
    });

    drawScore();
    drawTime();
    checkWin();
    requestAnimationFrame(gameLoop);
}

// Manejar el clic en los globos
canvas.addEventListener("click", (event) => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    balloons.forEach((balloon, index) => {
        const distX = Math.abs(clickX - balloon.x);
        const distY = Math.abs(clickY - balloon.y);
        if (distX <= balloon.radius && distY <= balloon.radius) {
            score += 3;
            balloons.splice(index, 1);
        }
    });
});

showStartMessage();