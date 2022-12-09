import run from "aocrunner";

enum Direction {
  RIGHT,
  LEFT,
  UP,
  DOWN,
}

interface Step {
  direction: Direction;
  amount: number;
}

const parseInput = (rawInput: string) => {
  let data: Step[] = [];
  rawInput.split("\n").forEach((line) => {
    let direction: Direction;
    switch (line.slice(0, 1)) {
      case "R":
        direction = Direction.RIGHT;
        break;
      case "L":
        direction = Direction.LEFT;
        break;
      case "U":
        direction = Direction.UP;
        break;

      default:
        direction = Direction.DOWN;
        break;
    }
    data.push({
      direction: direction,
      amount: Number(line.slice(2)),
    });
  });
  return data;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let posH = { x: 0, y: 0 };
  let posT = { x: 0, y: 0 };
  const THistory: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  const updateTPos = () => {
    const xDist = posH.x - posT.x;
    const yDist = posH.y - posT.y;
    if (
      !(
        (xDist === 0 && yDist === 0) ||
        Math.sqrt(xDist * xDist + yDist * yDist) === 1 ||
        (Math.abs(xDist) === 1 && Math.abs(yDist) === 1)
      )
    ) {
      // T must move
      if (yDist === 0) {
        // horizontal
        if (xDist > 0) {
          // Move right (H's x greater than T's)
          posT.x++;
        } else {
          posT.x--;
          // Move left (H's x less than T's)
        }
      } else if (xDist === 0) {
        // vertical
        if (yDist > 0) {
          // Move up (H's y greater than T's)
          posT.y++;
        } else {
          posT.y--;
          // Move down (H's x less than T's)
        }
      } else {
        // Diagonal!!
        if (yDist > 0) {
          // Move up
          if (xDist > 0) {
            // Move Right
            posT.x++;
            posT.y++;
          } else {
            // Move Left
            posT.x--;
            posT.y++;
          }
        } else {
          // Move down
          if (xDist > 0) {
            // Move Right
            posT.x++;
            posT.y--;
          } else {
            // Move Left
            posT.x--;
            posT.y--;
          }
        }
      }
      THistory.push({ x: posT.x, y: posT.y });
    }
  };
  input.forEach((stepData) => {
    for (let step = 0; step < stepData.amount; step++) {
      if (stepData.direction === Direction.RIGHT) {
        posH.x++;
      } else if (stepData.direction === Direction.LEFT) {
        posH.x--;
      } else if (stepData.direction === Direction.DOWN) {
        posH.y--;
      } else {
        // UP
        posH.y++;
      }
      updateTPos();
      //console.log(posH, posT);
    }
  });
  const parseTHistory: { [pos: string]: true } = {};
  THistory.forEach((hist) => {
    parseTHistory[`${hist.x}-${hist.y}`] = true;
  });
  return Object.keys(parseTHistory).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let posH = { x: 0, y: 0 };
  const THistory: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  const positions: { x: number; y: number }[] = Array.from(Array(9), () => ({
    x: 0,
    y: 0,
  }));
  const updateTPos = () => {
    for (let index = 0; index < positions.length; index++) {
      const posFollow = positions[index];
      let posLead: { x: number; y: number };
      if (index === 0) {
        posLead = posH;
      } else {
        posLead = positions[index - 1];
      }
      const xDist = posLead.x - posFollow.x;
      const yDist = posLead.y - posFollow.y;
      if (
        !(
          (xDist === 0 && yDist === 0) ||
          Math.sqrt(xDist * xDist + yDist * yDist) === 1 ||
          (Math.abs(xDist) === 1 && Math.abs(yDist) === 1)
        )
      ) {
        // T must move
        if (yDist === 0) {
          // horizontal
          if (xDist > 0) {
            // Move right (H's x greater than T's)
            posFollow.x++;
          } else {
            posFollow.x--;
            // Move left (H's x less than T's)
          }
        } else if (xDist === 0) {
          // vertical
          if (yDist > 0) {
            // Move up (H's y greater than T's)
            posFollow.y++;
          } else {
            posFollow.y--;
            // Move down (H's x less than T's)
          }
        } else {
          // Diagonal!!
          if (yDist > 0) {
            // Move up
            if (xDist > 0) {
              // Move Right
              posFollow.x++;
              posFollow.y++;
            } else {
              // Move Left
              posFollow.x--;
              posFollow.y++;
            }
          } else {
            // Move down
            if (xDist > 0) {
              // Move Right
              posFollow.x++;
              posFollow.y--;
            } else {
              // Move Left
              posFollow.x--;
              posFollow.y--;
            }
          }
        }
      }
    }
    THistory.push({ x: positions[8].x, y: positions[8].y });
  };
  input.forEach((stepData) => {
    for (let step = 0; step < stepData.amount; step++) {
      if (stepData.direction === Direction.RIGHT) {
        posH.x++;
      } else if (stepData.direction === Direction.LEFT) {
        posH.x--;
      } else if (stepData.direction === Direction.DOWN) {
        posH.y--;
      } else {
        // UP
        posH.y++;
      }
      updateTPos();
      //console.log(posH, posT);
    }
  });
  const parseTHistory: { [pos: string]: true } = {};
  THistory.forEach((hist) => {
    parseTHistory[`${hist.x}-${hist.y}`] = true;
  });
  return Object.keys(parseTHistory).length;
};

run({
  part1: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 1,
      },
      {
        input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
