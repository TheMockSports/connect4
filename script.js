let gridSize = 7;
let gridData = [];
let currentPlayer = 'red';
let gameBoard = [];
let isGameActive = true;

function createCustomGrid() {
  gridSize = parseInt(document.getElementById('grid-size').value);
  gridData = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  const container = document.getElementById('custom-grid');
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const div = document.createElement('div');
      div.className = 'cell';
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Text or Image URL';
      div.appendChild(input);
      container.appendChild(div);
    }
  }

  container.classList.remove('hidden');
  document.getElementById('start-game-btn').classList.remove('hidden');
}

function startGame() {
  const inputs = document.querySelectorAll('#custom-grid input');
  let index = 0;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const val = inputs[index++].value;
      if (val.match(/\.(jpeg|jpg|gif|png)$/)) {
        gridData[row][col] = { type: 'img', content: val };
      } else {
        gridData[row][col] = { type: 'text', content: val };
      }
    }
  }
  renderGameBoard();
}

function renderGameBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
  gameBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const div = document.createElement('div');
      div.className = 'cell';
      div.dataset.row = row;
      div.dataset.col = col;
      div.onclick = () => placeToken(col);

      const cellData = gridData[row][col];
      if (cellData) {
        if (cellData.type === 'img') {
          const img = document.createElement('img');
          img.src = cellData.content;
          div.appendChild(img);
        } else {
          div.textContent = cellData.content;
        }
      }

      board.appendChild(div);
    }
  }

  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('custom-grid').classList.add('hidden');
  document.getElementById('start-game-btn').classList.add('hidden');
  document.getElementById('game-board').classList.remove('hidden');
  document.getElementById('game-status').classList.remove('hidden');
  document.getElementById('replay-btn').classList.remove('hidden');
  document.getElementById('main-menu-btn').classList.remove('hidden');
  updateGameStatus();
}

function placeToken(col) {
  if (!isGameActive) return;
  for (let row = gridSize - 1; row >= 0; row--) {
    if (!gameBoard[row][col]) {
      gameBoard[row][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      const token = document.createElement('div');
      token.className = `token ${currentPlayer}`;
      cell.appendChild(token);

      if (checkWin(row, col)) {
        document.getElementById('game-status').innerText = `${currentPlayer.toUpperCase()} team wins!`;
        isGameActive = false;
        return;
      }

      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      updateGameStatus();
      return;
    }
  }
}

function updateGameStatus() {
  if (isGameActive) {
    document.getElementById('game-status').innerText = `${currentPlayer.toUpperCase()}'s turn`;
  }
}

function checkWin(row, col) {
  return (
    checkDirection(row, col, 0, 1) + checkDirection(row, col, 0, -1) >= 3 ||
    checkDirection(row, col, 1, 0) + checkDirection(row, col, -1, 0) >= 3 ||
    checkDirection(row, col, 1, 1) + checkDirection(row, col, -1, -1) >= 3 ||
    checkDirection(row, col, 1, -1) + checkDirection(row, col, -1, 1) >= 3
  );
}

function checkDirection(row, col, dRow, dCol) {
  let count = 0;
  let r = row + dRow;
  let c = col + dCol;
  while (r >= 0 && r < gridSize && c >= 0 && c < gridSize && gameBoard[r][c] === currentPlayer) {
    count++;
    r += dRow;
    c += dCol;
  }
  return count;
}

function replayGame() {
  renderGameBoard();
  isGameActive = true;
  currentPlayer = 'red';
  updateGameStatus();
}

function goToMainMenu() {
  location.reload();
}