// utils/renjuRule.ts
type Stone = { x: number; y: number; color: "black" | "white" };
type Color = "black" | "white" | null;

export const isForbiddenMove = (stones: Stone[], x: number, y: number, currentPlayer: "black" | "white", boardSize: number): boolean => {
  // https://github.com/saroro1/omoklib/blob/main/src/Omok/OmokMain.js
  // 참고

  // 백은 금수 없음
  if (currentPlayer === "white") return false;

  // 착수 지점 추가
  const testStones: { x: number; y: number; color: "black" | "white" }[] = [...stones, { x, y, color: "black" }];

  // 방향 설정
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  // 연속 돌 개수 카운트
  let threeCount = 0;
  let fourCount = 0;

  // 연속 돌 개수 카운트
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

  // 6목 체크
  const isOverline = directions.some(([dx, dy]) => countConsecutive(dx, dy) >= 6);

  for (const [dx, dy] of directions) {
    const line = getLine(testStones, x, y, dx, dy, boardSize);

    // 여기서 33 44 체크하는 로직 추가

    // 열린3 한 수를 두면 열린 4를 만들 수 있는 상태.
    // 닫힌3
    // 열린4
    // 닫힌4
    // 띈4

    console.log("direction", [dx, dy]);
    console.log("line", line);
    // 연속 33 44 체크
    // const { openThree, openFour } = checkOpenThreeFour(line);
    const openThree = checkThree(line);
    const openFour = checkOpenFour(line);

    if (openThree) threeCount++;
    if (openFour) fourCount++;
  }

  return threeCount >= 2 || fourCount >= 2 || isOverline;
};

const getLine = (stones: Stone[], x: number, y: number, dx: number, dy: number, boardSize: number): Color[] => {
  const line: Color[] = [];
  for (let i = -5; i <= 5; i++) {
    const nx = x + dx * i;
    const ny = y + dy * i;
    if (nx < 0 || ny < 0 || nx >= boardSize || ny >= boardSize) {
      line.push(null);
    } else {
      const stone = stones.find((s) => s.x === nx && s.y === ny);
      line.push(stone?.color ?? null);
    }
  }
  return line;
};

const checkThree = (line: Color[]) => {
  const str = line.map((c) => (c === "black" ? "1" : c === "white" ? "2" : "0")).join("");

  console.log("str", str);
  const openThreePatterns = [/01110/, /010110/, /011010/, /0101010/];
  const closedThreePatterns = [/2111/, /1112/, /2011102/, /21011/, /10112/, /21101/, /11012/, /0101010/];

  for (const pattern of openThreePatterns) {
    const match = str.match(pattern);
    if (match && match.index !== undefined) {
      const start = match.index;
      const end = start + match[0].length - 1;

      const left = str[start - 1];
      const right = str[end + 1];

      console.log("matched:", str.substring(start, end + 1), "| left:", left, "| right:", right);

      if ((left === "0" || left === undefined) && (right === "0" || right === undefined)) {
        return true;
      }
    }
  }

  return false;
};

const checkOpenFour = (line: Color[]) => {
  const str = line.map((c) => (c === "black" ? "1" : c === "white" ? "2" : "0")).join("");
  const openFourPatterns = [/011110/, /0101110/, /0110110/, /0111010/, /01011010/];

  return openFourPatterns.some((p) => p.test(str));
};
