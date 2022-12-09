import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // Numbers seperated by newlines, grouped by an extra newline
  // get the sum of each group - and then return the largest group
  const groups = input.split(/\n{2,}/);
  const sums = groups.map((group) => {
    const numbers = group.split(/\n/);
    return numbers.reduce((acc, num) => acc + parseInt(num), 0);
  });
  return Math.max(...sums);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // Same as part1, excpet we need to return the sum (as a sumber) of the top 3 groups
  const groups = input.split(/\n{2,}/);
  const sums = groups.map((group) => {
    const numbers = group.split(/\n/);
    return numbers.reduce((acc, num) => acc + parseInt(num), 0);
  });
  return sums
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, num) => acc + num, 0);
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
