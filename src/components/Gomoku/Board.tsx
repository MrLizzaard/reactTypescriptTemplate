import React, { useState } from "react";
import styled from "styled-components";

type Cell = "black" | "white";

const BOARD_SIZE = 15;
const STONE_SIZE = 35; // 돌 크기(px)

export const GomokuBoard = () => {
  const [winner, setWinner] = useState<Cell | null>(null);
  const [winningStones, setWinningStones] = useState<{ x: number; y: number }[] | null>([]);
  const [stones, setStones] = useState<{ x: number; y: number; color: "black" | "white" }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Cell>("black");

  const checkWin = (
    stones: { x: number; y: number; color: "black" | "white" }[],
    x: number,
    y: number,
    color: "black" | "white"
  ): { x: number; y: number }[] | null => {
    const directions = [
      [1, 0], // →
      [0, 1], // ↓
      [1, 1], // ↘
      [1, -1], // ↗
    ];

    for (const [dx, dy] of directions) {
      const line = [{ x, y }];

      for (let dir = -1; dir <= 1; dir += 2) {
        let nx = x + dx * dir;
        let ny = y + dy * dir;

        while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && stones.some((s) => s.x === nx && s.y === ny && s.color === color)) {
          line.push({ x: nx, y: ny });
          nx += dx * dir;
          ny += dy * dir;
        }
      }

      if (line.length >= 5) return line;
    }

    return null;
  };

  const isForbiddenMove = (stones: { x: number; y: number; color: "black" | "white" }[], x: number, y: number): boolean => {
    // 백은 금수 없음
    if (currentPlayer === "white") return false;

    // 임시로 흑돌을 두고 검사
    const testStones: { x: number; y: number; color: "black" | "white" }[] = [...stones, { x, y, color: "black" }];

    const countConsecutive = (dx: number, dy: number) => {
      let count = 1;
      for (let dir = -1; dir <= 1; dir += 2) {
        let nx = x + dx * dir;
        let ny = y + dy * dir;
        while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && testStones.some((s) => s.x === nx && s.y === ny && s.color === "black")) {
          count++;
          nx += dx * dir;
          ny += dy * dir;
        }
      }
      return count;
    };

    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];

    let threeCount = 0;
    let fourCount = 0;

    for (const [dx, dy] of directions) {
      const line = getLine(testStones, x, y, dx, dy);

      const { openThree, openFour } = checkOpenThreeFour(line);
      if (openThree) threeCount++;
      if (openFour) fourCount++;
    }

    const isOverline = directions.some(([dx, dy]) => countConsecutive(dx, dy) >= 6);

    return threeCount >= 2 || fourCount >= 2 || isOverline;
  };

  const getLine = (
    stones: { x: number; y: number; color: "black" | "white" }[],
    x: number,
    y: number,
    dx: number,
    dy: number
  ): ("black" | null)[] => {
    const line: ("black" | null)[] = [];

    for (let i = -4; i <= 4; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (nx < 0 || ny < 0 || nx >= BOARD_SIZE || ny >= BOARD_SIZE) {
        line.push(null);
      } else {
        const stone = stones.find((s) => s.x === nx && s.y === ny);
        line.push(stone?.color === "black" ? "black" : null);
      }
    }

    return line;
  };

  const checkOpenThreeFour = (line: ("black" | null)[]) => {
    const str = line.map((c) => (c === "black" ? "1" : "0")).join("");

    // 열린 3
    const openThreePatterns = [
      /01110/, // 일반 열린3
      /010110/, // 띈3
      /011010/, // 가운데 뚫린 3
      /0101010/, // 점점 어려워지는 띈3
    ];

    // 열린 4
    const openFourPatterns = [
      /011110/, // 일반 열린4
      /0101110/, // 띈4
      /0110110/, // 한 칸 뚫린 4
      /0111010/, // 다른 모양의 띈4
      /01011010/, // 점점 더 어려운 띈4
    ];

    const openThree = openThreePatterns.some((p) => p.test(str));
    const openFour = openFourPatterns.some((p) => p.test(str));

    return { openThree, openFour };
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (winner) return;

    const board = e.currentTarget.getBoundingClientRect();
    const cellWidth = board.width / (BOARD_SIZE - 1);
    const cellHeight = board.height / (BOARD_SIZE - 1);

    const offsetX = e.clientX - board.left;
    const offsetY = e.clientY - board.top;

    const x = Math.round(offsetX / cellWidth);
    const y = Math.round(offsetY / cellHeight);

    // 중복 착수 방지
    if (stones.some((s) => s.x === x && s.y === y)) {
      return;
    }

    if (isForbiddenMove(stones, x, y)) {
      alert("⛔ 렌주룰: 흑은 이 자리에 둘 수 없습니다 (3-3, 4-4, 장목 금지)");
      return;
    }

    const newStones = [...stones, { x, y, color: currentPlayer }];
    setStones(newStones);
    const winningLine = checkWin(newStones, x, y, currentPlayer);

    if (checkWin(newStones, x, y, currentPlayer)) {
      setWinner(currentPlayer);
      setWinningStones(winningLine);
      alert(`🎉 ${currentPlayer === "black" ? "흑" : "백"} 승리!`);
      return;
    }

    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
  };

  const undoLastMove = () => {
    if (stones.length === 0) return;

    const newStones = stones.slice(0, -1);
    setStones(newStones);
    setWinner(null);
    setWinningStones([]);

    const lastColor = stones[stones.length - 1].color;
    setCurrentPlayer(lastColor); // 이전 색으로 되돌리기
  };

  const resetGame = () => {
    setStones([]);
    setWinner(null);
    setWinningStones([]);
    setCurrentPlayer("black");
  };

  return (
    <>
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
      {winner && <RestartButton onClick={resetGame}>🔁 한 판 더!</RestartButton>}

      {!winner && stones.length > 0 && <UndoButton onClick={undoLastMove}>↩️ 되돌리기</UndoButton>}
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
