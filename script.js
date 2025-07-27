let gridSize = 7;
let currentPlayer = "red";
let board = [];
let lockCells = [];
let timer;
let timerLength = 60;
let timerPaused = false;
let enableTimer = false;
let savedCustomGrid = null;

function showCustomization() {for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    const cell = document.createElement("div");
    cell.classList.add("custom-cell-wrapper");

    if (row === 0 || col === 0) {
      // These cells are customizable
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Text";

      const file = document.createElement("input");
      file.type = "file";
      file.accept = "image/*";

      const selector = document.createElement("select");
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Choose AFL Club";
      selector.appendChild(defaultOption);

      aflClubs.forEach(club => {
        const option = document.createElement("option");
        option.value = `logos/${club}.png`;
        option.text = club.charAt(0).toUpperCase() + club.slice(1);
        selector.appendChild(option);
      });

      const randomBtn = document.createElement("button");
      randomBtn.textContent = "🎲 Random";
      randomBtn.type = "button";
      randomBtn.style.fontSize = "10px";
      randomBtn.addEventListener("click", () => {
        const randomClub = aflClubs[Math.floor(Math.random() * aflClubs.length)];
        selector.value = `logos/${randomClub}.png`;
        input.value = "";
        file.value = "";
      });

      cell.appendChild(input);
cell.appendChild(file);
cell.appendChild(selector);

// 🆕 Add randomize button
const randomBtn = document.createElement("button");
randomBtn.textContent = "🎲 Random";
randomBtn.type = "button";
randomBtn.style.fontSize = "10px";
randomBtn.addEventListener("click", () => {
  const randomClub = aflClubs[Math.floor(Math.random() * aflClubs.length)];
  selector.value = `logos/${randomClub}.png`;
  input.value = "";
  file.value = "";
});
cell.appendChild(randomBtn);

    } else {
      // Empty cell for the game board — no customization
      cell.classList.add("non-editable");
    }

    wrapper.appendChild(cell);
  }
}

  }

  if (savedCustomGrid) {
    document.getElementById("custom-grid-wrapper").innerHTML = savedCustomGrid;
  }
}

function goToMenu() {
  document.getElementById("customization-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
}

function clearGrid() {
  savedCustomGrid = null;
  showCustomization();
}

function saveGrid() {
  savedCustomGrid = document.getElementById("custom-grid-wrapper").innerHTML;
}

function startGame() {
  document.getElementById("customization-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  document.getElementById("winner-message").textContent = "";
  document.getElementById("turn-indicator").textContent = "Red Team's Turn";

  currentPlayer = "red";
  board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, auto)`;

  const wrappers = document.querySelectorAll(".custom-cell-wrapper");
  wrappers.forEach((wrapper, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const input = wrapper.querySelector("input[type='text']").value;
    const file = wrapper.querySelector("input[type='file']").files[0];

    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("uploaded");
        cell.appendChild(img);
        lockCells.push(`${row}-${col}`);
      };
      reader.readAsDataURL(file);
    } else if (input) {
      const span = document.createElement("span");
      span.textContent = input;
      span.style.color = "black";
      cell.appendChild(span);
      lockCells.push(`${row}-${col}`);
    } else {
      cell.addEventListener("click", () => handleMove(row, col, cell));
    }

    gameBoard.appendChild(cell);
  });

  if (enableTimer) {
    document.getElementById("timer-display").classList.remove("hidden");
    startTimer();
  } else {
    document.getElementById("timer-display").classList.add("hidden");
  }
}

function handleMove(row, col, cellDiv) {
  if (board[row][col] || lockCells.includes(`${row}-${col}`)) return;

  board[row][col] = currentPlayer;
  const token = document.createElement("div");
  token.classList.add("token", currentPlayer);
  cellDiv.appendChild(token);

  if (checkWinner(row, col)) {
    showWin();
    return;
  }

  if (isDraw()) {
    document.getElementById("winner-message").textContent = "It's a Draw!";
    return;
  }

  switchPlayer();
}

function switchPlayer() {
  currentPlayer = currentPlayer === "red" ? "yellow" : "red";
  document.getElementById("turn-indicator").textContent = `${capitalize(currentPlayer)} Team's Turn`;
  if (enableTimer && !timerPaused) {
    resetTimer();
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function checkWinner(row, col) {
  const directions = [
    [0, 1], [1, 0], [1, 1], [-1, 1]
  ];

  for (let [dx, dy] of directions) {
    let cells = [[row, col]];
    cells = cells.concat(findDirection(row, col, dx, dy));
    cells = cells.concat(findDirection(row, col, -dx, -dy));
    if (cells.length >= 4) {
      highlightWinningCells(cells);
      return true;
    }
  }
  return false;
}

function findDirection(row, col, dx, dy) {
  let cells = [];
  let r = row + dx;
  let c = col + dy;
  while (
    r >= 0 && r < gridSize &&
    c >= 0 && c < gridSize &&
    board[r][c] === currentPlayer
  ) {
    cells.push([r, c]);
    r += dx;
    c += dy;
  }
  return cells;
}

function highlightWinningCells(cells) {
  const gameBoard = document.getElementById("game-board").children;
  cells.forEach(([r, c]) => {
    const index = r * gridSize + c;
    const cell = gameBoard[index];
    if (cell) {
      cell.classList.add("winning");
    }
  });
}

function showWin() {
  document.getElementById("winner-message").textContent = `${capitalize(currentPlayer)} Team Wins!`;
  clearInterval(timer);
}

function isDraw() {
  return board.flat().filter((x) => !x).length === 0;
}

function replayGame() {
  startGame();
}

function startTimer() {
  let time = timerLength;
  document.getElementById("timer-display").textContent = time;
  timer = setInterval(() => {
    if (!timerPaused) {
      time--;
      document.getElementById("timer-display").textContent = time;
      if (time <= 0) {
        clearInterval(timer);
        switchPlayer();
        startTimer();
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function togglePauseTimer() {
  timerPaused = !timerPaused;
}

function wrongAnswer() {
  switchPlayer();
}
