let gridSize = 7;
let currentPlayer = 'red';
let gameData = [];
let topLabels = [];
let leftLabels = [];

function $(id) {
  return document.getElementById(id);
}

function startCustomization() {
  gridSize = parseInt($('grid-size').value);
  $('main-menu').classList.add('hidden');
  $('customization').classList.remove('hidden');

  const grid = $('custom-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `100px repeat(${gridSize}, 100px)`;
  grid.style.gridTemplateRows = `repeat(${gridSize + 1}, 100px)`;

  topLabels = [];
  leftLabels = [];

  // First row (empty + top labels)
  grid.appendChild(document.createElement('div')); // top-left corner empty
  for (let c = 0; c < gridSize; c++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell grid-label';
    const input = document.createElement('input');
    input.placeholder = 'Text or image';
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = 'image/*';
    file.onchange = (e) => previewImage(e, cell);
    cell.appendChild(input);
    cell.appendChild(file);
    grid.appendChild(cell);
    topLabels.push({ textInput: input, fileInput: file });
  }

  // Rows (left labels + blanks)
  for (let r = 0; r < gridSize; r++) {
    const labelCell = document.createElement('div');
    labelCell.className = 'grid-cell grid-label';
    const input = document.createElement('input');
    input.placeholder = 'Text or image';
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = 'image/*';
    file.onchange = (e) => previewImage(e, labelCell);
    labelCell.appendChild(input);
    labelCell.appendChild(file);
    grid.appendChild(labelCell);
    leftLabels.push({ textInput: input, fileInput: file });

    for (let c = 0; c < gridSize; c++) {
      const blank = document.createElement('div');
      blank.className = 'grid-cell';
      grid.appendChild(blank);
    }
  }
}

function previewImage(event, container) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      container.innerHTML = `<img src="${e.target.result}" class="thumb"/>`;
    };
    reader.readAsDataURL(file);
  }
}

function startGame() {
  $('customization').classList.add('hidden');
  $('game').classList.remove('hidden');

  $('turn-indicator').innerText = "Red's Turn";
  currentPlayer = 'red';
  gameData = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  const grid = $('game-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'game-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => placeToken(r, c, cell));
      grid.appendChild(cell);
    }
  }
}

function placeToken(row, col, cell) {
  if (gameData[row][col]) return;

  gameData[row][col] = currentPlayer;

  const token = document.createElement('div');
  token.className = `token ${currentPlayer}`;
  cell.appendChild(token);

  if (checkWin(row, col)) {
    $('result').innerText = `${capitalize(currentPlayer)} Wins!`;
    document.querySelectorAll('.game-cell').forEach(cell => cell.removeEventListener('click', () => {}));
    return;
  }

  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  $('turn-indicator').innerText = `${capitalize(currentPlayer)}'s Turn`;
}

function checkWin(r, c) {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];
  for (let [dr, dc] of directions) {
    let count = 1;
    count += countDirection(r, c, dr, dc);
    count += countDirection(r, c, -dr, -dc);
    if (count >= 4) return true;
  }
  return false;
}

function countDirection(r, c, dr, dc) {
  let count = 0;
  let i = 1;
  while (true) {
    const nr = r + dr * i;
    const nc = c + dc * i;
    if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize || gameData[nr][nc] !== currentPlayer) break;
    count++;
    i++;
  }
  return count;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function restartGame() {
  startGame();
  $('result').innerText = '';
}

function goToMenu() {
  $('main-menu').classList.remove('hidden');
  $('customization').classList.add('hidden');
  $('game').classList.add('hidden');
}
