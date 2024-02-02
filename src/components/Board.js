// src/components/Board.js
import React from 'react';
import Square from './Square';
import '../styles/styles.css';

const Board = ({ squares, onClick, winningSquares }) => (
  <div className="board">
    {squares.map((value, index) => {
      const isWinningSquare = winningSquares && winningSquares.includes(index);
      return (
        <Square
          key={index}
          value={value}
          onClick={() => onClick(index)}
          isWinningSquare={isWinningSquare}
        />
      );
    })}
  </div>
);

export default Board;
