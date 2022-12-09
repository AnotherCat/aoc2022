import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const testString = (rawInput: string): boolean => {
  const first = rawInput.split("");
  const second = rawInput.split("");

  for (let index = 0; index < first.length; index++) {
    const element = first[index];
    const b = second.filter((a) => a === element);
    if (b.length > 1) {
      return false;
    }
  }
  return true;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const chars = input.split("");
  for (let index = 3; index < chars.length; index++) {
    const marker = chars.slice(index - 3, index + 1);
    if (testString(marker.join(""))) {
      return index + 1;
    }
  }
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const chars = input.split("");
  for (let index = 14; index < chars.length; index++) {
    const marker = chars.slice(index - 13, index + 1);
    if (testString(marker.join(""))) {
      return index + 1;
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 6,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 10,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 23,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 29,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
