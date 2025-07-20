
let gridSize = 7;
let gridData = [];
let currentPlayer = 'red';
let boardState = [];

function createCustomGrid() {
  gridSize = parseInt(document.getElementById('grid-size').value);
  gridData = Array(gridSize).fill().map(() => Array(gridSize).fill({text: '', image: ''}));
  const grid = document.getElementById('custom-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize + 1}, 60px)`;
  grid.style.gridTemplateRows = `repeat(${gridSize + 1}, 60px)`;

  for (let row = 0; row <= gridSize; row++) {
    for (let col = 0; col <= gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('custom-cell');

      if (row === 0 && col === 0) {
        cell.innerHTML = '';
      } else if (row === 0 || col === 0) {
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = 'Text';
        textInput.onchange = () => {
          if (row === 0) gridData[0][col-1].text = textInput.value;
          if (col === 0) gridData[row-1][0].text = textInput.value;
        };

        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'image/*';
        imageInput.onchange = (e) => {
          const reader = new FileReader();
          reader.onload = function(event) {
            if (row === 0) gridData[0][col-1].image = event.target.result;
            if (col === 0) gridData[row-1][0].image = event.target.result;
          };
          reader.readAsDataURL(e.target.files[0]);
        };

        const container = document.createElement('div');
        container.appendChild(textInput);
        container.appendChild(imageInput);
        cell.appendChild(container);
      }

      grid.appendChild(cell);
    }
  }

  document.getElementById('main-menu').classList.add('hidden');
  document.getElementById('customization-screen').classList.remove('hidden');
}

function startGame() {
  document.getElementById('customization-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('turn-indicator').innerText = "Red's Turn";
  currentPlayer = 'red';
  boardState = Array(gridSize).fill().map(() => Array(gridSize).fill(null));

  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.onclick = () => placeToken(row, col, cell);
      board.appendChild(cell);
    }
  }
}

function placeToken(row, col, cell) {
  if (boardState[row][col] !== null) return;

  const token = document.createElement('div');
  token.classList.add(currentPlayer === 'red' ? 'token-red' : 'token-yellow');
  cell.appendChild(token);
  boardState[row][col] = currentPlayer;

  if (checkWinner(row, col)) {
    document.getElementById('game-result').innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Wins!`;
    return;
  }

  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  document.getElementById('turn-indicator').innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`;
}

function checkWinner(row, col) {
  const directions = [
    [[0,1],[0,-1]], [[1,0],[-1,0]], [[1,1],[-1,-1]], [[1,-1],[-1,1]]
  ];

  for (const [[dx1,dy1],[dx2,dy2]] of directions) {
    let count = 1;
    count += countTokens(row, col, dx1, dy1);
    count += countTokens(row, col, dx2, dy2);
    if (count >= 4) return true;
  }
  return false;
}

function countTokens(row, col, dx, dy) {
  let count = 0;
  let r = row + dx;
  let c = col + dy;
  while (r >= 0 && c >= 0 && r < gridSize && c < gridSize && boardState[r][c] === currentPlayer) {
    count++;
    r += dx;
    c += dy;
  }
  return count;
}

function replayGame() {
  startGame();
  document.getElementById('game-result').innerText = '';
}

function backToMenu() {
  document.getElementById('main-menu').classList.remove('hidden');
  document.getElementById('customization-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.add('hidden');
}
