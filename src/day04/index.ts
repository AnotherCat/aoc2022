import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const pairs = rawInput.split("\n");
  const parsedPairs = pairs.map((pair) => {
    const [first, second] = pair.split(",");
    const [firstStartString, firstEndString] = first.split("-");
    const [secondStartString, secondEndString] = second.split("-");
    const pairNumerical = {
      first: {
        start: Number(firstStartString),
        end: Number(firstEndString),
      },
      second: {
        start: Number(secondStartString),
        end: Number(secondEndString),
      },
    };
    return pairNumerical;
  });
  return parsedPairs;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;
  input.forEach((pair) => {
    // first inside second
    if (
      pair.first.start >= pair.second.start &&
      pair.first.end <= pair.second.end
    ) {
      total++;
    } // second inside first
    else if (
      pair.second.start >= pair.first.start &&
      pair.second.end <= pair.first.end
    ) {
      total++;
    }
  });

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;
  input.forEach((pair) => {
    let isOverlapped = true;

    if (
      // first fully before second
      pair.first.end < pair.second.start ||
      // first fully after second
      pair.first.start > pair.second.end
    ) {
      isOverlapped = false;
    } else {
      total++;
    }
  });

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
