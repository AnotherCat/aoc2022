import run from "aocrunner";

interface Pos {
  x: number;
  y: number;
}

const parseInput = (rawInput: string) => {
  const data: number[][] = [];
  let startIndex: Pos;
  let endIndex: Pos;
  rawInput.split("\n").forEach((line, index) => {
    data[index] = line.split("").map((a, indexR) => {
      if (a === "S") {
        a = "a";
        startIndex = { x: indexR, y: index };
      } else if (a === "E") {
        a = "z";
        endIndex = { x: indexR, y: index };
      }
      const code = a.charCodeAt(0);

      return code - 96;
    });
  });

  return { data, startIndex, endIndex };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const potentialPathLengths: number[] = [];
  const followMap = (
    previousPositions: Pos[],
    currentPosition: Pos,
    steps: number,
  ) => {
    let solved = false;
    while (true) {
      if (currentPosition === input.endIndex) {
        solved = true;
        break;
      }
      const curr = input.data[currentPosition.y][currentPosition.x];
      const possibleNextSteps: string[] = [];
      if (
        currentPosition.x < input.data[0].length - 1 &&
        (input.data[currentPosition.y][currentPosition.x + 1] <= curr ||
          input.data[currentPosition.y][currentPosition.x + 1] == curr + 1) &&
        previousPositions.indexOf({
          x: currentPosition.x + 1,
          y: currentPosition.y,
        }) === -1 &&
        previousPositions.find((value) => {
          return (
            value.x === currentPosition.x + 1 && value.y === currentPosition.y
          );
        }) === undefined
      ) {
        possibleNextSteps.push("r");
      }
      if (
        currentPosition.x > 0 &&
        (input.data[currentPosition.y][currentPosition.x - 1] <= curr ||
          input.data[currentPosition.y][currentPosition.x - 1] == curr + 1) &&
        previousPositions.indexOf({
          x: currentPosition.x - 1,
          y: currentPosition.y,
        }) === -1 &&
        previousPositions.find((value) => {
          return (
            value.x === currentPosition.x - 1 && value.y === currentPosition.y
          );
        }) === undefined
      ) {
        possibleNextSteps.push("l");
      }
      if (
        currentPosition.y < input.data.length - 1 &&
        (input.data[currentPosition.y + 1][currentPosition.x] <= curr ||
          input.data[currentPosition.y + 1][currentPosition.x] == curr + 1) &&
        previousPositions.indexOf({
          x: currentPosition.x,
          y: currentPosition.y + 1,
        }) === -1 &&
        previousPositions.find((value) => {
          return (
            value.x === currentPosition.x && value.y === currentPosition.y + 1
          );
        }) === undefined
      ) {
        possibleNextSteps.push("d");
      }
      if (
        currentPosition.y > 0 &&
        (input.data[currentPosition.y - 1][currentPosition.x] <= curr ||
          input.data[currentPosition.y - 1][currentPosition.x] == curr + 1) &&
        previousPositions.indexOf({
          x: currentPosition.x,
          y: currentPosition.y - 1,
        }) === -1 &&
        previousPositions.find((value) => {
          return (
            value.x === currentPosition.x && value.y === currentPosition.y - 1
          );
        }) === undefined
      ) {
        possibleNextSteps.push("u");
      }
      //console.log(possibleNextSteps, curr, currentPosition);
      if (possibleNextSteps.length === 0) {
        break;
      }
      possibleNextSteps.forEach((step, index) => {
        const nextPosition: Pos = {
          x:
            step === "r"
              ? currentPosition.x + 1
              : step === "l"
              ? currentPosition.x - 1
              : step === "d"
              ? currentPosition.x
              : currentPosition.x,
          y:
            step === "d"
              ? currentPosition.y + 1
              : step === "u"
              ? currentPosition.y - 1
              : step === "l"
              ? currentPosition.y
              : currentPosition.y,
        };
        if (index === possibleNextSteps.length - 1) {
          previousPositions.push({ ...currentPosition });
          currentPosition = nextPosition;
          steps++;
        } else {
          followMap(
            previousPositions.concat([currentPosition]),
            nextPosition,
            steps + 1,
          );
        }
      });
    }
    if (solved) {
      potentialPathLengths.push(steps);
    }
  };
  followMap([], input.startIndex, 0);
  console.log(potentialPathLengths);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return;
};

run({
  part1: {
    tests: [
      {
        input: `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
