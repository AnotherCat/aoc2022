import run from "aocrunner";

type Direction = "N" | "S" | "E" | "W";

interface MetaData {
  elfs: Record<string, Elf>;
  propositions: Record<string, number>;
}

class Elf {
  meta: MetaData;

  x: number;
  y: number;
  // x, y are cartesian coordinates
  proposed?: { x: number; y: number };
  constructor(x: number, y: number, meta: MetaData) {
    this.x = x;
    this.y = y;
    this.meta = meta;
  }

  get elfs() {
    return this.meta.elfs;
  }
  get propositions() {
    return this.meta.propositions;
  }

  getProposedPosition(direction: Direction): { x: number; y: number } {
    switch (direction) {
      case "N":
        return { x: this.x, y: this.y + 1 };
      case "S":
        return { x: this.x, y: this.y - 1 };
      case "E":
        return { x: this.x + 1, y: this.y };
      case "W":
        return { x: this.x - 1, y: this.y };
    }
  }
  propose({ x, y }: { x: number; y: number }) {
    this.proposed = { x, y };
    this.propositions[`${x},${y}`] = this.propositions[`${x},${y}`]
      ? this.propositions[`${x},${y}`] + 1
      : 1;
  }
  tryPropose(remainder: number) {
    // Check the 8 surrounding squares
    // if all are empty don't go anywhere
    // otherwsie
    // check N, NE, NW if all empty propose N
    // check S, SE, SW if all empty propose S
    // check W, NW, SW if all empty propose W
    // check E, NE, SE if all empty propose E
    // if remainder === 0, then we start with N
    // 1, S
    // 2, W
    // 3, E

    // this.propositions is to check for conflicts - if there is a conflict in the next step no one proposing that position can move

    const priorities: Direction[] = ["N", "S", "W", "E"];
    // shift the priorities based on the remainder
    for (let i = 0; i < remainder; i++) {
      priorities.push(priorities.shift()!);
    }

    let validProposePosition: { x: number; y: number } | undefined;
    let NEmpty = false;
    let SEmpty = false;
    let EEmpty = false;
    let WEmpty = false;
    //console.log(priorities);

    for (const direction of priorities) {
      let proposedPosition = this.getProposedPosition(direction);
      //console.log(proposedPosition, direction);
      let valid = false;
      switch (direction) {
        case "N":
          // check spots N, NE, NW of current position
          valid = NEmpty =
            this.elfs[`${proposedPosition.x},${proposedPosition.y}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x + 1},${proposedPosition.y}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x - 1},${proposedPosition.y}`] ===
              undefined;
          /*console.log(
            this.elfs[`${proposedPosition.x},${proposedPosition.y}`],
            this.elfs[`${proposedPosition.x + 1},${proposedPosition.y}`],
            this.elfs[`${proposedPosition.x - 1},${proposedPosition.y}`],
          );
          console.log(valid);*/
          break;

        case "S":
          // check spots S, SE, SW of current position
          valid = SEmpty =
            this.elfs[`${proposedPosition.x},${proposedPosition.y}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x + 1},${proposedPosition.y}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x - 1},${proposedPosition.y}`] ===
              undefined;
          break;

        case "E":
          // check spots E, NE, SE of current position
          valid = EEmpty =
            this.elfs[`${proposedPosition.x},${proposedPosition.y}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x},${proposedPosition.y + 1}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x},${proposedPosition.y - 1}`] ===
              undefined;
          break;
        case "W":
          // check spots W, NW, SW of current position
          valid = WEmpty =
            this.elfs[`${proposedPosition.x},${proposedPosition.y}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x},${proposedPosition.y + 1}`] ===
              undefined &&
            this.elfs[`${proposedPosition.x},${proposedPosition.y - 1}`] ===
              undefined;
          break;

        default:
          break;
      }
      //console.log(valid);
      if (valid && validProposePosition === undefined) {
        //console.log("valid", proposedPosition);
        validProposePosition = proposedPosition;
      }
    }
    // if we have a valid position, and at least one direction is occupied (occupied when = false), propose it
    //console.log(validProposePosition, NEmpty, SEmpty, EEmpty, WEmpty);
    if (validProposePosition && !(NEmpty && SEmpty && EEmpty && WEmpty)) {
      this.propose(validProposePosition);
    }
  }
  move(key: string) {
    // also check if more than one elf is proposing the same position
    // if so, don't move
    // also must move key

    if (
      this.proposed &&
      this.propositions[`${this.proposed.x},${this.proposed.y}`] === 1
    ) {
      this.x = this.proposed.x;
      this.y = this.proposed.y;
      this.proposed = undefined;
      this.elfs[`${this.x},${this.y}`] = this;
      delete this.elfs[key];
      return true;
    } else {
      // also reset proposed
      this.proposed = undefined;
      return false;
    }
  }
}

const parseInput = (rawInput: string) => {
  const elfs: Record<string, Elf> = {};
  const propositions: Record<string, number> = {};
  const lines = rawInput.split("\n");
  // an occupied square (#) is an elf
  // an unoccupied square (.) is an empty space
  // we are using cartesian coordinates
  // x is the horizontal axis, increasing to the right
  // y is the vertical axis, increasing up
  // top left is 0,0
  // during the process elves may move into positive y (above x axis) or negative x (left of y axis)
  const meta = { elfs, propositions };

  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === "#") {
        // cartesian coordinates, so therefore y must be inverted

        elfs[`${x},${-1 * y}`] = new Elf(x, -1 * y, meta);
      }
    });
  });
  return meta;
};

