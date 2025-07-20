let gridSize = 7;
let currentPlayer = 'red';
let board = [];
let headers = {
  top: [],
  left: []
};

function createCustomizationGrid() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("customization-screen").style.display = "block";

  gridSize = parseInt(document.getElementById("grid-size").value);
  const container = document.getElementById("grid-customization");
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${gridSize + 1}, 70px)`;

  for (let row = 0; row <= gridSize; row++) {
    for (let col = 0; col <= gridSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (row === 0 && col === 0) {
        cell.innerText = "";
      } else if (row === 0 || col === 0) {
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.placeholder = "Text";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            cell.innerHTML = '';
            cell.appendChild(img);
          }
        });

        const inputWrapper = document.createElement("div");
        inputWrapper.style.display = "flex";
        inputWrapper.style.flexDirection = "column";
        inputWrapper.appendChild(textInput);
        inputWrapper.appendChild(fileInput);

        cell.appendChild(inputWrapper);

        if (row === 0) headers.top[col - 1] = { text: "", image: null };
        if (col === 0) headers.left[row - 1] = { text: "", image: null };
      }

      container.appendChild(cell);
    }
  }
}

function startGame() {
  document.getElementById("customization-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  board = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  renderGameGrid();
}

function renderGameGrid() {
  const container = document.getElementById("connect4-grid");
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => placeToken(col));
      container.appendChild(cell);
    }
  }
}

function placeToken(col) {
  for (let row = gridSize - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      updateCell(row, col);
      if (checkWin(row, col)) {
        document.getElementById("winner-message").innerText = `${currentPlayer.toUpperCase()} wins!`;
        disableBoard();
      } else {
        currentPlayer = currentPlayer === "red" ? "yellow" : "red";
        document.getElementById("turn-indicator").innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`;
      }
      break;
    }
  }
}

function updateCell(row, col) {
  const cells = document.querySelectorAll("#connect4-grid .cell");
  const index = row * gridSize + col;
  const token = document.createElement("div");
  token.classList.add("token", currentPlayer);
  cells[index].appendChild(token);
}

function checkWin(row, col) {
  return checkDirection(row, col, 1, 0) ||
         checkDirection(row, col, 0, 1) ||
         checkDirection(row, col, 1, 1) ||
         checkDirection(row, col, 1, -1);
}

function checkDirection(row, col, rowDir, colDir) {
  let count = 1;
  count += countTokens(row, col, rowDir, colDir);
  count += countTokens(row, col, -rowDir, -colDir);
  return count >= 4;
}

function countTokens(row, col, rowDir, colDir) {
  let r = row + rowDir;
  let c = col + colDir;
  let count = 0;
  while (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c] === currentPlayer) {
    count++;
    r += rowDir;
    c += colDir;
  }
  return count;
}

function disableBoard() {
  const cells = document.querySelectorAll("#connect4-grid .cell");
  cells.forEach(cell => cell.removeEventListener("click", () => {}));
}

function replayGame() {
  currentPlayer = "red";
  document.getElementById("winner-message").innerText = "";
  renderGameGrid();
  board = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  document.getElementById("turn-indicator").innerText = "Red's Turn";
}

function goBackToMainMenu() {
  document.getElementById("main-menu").style.display = "block";
  document.getElementById("customization-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "none";
}
