const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const gridContainer = document.getElementById("grid-container");
const turnIndicator = document.getElementById("turn-indicator");
const winnerMessage = document.getElementById("winner-message");

let grid = [];
let currentPlayer = "red";
const ROWS = 7;
const COLS = 7;

// Generate customizer inputs
const topInputs = document.getElementById("top-inputs");
const sideInputs = document.getElementById("side-inputs");

for (let i = 0; i < COLS; i++) {
  const input = document.createElement("input");
  input.placeholder = `Top ${i + 1}`;
  input.value = `Team${i + 1}`;
  topInputs.appendChild(input);
}

for (let i = 0; i < ROWS; i++) {
  const input = document.createElement("input");
  input.placeholder = `Side ${i + 1}`;
  input.value = `Team${i + 1}`;
  sideInputs.appendChild(input);
}

// Start game
document.getElementById("start-btn").onclick = () => {
  menuScreen.style.display = "none";
  gameScreen.style.display = "block";
  startGame();
};

document.getElementById("back-btn").onclick = () => {
  gameScreen.style.display = "none";
  menuScreen.style.display = "block";
  winnerMessage.textContent = "";
};

document.getElementById("replay-btn").onclick = () => {
  startGame();
  winnerMessage.textContent = "";
};

// Main game setup
function startGame() {
  currentPlayer = "red";
  turnIndicator.textContent = "Current Turn: 🔴 Red";
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  gridContainer.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", handleCellClick);
      gridContainer.appendChild(cell);
    }
  }
}

// Click handler
function handleCellClick(e) {
  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;

  if (grid[row][col] !== null || winnerMessage.textContent !== "") return;

  grid[row][col] = currentPlayer;
  e.target.classList.add(currentPlayer);
  e.target.textContent = currentPlayer === "red" ? "🔴" : "🟡";

  if (checkWinner(row, col)) {
    winnerMessage.textContent = `${currentPlayer === "red" ? "🔴 Red" : "🟡 Yellow"} Wins!`;
    return;
  }

  currentPlayer = currentPlayer === "red" ? "yellow" : "red";
  turnIndicator.textContent = `Current Turn: ${currentPlayer === "red" ? "🔴 Red" : "🟡 Yellow"}`;
}

// Winner checking
function checkWinner(row, col) {
  const directions = [
    [[0, 1], [0, -1]],       // horizontal
    [[1, 0], [-1, 0]],       // vertical
    [[1, 1], [-1, -1]],      // diagonal down-right
    [[1, -1], [-1, 1]]       // diagonal up-right
  ];

  for (let dir of directions) {
    let count = 1;

    for (let [dr, dc] of dir) {
      let r = row + dr;
      let c = col + dc;

      while (
        r >= 0 && r < ROWS &&
        c >= 0 && c < COLS &&
        grid[r][c] === currentPlayer
      ) {
        count++;
        r += dr;
        c += dc;
      }
    }

    if (count >= 4) return true;
  }

  return false;
}
