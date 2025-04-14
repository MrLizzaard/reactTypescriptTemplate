// utils/renjuRule.ts
type Stone = { x: number; y: number; color: "black" | "white" };

export const isForbiddenMove = (stones: Stone[], x: number, y: number, currentPlayer: "black" | "white", boardSize: number): boolean => {
  if (currentPlayer === "white") return false;

  const testStones: { x: number; y: number; color: "black" | "white" }[] = [...stones, { x, y, color: "black" }];
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  let threeCount = 0;
  let fourCount = 0;

  const countConsecutive = (dx: number, dy: number) => {
    let count = 1;
    for (let dir = -1; dir <= 1; dir += 2) {
      let nx = x + dx * dir;
      let ny = y + dy * dir;
      while (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && testStones.some((s) => s.x === nx && s.y === ny && s.color === "black")) {
        count++;
        nx += dx * dir;
        ny += dy * dir;
      }
    }
    return count;
  };

  const isOverline = directions.some(([dx, dy]) => countConsecutive(dx, dy) >= 6);

  for (const [dx, dy] of directions) {
    const line = getLine(testStones, x, y, dx, dy, boardSize);
    const { openThree, openFour } = checkOpenThreeFour(line);
    if (openThree) threeCount++;
    if (openFour) fourCount++;
  }

  return threeCount >= 2 || fourCount >= 2 || isOverline;
};

const getLine = (stones: Stone[], x: number, y: number, dx: number, dy: number, boardSize: number): ("black" | null)[] => {
  const line: ("black" | null)[] = [];
  for (let i = -4; i <= 4; i++) {
    const nx = x + dx * i;
    const ny = y + dy * i;
    if (nx < 0 || ny < 0 || nx >= boardSize || ny >= boardSize) {
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

  const openThreePatterns = [/01110/, /010110/, /011010/, /0101010/];

  const openFourPatterns = [/011110/, /0101110/, /0110110/, /0111010/, /01011010/];

  const openThree = openThreePatterns.some((p) => p.test(str));
  const openFour = openFourPatterns.some((p) => p.test(str));

  return { openThree, openFour };
};
