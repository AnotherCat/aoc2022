import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [stacksRaw, movesRaw] = rawInput.split("\n\n");
  const rows = stacksRaw.split("\n");
  const maxHeight = rows.length - 1;
  const numStacks = rows[maxHeight].split("  ").length;
  const stacks: string[][] = Array.from(Array(numStacks), () => []);
  for (let index = 1; index <= maxHeight; index++) {
    const row = rows[maxHeight - index];
    for (let itemIndex = 0; itemIndex < numStacks; itemIndex++) {
      const item = row[itemIndex * 4 + 1];
      if (!!item && item !== " ") {
        stacks[itemIndex].push(item);
      }
    }
  }
  const moves = movesRaw.split("\n").map((move) => {
    const movesSplit = move.split(" ");
    return {
      num: Number(movesSplit[1]),
      from: Number(movesSplit[3]),
      to: Number(movesSplit[5]),
    };
  });
  return { stacks, moves };
};

const part1 = (rawInput: string) => {
  const { stacks, moves } = parseInput(rawInput);

  moves.forEach((move) => {
    for (let index = 0; index < move.num; index++) {
      const item = stacks[move.from - 1].pop();
      if (item) {
        stacks[move.to - 1].push(item);
      }
    }
  });
  let result = "";
  stacks.forEach((stack) => {
    result = result + stack.pop();
  });

  return result;
};

const part2 = (rawInput: string) => {
  const { stacks, moves } = parseInput(rawInput);

  moves.forEach((move) => {
    stacks[move.to - 1] = stacks[move.to - 1].concat(
      stacks[move.from - 1].slice(move.num * -1),
    );
    stacks[move.from - 1] = stacks[move.from - 1].slice(0, move.num * -1);
  });
  let result = "";
  stacks.forEach((stack) => {
    result = result + stack.pop();
  });

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
[   [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
[   [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
