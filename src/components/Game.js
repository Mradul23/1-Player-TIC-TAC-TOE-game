// src/components/Game.js
import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import "../styles/styles.css";

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState("X");
  const [movesHistory, setMovesHistory] = useState([]);
  const squaresRef = useRef(squares);
  const [winningLine, setWinningLine] = useState(null);

  useEffect(() => {
    squaresRef.current = squares;
  }, [squares]);

  useEffect(() => {
    // Trigger computer move when it's the computer's turn
    if (!winner && !isXNext && playerSymbol === "O") {
      handleComputerMove();
    }
  }, [isXNext, winner, playerSymbol]);
  // Add a new state for winning line

  useEffect(() => {
    const result = calculateWinner(squares);
    console.log(result)
    if (result) {
      setWinner(squares[result[0]]);
      setWinningLine(result);
    } else if (squares.every((square) => square !== null)) {
      setWinner("Draw");
    }
  }, [squares]);


  useEffect(() => {
    // Trigger computer move when player symbol changes
    if (!winner && !isXNext && playerSymbol === "O") {
      handleComputerMove(); 
    }
  }, [playerSymbol, winner, isXNext]);

  const handleClick = async (index) => {
    if (winner || squares[index]) {
      return;
    }

    const newSquares = [...squares];
    newSquares[index] = playerSymbol;

    // Update squaresRef.current immediately after setSquares
    squaresRef.current = newSquares;

    setSquares((prevSquares) => {
      setMovesHistory([...movesHistory, prevSquares]);
      return newSquares;
    });

    // Trigger computer move after player's move
    if (!winner) {
      await handleComputerMove();
    }
  };

  const handleComputerMove = async () => {
    try {
      const response = await fetch(
        "https://hiring-react-assignment.vercel.app/api/bot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(squaresRef.current),
        }
      );

      const data = await response.json();
      const computerMove = data && data !== "undefined" ? data : null;

      if (
        computerMove !== null &&
        squaresRef.current[computerMove] === null
      ) {
        const updatedSquares = [...squaresRef.current];
        // Switch symbol based on the first player's symbol
        updatedSquares[computerMove] = playerSymbol === "X" ? "O" : "X";
        setSquares(updatedSquares);
        setIsXNext(true);
        setMovesHistory([...movesHistory, updatedSquares]);
      }
    } catch (error) {
      console.error("Error fetching computer move:", error);
    }
  };

  const calculateWinner = (currentSquares) => {
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

    for (const line of lines) {
      const [a, b, c] = line;
      if (
        currentSquares[a] &&
        currentSquares[a] === currentSquares[b] &&
        currentSquares[a] === currentSquares[c]
      ) {
        return line; 
      }
    }

    return null;
  };


  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);

    // Reset moves history to an empty array
    setMovesHistory([]);
    // Reset player symbol to 'X'
    setPlayerSymbol("X");
  };

  return (
    <div className="game">
      <div className="game-board">
        <div>
          <label>
            Choose your symbol:
            <select
              value={playerSymbol}
              onChange={(e) => setPlayerSymbol(e.target.value)}
            >
              <option value="X"> X </option>
              <option value="O"> O </option>
            </select>
          </label>
        </div>
        <Board
          squares={squares}
          onClick={handleClick}
          winningSquares={winningLine}
        />
      </div>
      <div className="game-info">
        <div className="game-winner">
          {winner
            ? `Winner: ${winner}`
            : `Next player: ${isXNext ? "X" : "O"}`}
        </div>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
};

export default Game;