const drawElfs = (elfs: Record<string, Elf>) => {
  // log a grid, where (#) is an elf and (.) is an empty space
  // first find max and min x and y
  let maxX = 0;
  let minX = 0;
  let maxY = 0;
  let minY = 0;
  Object.keys(elfs).forEach((key) => {
    const [x, y] = key.split(",").map((n) => parseInt(n));
    if (x > maxX) {
      maxX = x;
    }
    if (x < minX) {
      minX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (y < minY) {
      minY = y;
    }
  });
  // now draw the grid
  let grid = "";
  console.log(maxX, minX, maxY, minY);
  for (let y = maxY; y >= minY; y--) {
    for (let x = minX; x <= maxX; x++) {
      if (elfs[`${x},${y}`]) {
        grid += "#";
      } else {
        grid += ".";
      }
    }
    grid += "\n";
  }
  console.log(grid);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let keepGoing = true;
  let cycle = 0;
  while (keepGoing && cycle < 10) {
    //console.log(cycle);
    //drawElfs(input.elfs);
    // loop through each elf and propose a move for each
    // then loop through each elf and move that elf
    // if no elf moves, we are done
    // after each cycle reset the propositions
    const rem = cycle % 4;
    Object.keys(input.elfs).forEach((key) => {
      input.elfs[key].tryPropose(rem);
    });
    let moved = false;
    //console.log(input.propositions);
    Object.keys(input.elfs).forEach((key) => {
      if (input.elfs[key].move(key)) {
        moved = true;
      }
    });
    if (!moved) {
      keepGoing = false;
    }
    //console.log(cycle);

    // reset propositions
    // this much change the .propositions on *each* elf

    input.propositions = {};
    //console.log(Object.values(input.elfs)[0].propositions);
    cycle++;
  }
  // now find the number of empty spaces in the retangle defined by the elfs
  // do this by finding the max and min x and y
  // finding the number of empty spaces is the same as finding the number of spaces - occupied spaces

  // find the max and min x and y
  let maxX = 0;
  let minX = 0;
  let maxY = 0;
  let minY = 0;
  Object.keys(input.elfs).forEach((key) => {
    const [x, y] = key.split(",").map((n) => parseInt(n));
    if (x > maxX) {
      maxX = x;
    }
    if (x < minX) {
      minX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (y < minY) {
      minY = y;
    }
  });
  // now find the number of elfs
  const numElfs = Object.keys(input.elfs).length;
  // now find the number of spaces in the rectangle
  const numSpaces = (maxX - minX + 1) * (maxY - minY + 1);
  // now find the number of empty spaces
  const numEmptySpaces = numSpaces - numElfs;
  return numEmptySpaces;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let keepGoing = true;
  let cycle = 0;
  while (keepGoing) {
    //console.log(cycle);
    //drawElfs(input.elfs);
    // loop through each elf and propose a move for each
    // then loop through each elf and move that elf
    // if no elf moves, we are done
    // after each cycle reset the propositions
    const rem = cycle % 4;
    Object.keys(input.elfs).forEach((key) => {
      input.elfs[key].tryPropose(rem);
    });
    let moved = false;
    //console.log(input.propositions);
    Object.keys(input.elfs).forEach((key) => {
      if (input.elfs[key].move(key)) {
        moved = true;
      }
    });
    if (!moved) {
      keepGoing = false;
    }
    //console.log(cycle);

    // reset propositions
    // this much change the .propositions on *each* elf

    input.propositions = {};
    //console.log(Object.values(input.elfs)[0].propositions);
    cycle++;
  }

  return cycle;
};

run({
  part1: {
    tests: [
      {
        input: `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`,
        expected: 110,
      },
      {
        input: `.....
..##.
..#..
.....
..##.
.....`,
        expected: 25,
      },
      {
        input: `################################
################################
##............................##
##.#...#.####.####.####.#...#.##
##.##.##.#....#..#.#..#..#.#..##
##.#.#.#.###..####.####...#...##
##.#...#.#....#.#..#.#....#...##
##.#...#.####.#..#.#..#...#...##
##............................##
################################
##............................##
##...#...#.#...#..##...###....##
##....#.#..##.##.#..#.#.......##
##.....#...#.#.#.####..###....##
##....#.#..#...#.#..#.....#...##
##...#...#.#...#.#..#..###....##
##............................##
################################
################################`,
        expected: 812,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`,
        expected: 20,
      },
      {
        input: `################################
################################
##............................##
##.#...#.####.####.####.#...#.##
##.##.##.#....#..#.#..#..#.#..##
##.#.#.#.###..####.####...#...##
##.#...#.#....#.#..#.#....#...##
##.#...#.####.#..#.#..#...#...##
##............................##
################################
##............................##
##...#...#.#...#..##...###....##
##....#.#..##.##.#..#.#.......##
##.....#...#.#.#.####..###....##
##....#.#..#...#.#..#.....#...##
##...#...#.#...#.#..#..###....##
##............................##
################################
################################`,
        expected: 183,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
