// Customize your grid teams here
const topTeams = ["Carlton", "Collingwood", "Geelong", "Richmond"];
const sideTeams = ["Essendon", "Hawthorn", "Melbourne", "Sydney"];

const container = document.getElementById("grid-container");
const rows = sideTeams.length + 1;
const cols = topTeams.length + 1;

container.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

// Build grid
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
        if (!cell.classList.contains("filled")) {
          const confirmToken = confirm("Confirm placing a token here?");
          if (confirmToken) {
            cell.textContent = "✔";
            cell.classList.add("filled");
          }
        }
      });
    }

    container.appendChild(cell);
  }
}
