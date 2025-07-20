import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [customizing, setCustomizing] = useState(true);
  const [gridData, setGridData] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));

  const handleCellChange = (row, col, type, content) => {
    const newGrid = [...gridData];
    newGrid[row][col] = { type, content };
    setGridData(newGrid);
  };

  const handleFileUpload = (row, col, file) => {
    const reader = new FileReader();
    reader.onload = () => {
      handleCellChange(row, col, 'image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1>Connect 4 Sports Trivia</h1>
      {customizing ? (
        <div>
          <h2>Customize Your Grid</h2>
          <div className="grid" style={{ gridTemplateColumns: `repeat(7, 60px)` }}>
            {gridData.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div className="cell" key={\`\${rowIndex}-\${colIndex}\`}>
                  {cell?.type === 'image' ? (
                    <img src={cell.content} alt="cell" />
                  ) : cell?.type === 'text' ? (
                    <span>{cell.content}</span>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Text"
                    onChange={(e) =>
                      handleCellChange(rowIndex, colIndex, 'text', e.target.value)
                    }
                    style={{ position: 'absolute', top: 0, width: '55px' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(rowIndex, colIndex, e.target.files[0])
                    }
                    style={{ position: 'absolute', bottom: 0, width: '55px' }}
                  />
                </div>
              ))
            )}
          </div>
          <button onClick={() => setCustomizing(false)}>Play Game</button>
        </div>
      ) : (
        <div>
          <h2>Game On! Yellow's Turn</h2>
          <div className="grid" style={{ gridTemplateColumns: `repeat(7, 60px)` }}>
            {gridData.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div className="cell" key={\`\${rowIndex}-\${colIndex}\`}>
                  {cell?.type === 'image' ? (
                    <img src={cell.content} alt="cell" />
                  ) : cell?.type === 'text' ? (
                    <span>{cell.content}</span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
