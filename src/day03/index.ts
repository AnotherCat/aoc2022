import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split(/\n/);
};

const getPriority = (item: string): number => {
  const code = item.charCodeAt(0);
  if (code > 96) {
    return code - 96;
  } else {
    // Uppercase
    return code - 38;
  }
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const priorities = lines.map((line) => {
    //console.log(line.length, Math.floor(line.length / 2));
    const first = line.slice(0, Math.floor(line.length / 2));
    const second = line.slice(Math.floor(line.length / 2), line.length);
    const itemsFirst = first.split("");
    const itemsSecond = second.split("");

    const crossover = itemsFirst.filter((value) => itemsSecond.includes(value));
    //console.log(crossover[0], first, second, getPriority(crossover[0]));
    return getPriority(crossover[0]);
  });

  const totalPriorities = priorities.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  return totalPriorities;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const groups: string[][][] = [];
  for (let index = 0; index < Math.floor(input.length / 3); index++) {
    const startPosition = index * 3;
    groups.push([
      input[startPosition].split(""),
      input[startPosition + 1].split(""),
      input[startPosition + 2].split(""),
    ]);
  }
  const priorities = groups.map((group) => {
    const badges = group[0]
      .filter((value) => group[1].includes(value))
      .filter((value) => group[2].includes(value));
    return getPriority(badges[0]);
  });

  const totalPriorities = priorities.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  return totalPriorities;
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
