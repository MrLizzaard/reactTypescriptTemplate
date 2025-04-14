// hooks/useGomokuGame.ts
import { useState } from "react";
import { isForbiddenMove } from "../utils/renjuRules";

const useGomokuGame = (BOARD_SIZE: number) => {
  const [stones, setStones] = useState<{ x: number; y: number; color: "black" | "white" }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"black" | "white">("black");
  const [winner, setWinner] = useState<"black" | "white" | null>(null);
  const [winningStones, setWinningStones] = useState<{ x: number; y: number }[]>([]);

  const handleMove = (x: number, y: number) => {
    if (stones.some((s) => s.x === x && s.y === y)) return;
    if (winner) return;

    if (isForbiddenMove(stones, x, y, currentPlayer, BOARD_SIZE)) {
      alert("⛔ 렌주룰 금수입니다");
      return;
    }

    const newStones = [...stones, { x, y, color: currentPlayer }];
    setStones(newStones);

    const line = checkWin(newStones, x, y, currentPlayer);
    if (line) {
      setWinner(currentPlayer);
      setWinningStones(line);

      alert(`${currentPlayer} 승리`);
      return;
    }

    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
  };

  const checkWin = (
    stones: { x: number; y: number; color: "black" | "white" }[],
    x: number,
    y: number,
    color: "black" | "white"
  ): { x: number; y: number }[] | null => {
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
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

  const undo = () => {
    if (stones.length === 0) return;
    const last = stones[stones.length - 1];
    setStones(stones.slice(0, -1));
    setWinner(null);
    setWinningStones([]);
    setCurrentPlayer(last.color);
  };

  const reset = () => {
    setStones([]);
    setCurrentPlayer("black");
    setWinner(null);
    setWinningStones([]);
  };

  return {
    stones,
    currentPlayer,
    winner,
    winningStones,
    handleMove,
    undo,
    reset,
  };
};

export default useGomokuGame;
