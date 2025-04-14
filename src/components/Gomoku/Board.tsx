import React from "react";
import styled from "styled-components";
import useGomokuGame from "../../hooks/useGomokuGame";

// type Cell = "black" | "white";

const BOARD_SIZE = 15;
const STONE_SIZE = 35; // 돌 크기(px)

export const GomokuBoard = () => {
  const { stones, currentPlayer, winner, winningStones, handleMove, undo, reset } = useGomokuGame(BOARD_SIZE);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const board = e.currentTarget.getBoundingClientRect();
    const cellSize = board.width / (BOARD_SIZE - 1);
    const x = Math.round((e.clientX - board.left) / cellSize);
    const y = Math.round((e.clientY - board.top) / cellSize);

    handleMove(x, y);
  };
  return (
    <>
      <div>현재 차례: {currentPlayer}</div>
      <div style={{ position: "relative", width: "680px", height: "680px", margin: "0 auto", backgroundColor: "#deb887", paddingTop: "20px" }}>
        <Board onClick={handleClick}>
          {stones.map((stone, idx) => (
            <Stone
              key={idx}
              x={stone.x}
              y={stone.y}
              className={stone.color}
              isWinning={winningStones?.some((w) => w.x === stone.x && w.y === stone.y)}
            />
          ))}
        </Board>
      </div>
      {winner && <RestartButton onClick={reset}>🔁 한 판 더!</RestartButton>}

      {!winner && stones.length > 0 && <UndoButton onClick={undo}>↩️ 되돌리기</UndoButton>}
    </>
  );
};

const Board = styled.div`
  position: relative;
  width: 600px;
  height: 600px;
  margin: 20px auto;
  background-color: #deb887;
  background-image: linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px);
  background-size: calc(100% / (${BOARD_SIZE - 1})) calc(100% / (${BOARD_SIZE - 1}));
  border: 2px solid #000;
  cursor: pointer;
`;

const Stone = styled.div<{ x: number; y: number; isWinning?: boolean }>`
  position: absolute;
  width: ${STONE_SIZE}px;
  height: ${STONE_SIZE}px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  top: ${({ y }) => `calc(${(100 / (BOARD_SIZE - 1)) * y}%)`};
  left: ${({ x }) => `calc(${(100 / (BOARD_SIZE - 1)) * x}%)`};
  background-color: ${({ className }) => (className === "black" ? "black" : "white")};
  border: ${({ className, isWinning }) => (isWinning ? "3px solid red" : className === "white" ? "1px solid #ccc" : "none")};
  z-index: 1;
`;

const RestartButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #2e8b57;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #246b45;
  }
`;

const UndoButton = styled.button`
  display: block;
  margin: 10px auto;
  padding: 8px 16px;
  background-color: #444;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #222;
  }
`;
