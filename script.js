const topTeams = ["Carlton", "Collingwood", "Geelong", "Richmond"];
const sideTeams = ["Essendon", "Hawthorn", "Melbourne", "Sydney"];

let currentPlayer = 1; // 1 = Red, 2 = Yellow

const container = document.getElementById("grid-container");
const turnIndicator = document.getElementById("turn-indicator");

const rows = sideTeams.length + 1;
const cols = topTeams.length + 1;

container.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

// Build the grid
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");

    if (r === 0 && c === 0) {
      cell.textContent = "";
      cell.className = "label";
    } else if (r === 0) {
      cell.textContent = topTeams[c - 1];
      cell.className = "label";
    } else if (c === 0) {
      cell.textContent = sideTeams[r - 1];
      cell.className = "label";
    } else {
      cell.className = "cell";
      cell.addEventListener("click", () => {
        if (!cell.classList.contains("red") && !cell.classList.contains("yellow")) {
          const confirmPlace = confirm("Confirm placing a token here?");
          if (confirmPlace) {
            if (currentPlayer === 1) {
              cell.classList.add("red");
              cell.textContent = "🔴";
              currentPlayer = 2;
              turnIndicator.textContent = "Current Turn: 🟡 Player 2";
            } else {
              cell.classList.add("yellow");
              cell.textContent = "🟡";
              currentPlayer = 1;
              turnIndicator.textContent = "Current Turn: 🔴 Player 1";
            }
          }
        }
      });
    }

    container.appendChild(cell);
  }
}
