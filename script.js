let gridSize = 7;
let currentPlayer = 'red';
let board = [];
let customGridData = [];

function $(id) {
  return document.getElementById(id);
}

function showCustomization() {
  gridSize = parseInt($('grid-size').value);
  $('main-menu').classList.add('hidden');
  $('customization-screen').classList.remove('hidden');

  const grid = $('custom-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

  customGridData = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({ type: null, value: null }))
  );

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.placeholder = 'Text';
      textInput.oninput = () => {
        customGridData[r][c] = { type: 'text', value: textInput.value };
      };

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            customGridData[r][c] = { type: 'image', value: reader.result };
            updatePreview(cell, r, c);
          };
          reader.readAsDataURL(file);
        }
      };

      cell.appendChild(textInput);
      cell.appendChild(fileInput);
      grid.appendChild(cell);
    }
  }
}

function updatePreview(cell, r, c) {
  cell.innerHTML = '';
  const img = document.createElement('img');
  img.src = customGridData[r][c].value;
  img.className = 'uploaded';
  cell.appendChild(img);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => {
    customGridData[r][c] = { type: null, value: null };
    showCustomization();
  };
  cell.appendChild(removeBtn);
}

function startGame() {
  $('customization-screen').classList.add('hidden');
  $('game-screen').classList.remove('hidden');
  $('turn-indicator').textContent = "Red Team's Turn";
  $('winner-message').textContent = '';

  board = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  const gameBoard = $('game-board');
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const content = customGridData[r][c];
      if (content.type === 'text') {
        const span = document.createElement('span');
        span.textContent = content.value;
        cell.appendChild(span);
      } else if (content.type === 'image') {
        const img = document.createElement('img');
        img.src = content.value;
        img.className = 'uploaded';
        cell.appendChild(img);
      }

      cell.onclick = () => placeToken(r, c, cell);
      gameBoard.appendChild(cell);
    }
  }
}

function placeToken(r, c, cell) {
  if (board[r][c]) return;
  board[r][c] = currentPlayer;

  const token = document.createElement('div');
  token.className = `token ${currentPlayer}`;
  cell.appendChild(token);

  if (checkWin(r, c)) {
    $('winner-message').textContent = `${capitalize(currentPlayer)} Team Wins!`;
    document.querySelectorAll('#game-board .cell').forEach(cell => cell.onclick = null);
    return;
  }

  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  $('turn-indicator').textContent = `${capitalize(currentPlayer)} Team's Turn`;
}

function checkWin(row, col) {
  return checkDirection(row, col, 1, 0) || checkDirection(row, col, 0, 1) ||
         checkDirection(row, col, 1, 1) || checkDirection(row, col, 1, -1);
}

function checkDirection(r, c, dr, dc) {
  let count = 1;
  count += countTokens(r, c, dr, dc);
  count += countTokens(r, c, -dr, -dc);
  return count >= 4;
}

function countTokens(r, c, dr, dc) {
  let i = 1, count = 0;
  while (true) {
    const nr = r + dr * i;
    const nc = c + dc * i;
    if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize || board[nr][nc] !== currentPlayer) break;
    count++; i++;
  }
  return count;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function replayGame() {
  startGame();
}

function goToMenu() {
  $('main-menu').classList.remove('hidden');
  $('customization-screen').classList.add('hidden');
  $('game-screen').classList.add('hidden');
}
