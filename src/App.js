import { useState } from "react";

function Square({ customClassName, value, onSquareClick }) {
  return (
    <button onClick={onSquareClick} className={"square " + customClassName}>
      {value}
    </button>
  );
}

export function Board({ xIsNext, squares, onPlay, coordinates }) {
  const winnerObj = calculateWinner(squares);
  const squareLoop = Array(3).fill([]);
  let count = 0;
  let status;
  if (winnerObj?.winner) {
    status = "Winner " + winnerObj?.winner;
  } else if (squares?.every((val) => val !== null)) {
    status = "You played a draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)?.winner) {
      return;
    }
    const nextSqaures = [...squares];
    const nextCoordinates = [...coordinates];
    nextSqaures[i] = xIsNext ? "X" : "O";
    nextCoordinates[i] = { label: nextSqaures[i], value: i };
    onPlay(nextSqaures, nextCoordinates[i]);
  };

  return (
    <>
      <div className="tatis">{status}</div>
      {squareLoop.map((el, index) => {
        return (
          <div key={index} className="board-row">
            {squareLoop.map((el, i) => {
              count = count + 1;
              const customKey = count - 1;
              return (
                <Square
                  customClassName={
                    winnerObj?.winnerSquares?.includes(customKey) ? "green" : ""
                  }
                  key={customKey}
                  onSquareClick={() => handleClick(customKey)}
                  value={squares[customKey]}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [coordinates, setCoordinates] = useState([]);
  const [coordinatesHistory, setCoordinatesHistory] = useState([[]]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sort, setSort] = useState("asc");
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = (nextSquares, coordObj) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextCoordinates = [
      ...coordinates.slice(0, currentMove + 1),
      coordObj,
    ];
    setCoordinatesHistory([...coordinatesHistory, nextCoordinates]);
    setCurrentMove(nextHistory.length - 1);
    setHistory(nextHistory);
    setCoordinates(nextCoordinates);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
    setCoordinates(coordinatesHistory[nextMove]);
  };

  const handleSorting = () => {
    setSort(sort === "asc" ? "desc" : "asc");
  };

  const calcValue = (val) => {
    const positions = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 3, col: 1 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
    ];

    return positions[val];
  };

  const moves = history.map((squares, move) => {
    let description;

    if (move === 0 && move === currentMove) {
      description = "Game start";
    } else if (move === currentMove) {
      description = "You are at move # " + (move + 1);
    } else {
      description = "Go to move # " + (move + 1);
      if (coordinates[move]?.label) {
        description =
          description +
          ` | VAL: ${coordinates[move]?.label} | ROW: ${
            calcValue(coordinates[move]?.value)?.row
          } | COL: ${calcValue(coordinates[move]?.value)?.col}`;
      }
    }
    return (
      <li key={move}>
        <button
          className={move === currentMove ? "green" : ""}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          coordinates={coordinates}
        />
      </div>
      <div className="game-info">
        <button onClick={handleSorting}>Sorting "{sort.toUpperCase()}"</button>
        <ol>{sort === "asc" ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerSquares: [a, b, c] };
    }
  }
  return null;
}
